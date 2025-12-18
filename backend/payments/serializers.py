from rest_framework import serializers
from .models import Payment
from orders.models import Order


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment details"""

    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'reference', 'order', 'amount', 'currency',
            'status', 'status_display', 'card_last_four', 'card_brand',
            'card_holder_name', 'created_at', 'paid_at'
        ]
        read_only_fields = ['id', 'reference', 'created_at', 'paid_at']


class ProcessPaymentSerializer(serializers.Serializer):
    """Serializer for processing mock payment"""

    order_id = serializers.IntegerField()
    card_number = serializers.CharField(max_length=19)
    card_expiry = serializers.CharField(max_length=7)  # MM/YY or MM/YYYY
    card_cvv = serializers.CharField(max_length=4)
    card_holder_name = serializers.CharField(max_length=100)

    def validate_order_id(self, value):
        user = self.context['request'].user

        try:
            order = Order.objects.get(id=value, user=user)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found")

        if order.payment_status == 'paid':
            raise serializers.ValidationError("Order is already paid")

        if order.status == 'cancelled':
            raise serializers.ValidationError("Cannot pay for cancelled order")

        return value

    def validate_card_number(self, value):
        # Remove spaces and dashes
        card = value.replace(' ', '').replace('-', '')

        if not card.isdigit():
            raise serializers.ValidationError("Card number must contain only digits")

        if len(card) < 13 or len(card) > 19:
            raise serializers.ValidationError("Invalid card number length")

        return card

    def validate_card_expiry(self, value):
        import re
        if not re.match(r'^\d{2}/\d{2,4}$', value):
            raise serializers.ValidationError("Expiry must be in MM/YY or MM/YYYY format")
        return value

    def validate_card_cvv(self, value):
        if not value.isdigit() or len(value) < 3 or len(value) > 4:
            raise serializers.ValidationError("CVV must be 3 or 4 digits")
        return value