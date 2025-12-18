from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_price',
            'product_image', 'product_slug', 'quantity', 'subtotal'
        ]
        read_only_fields = ['id', 'product_name', 'product_price', 'product_image', 'product_slug']

    def get_subtotal(self, obj):
        """Get subtotal safely"""
        return str(obj.get_subtotal())


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders (read)"""

    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'status_display', 'payment_status', 'payment_status_display',
            'shipping_address', 'shipping_city', 'shipping_country', 'shipping_phone',
            'subtotal', 'shipping_cost', 'tax', 'total', 'notes',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'subtotal', 'shipping_cost', 'tax', 'total', 'created_at', 'updated_at']


class CreateOrderItemSerializer(serializers.Serializer):
    """Serializer for creating order items"""

    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating a new order"""

    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_country = serializers.CharField(max_length=100)
    shipping_phone = serializers.CharField(max_length=20)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    items = CreateOrderItemSerializer(many=True)

    def validate_items(self, value):
        """Validate items exist and have stock"""
        if not value:
            raise serializers.ValidationError("Order must have at least one item")

        for item in value:
            try:
                product = Product.objects.get(id=item['product_id'])
                if product.stock < item['quantity']:
                    raise serializers.ValidationError(
                        f"Not enough stock for {product.name}. Available: {product.stock}"
                    )
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product {item['product_id']} not found")

        return value

    def create(self, validated_data):
        """Create order with items"""
        user = self.context['request'].user
        items_data = validated_data.pop('items')

        # Create order
        order = Order.objects.create(
            user=user,
            shipping_address=validated_data['shipping_address'],
            shipping_city=validated_data['shipping_city'],
            shipping_country=validated_data['shipping_country'],
            shipping_phone=validated_data['shipping_phone'],
            notes=validated_data.get('notes', ''),
        )

        # Create order items and reduce stock
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])

            # Get primary image URL
            primary_image = product.images.filter(is_primary=True).first()
            if not primary_image:
                primary_image = product.images.first()

            image_url = None
            if primary_image:
                image_url = primary_image.image.url

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_price=product.price,
                product_image=image_url,
                product_slug=product.slug,
                quantity=item_data['quantity'],
            )

            # Reduce product stock
            product.stock -= item_data['quantity']
            product.save()

        # Calculate totals
        order.calculate_totals()

        return order