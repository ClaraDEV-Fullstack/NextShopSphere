from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for reading reviews"""

    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_avatar', 'product',
            'rating', 'title', 'comment', 'is_verified_purchase',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        """Get user's display name"""
        if obj.user.first_name:
            return f"{obj.user.first_name} {obj.user.last_name or ''}".strip()
        return obj.user.username

    def get_user_avatar(self, obj):
        """Get user's avatar URL"""
        if obj.user.avatar:
            return obj.user.avatar.url
        return None


class CreateReviewSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating reviews"""

    class Meta:
        model = Review
        fields = ['product', 'rating', 'title', 'comment']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        product = attrs.get('product')

        # Check if user already reviewed this product (for create only)
        if not self.instance:  # Creating new review
            if Review.objects.filter(user=user, product=product).exists():
                raise serializers.ValidationError({
                    "product": "You have already reviewed this product"
                })

        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductReviewStatsSerializer(serializers.Serializer):
    """Serializer for product review statistics"""

    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()