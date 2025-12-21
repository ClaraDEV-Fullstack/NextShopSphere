from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer
# from .emails import send_order_confirmation_email  # Comment this out
import logging
import os

logger = logging.getLogger(__name__)

@extend_schema_view(
    list=extend_schema(tags=['Orders']),
    retrieve=extend_schema(tags=['Orders']),
    create=extend_schema(tags=['Orders']),
)
class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for customer orders"""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        """Return only orders for current user"""
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Use different serializer for creating orders"""
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        """Create a new order"""
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            order = serializer.save()

            # Skip email for now - it causes timeout on free tier
            logger.info(f"Order #{order.id} created successfully")

            # TODO: Add async email later
            # try:
            #     email_sent = send_order_confirmation_email(order)
            #     logger.info(f"Order #{order.id} email sent: {email_sent}")
            # except Exception as e:
            #     logger.error(f"Failed to send order email: {str(e)}")

            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Cancel/Delete an order - only if pending or processing"""
        order = self.get_object()

        if order.status not in ['pending', 'processing']:
            return Response(
                {'detail': f'Cannot cancel order with status "{order.get_status_display()}".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()

        order.status = 'cancelled'
        order.save()

        return Response(
            {'detail': 'Order cancelled successfully.'},
            status=status.HTTP_200_OK
        )

    @extend_schema(tags=['Orders'])
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Alternative cancel endpoint"""
        order = self.get_object()

        if order.status not in ['pending', 'processing']:
            return Response(
                {'detail': f'Cannot cancel order with status "{order.get_status_display()}".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()

        order.status = 'cancelled'
        order.save()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )