from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for reading reviews"""

    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_email', 'user_avatar', 'product',
            'rating', 'title', 'comment', 'is_verified_purchase',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        """Get user's display name"""
        if obj.user.first_name:
            return f"{obj.user.first_name} {obj.user.last_name or ''}".strip()
        return obj.user.username or obj.user.email.split('@')[0]

    def get_user_email(self, obj):
        """Get user's email for ownership check"""
        return obj.user.email if obj.user else None

    def get_user_avatar(self, obj):
        """Get user's avatar URL (absolute URL)"""
        if obj.user and obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
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