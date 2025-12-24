import time
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Payment
from .serializers import PaymentSerializer, ProcessPaymentSerializer
from orders.models import Order
from orders.emails import send_payment_confirmation_email
import logging

logger = logging.getLogger(__name__)


# Mock test cards
TEST_CARDS = {
    # Success cards
    '4242424242424242': {'status': 'success', 'brand': 'Visa'},
    '5555555555554444': {'status': 'success', 'brand': 'Mastercard'},
    '378282246310005': {'status': 'success', 'brand': 'American Express'},
    '6011111111111117': {'status': 'success', 'brand': 'Discover'},

    # Failure cards
    '4000000000000002': {'status': 'declined', 'brand': 'Visa', 'error': 'Card declined'},
    '4000000000009995': {'status': 'declined', 'brand': 'Visa', 'error': 'Insufficient funds'},
    '4000000000000069': {'status': 'declined', 'brand': 'Visa', 'error': 'Card expired'},
    '4000000000000127': {'status': 'declined', 'brand': 'Visa', 'error': 'Invalid CVV'},
}


def get_card_brand(card_number):
    """Determine card brand from number"""
    if card_number.startswith('4'):
        return 'Visa'
    elif card_number.startswith(('51', '52', '53', '54', '55')):
        return 'Mastercard'
    elif card_number.startswith(('34', '37')):
        return 'American Express'
    elif card_number.startswith('6011'):
        return 'Discover'
    else:
        return 'Unknown'


@extend_schema_view(
    list=extend_schema(tags=['Payments']),
    retrieve=extend_schema(tags=['Payments']),
)
class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing payments"""

    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    @extend_schema(tags=['Payments'])
    @action(detail=False, methods=['post'], url_path='process')
    def process_payment(self, request):
        """
        Process a mock payment and send confirmation email

        Test Cards:
        - 4242 4242 4242 4242 (Visa - Success)
        - 5555 5555 5555 4444 (Mastercard - Success)
        - 4000 0000 0000 0002 (Declined)
        - 4000 0000 0000 9995 (Insufficient funds)
        """

        serializer = ProcessPaymentSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        order = Order.objects.get(id=data['order_id'])
        card_number = data['card_number']

        # Simulate processing delay (1-2 seconds)
        time.sleep(1.5)

        # Check test card or use default behavior
        card_info = TEST_CARDS.get(card_number)

        if card_info:
            card_brand = card_info['brand']
            payment_status = card_info['status']
            error_message = card_info.get('error')
        else:
            # Default: Accept any valid-looking card
            card_brand = get_card_brand(card_number)
            payment_status = 'success'
            error_message = None

        # Create or update payment record
        payment, created = Payment.objects.update_or_create(
            order=order,
            defaults={
                'user': request.user,
                'amount': order.total,
                'card_last_four': card_number[-4:],
                'card_brand': card_brand,
                'card_holder_name': data['card_holder_name'],
            }
        )

        if payment_status == 'success':
            # Payment successful
            payment.status = 'successful'
            payment.paid_at = timezone.now()
            payment.save()

            # Update order status
            order.payment_status = 'paid'
            order.status = 'processing'
            order.save()

            # Send payment confirmation email
            email_sent = False
            try:
                email_sent = send_payment_confirmation_email(order)
                logger.info(f"Payment for order #{order.id} successful. Email sent: {email_sent}")
            except Exception as e:
                logger.error(f"Failed to send payment email: {str(e)}")
                # Don't fail the payment if email fails

            return Response({
                'status': 'success',
                'message': 'Payment processed successfully',
                'payment': PaymentSerializer(payment).data,
                'order_id': order.id,
                'email_sent': email_sent,
            })
        else:
            # Payment failed
            payment.status = 'failed'
            payment.error_message = error_message
            payment.save()

            logger.warning(f"Payment failed for order #{order.id}: {error_message}")

            return Response({
                'status': 'failed',
                'message': error_message or 'Payment failed',
                'payment': PaymentSerializer(payment).data,
            }, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(tags=['Payments'])
    @action(detail=False, methods=['get'], url_path='order/(?P<order_id>[^/.]+)')
    def get_by_order(self, request, order_id=None):
        """Get payment for a specific order"""

        try:
            payment = Payment.objects.get(
                order_id=order_id,
                user=request.user
            )
            return Response(PaymentSerializer(payment).data)
        except Payment.DoesNotExist:
            return Response(
                {'detail': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )