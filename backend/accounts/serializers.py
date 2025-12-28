from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from urllib.parse import unquote
import re

User = get_user_model()


def get_cloudinary_url(image_field):
    """Extract clean Cloudinary URL from image field"""
    if not image_field:
        return None

    try:
        if hasattr(image_field, 'url'):
            url = image_field.url
        else:
            url = str(image_field)

        if not url:
            return None

        # Decode URL-encoded characters
        if '%3A' in url or '%2F' in url:
            url = unquote(url)

        # Fix malformed URLs
        if '/media/' in url and 'cloudinary' in url:
            url = url.replace('/media/', '')
            if not url.startswith('http'):
                url = 'https://' + url.lstrip('/')

        if url.startswith('/https:/'):
            url = 'https://' + url[8:]
        elif url.startswith('/https://'):
            url = url[1:]
        elif url.startswith('https:/') and not url.startswith('https://'):
            url = 'https://' + url[7:]

        # Check for res.cloudinary.com
        if 'res.cloudinary.com' in url and not url.startswith('http'):
            match = re.search(r'(res\.cloudinary\.com/[^\s]+)', url)
            if match:
                url = 'https://' + match.group(1)

        # If already a valid URL, return it
        if url.startswith('https://') or url.startswith('http://'):
            return url

        return url

    except Exception as e:
        print(f"Error getting image URL: {e}")
        return None


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details and profile updates"""

    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'phone', 'address', 'city', 'country', 'avatar', 'avatar_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'username', 'created_at', 'updated_at', 'avatar_url']

    def get_avatar_url(self, obj):
        """Return full URL for avatar (Cloudinary compatible)"""
        return get_cloudinary_url(obj.avatar)

    def update(self, instance, validated_data):
        """Update user profile fields"""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.city = validated_data.get('city', instance.city)
        instance.country = validated_data.get('country', instance.country)

        # Handle avatar if provided
        if 'avatar' in validated_data:
            instance.avatar = validated_data.get('avatar')

        instance.save()
        return instance


class AvatarUploadSerializer(serializers.ModelSerializer):
    """Serializer specifically for avatar upload"""

    class Meta:
        model = User
        fields = ['avatar']

    def validate_avatar(self, value):
        """Validate the uploaded avatar"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image size must be less than 5MB")

            # Check file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError(
                    "Only JPEG, PNG, GIF, and WebP images are allowed"
                )
        return value


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""

    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords don't match"})

        if attrs['current_password'] == attrs['new_password']:
            raise serializers.ValidationError({"new_password": "New password must be different from current password"})

        return attrs

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user