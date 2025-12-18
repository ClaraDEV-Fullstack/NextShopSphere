from rest_framework import serializers
from .models import WishlistItem
from products.serializers import ProductListSerializer


class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializer for wishlist items with product details"""

    product_details = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_details', 'created_at']
        read_only_fields = ['id', 'created_at']


class AddToWishlistSerializer(serializers.ModelSerializer):
    """Serializer for adding items to wishlist"""

    class Meta:
        model = WishlistItem
        fields = ['product']

    def validate_product(self, value):
        user = self.context['request'].user
        if WishlistItem.objects.filter(user=user, product=value).exists():
            raise serializers.ValidationError("Product already in wishlist")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)