from rest_framework import serializers
from django.db.models import Avg
from .models import (
    Category, Product, ProductImage, ProductSpecification,
    Brand, ShippingOption
)


# ============ BRAND SERIALIZERS ============

class BrandSerializer(serializers.ModelSerializer):
    """Full brand serializer"""
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = [
            'id', 'name', 'slug', 'logo', 'description',
            'website', 'is_featured', 'product_count'
        ]

    def get_product_count(self, obj):
        return obj.products.filter(is_available=True).count()


class BrandListSerializer(serializers.ModelSerializer):
    """Simplified brand serializer for lists"""

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo']


# ============ CATEGORY SERIALIZERS ============

class CategorySerializer(serializers.ModelSerializer):
    """Full category serializer with nested children"""
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'icon',
            'parent', 'parent_name', 'children', 'product_count',
            'is_active', 'featured', 'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('display_order', 'name')
        return CategoryListSerializer(children, many=True).data

    def get_product_count(self, obj):
        count = obj.products.filter(is_available=True).count()
        for child in obj.children.filter(is_active=True):
            count += child.products.filter(is_available=True).count()
        return count


class CategoryListSerializer(serializers.ModelSerializer):
    """Simplified category serializer for lists and dropdowns"""
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'icon', 'product_count', 'parent']

    def get_product_count(self, obj):
        return obj.products.filter(is_available=True).count()


class CategoryTreeSerializer(serializers.ModelSerializer):
    """Category with full tree structure for navigation"""
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image', 'children', 'product_count']

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('display_order', 'name')
        return CategoryTreeSerializer(children, many=True).data

    def get_product_count(self, obj):
        count = obj.products.filter(is_available=True).count()
        for child in obj.children.filter(is_active=True):
            count += child.products.filter(is_available=True).count()
        return count


# ============ PRODUCT IMAGE SERIALIZER ============
class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images"""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'is_primary', 'order']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        if obj.image:
            if hasattr(obj.image, 'url'):
                url = obj.image.url
                if url.startswith('http'):
                    return url
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(url)
                return url
        return None

# ============ PRODUCT SPECIFICATION SERIALIZER ============

class ProductSpecificationSerializer(serializers.ModelSerializer):
    """Serializer for product specifications"""

    class Meta:
        model = ProductSpecification
        fields = ['id', 'name', 'value', 'order']
        read_only_fields = ['id']


# ============ PRODUCT SERIALIZERS ============

class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list (optimized for listing pages)"""
    category = CategoryListSerializer(read_only=True)
    brand = BrandListSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    in_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description',
            'price', 'compare_price', 'discount_percentage',
            'category', 'brand', 'primary_image',
            'in_stock', 'stock', 'featured', 'is_new', 'is_bestseller',
            'average_rating', 'review_count', 'product_type'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            return ProductImageSerializer(primary, context=self.context).data
        return None

    def get_average_rating(self, obj):
        if hasattr(obj, 'reviews'):
            reviews = obj.reviews.filter(is_approved=True)
            if reviews.exists():
                avg = reviews.aggregate(Avg('rating'))['rating__avg']
                return round(avg, 1) if avg else 0
        return 0

    def get_review_count(self, obj):
        if hasattr(obj, 'reviews'):
            return obj.reviews.filter(is_approved=True).count()
        return 0

def get_primary_image(self, obj):
    primary = obj.images.filter(is_primary=True).first()
    if not primary:
        primary = obj.images.first()
    if primary:
        return ProductImageSerializer(primary, context=self.context).data
    return None

    def get_average_rating(self, obj):
        """Get average rating from reviews app"""
        if hasattr(obj, 'reviews'):
            reviews = obj.reviews.filter(is_approved=True)
            if reviews.exists():
                avg = reviews.aggregate(Avg('rating'))['rating__avg']
                return round(avg, 1) if avg else 0
        return 0

    def get_review_count(self, obj):
        """Get review count from reviews app"""
        if hasattr(obj, 'reviews'):
            return obj.reviews.filter(is_approved=True).count()
        return 0


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full product serializer for detail pages"""
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True,
        required=False,
        allow_null=True
    )
    images = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    in_stock = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'product_type', 'price', 'compare_price', 'discount_percentage',
            'sku', 'stock', 'is_available', 'in_stock', 'is_low_stock',
            'category', 'category_id', 'brand', 'brand_id',
            'weight', 'dimensions', 'meta_title', 'meta_description',
            'images', 'specifications',
            'featured', 'is_new', 'is_bestseller',
            'average_rating', 'review_count', 'related_products',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_average_rating(self, obj):
        """Get average rating from reviews app"""
        if hasattr(obj, 'reviews'):
            reviews = obj.reviews.filter(is_approved=True)
            if reviews.exists():
                avg = reviews.aggregate(Avg('rating'))['rating__avg']
                return round(avg, 1) if avg else 0
        return 0

    def get_review_count(self, obj):
        """Get review count from reviews app"""
        if hasattr(obj, 'reviews'):
            return obj.reviews.filter(is_approved=True).count()
        return 0

    def get_related_products(self, obj):
        related = Product.objects.filter(
            category=obj.category,
            is_available=True
        ).exclude(id=obj.id)[:4]
        return ProductListSerializer(related, many=True, context=self.context).data


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products"""
    specifications = ProductSpecificationSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'description', 'short_description',
            'product_type', 'price', 'compare_price',
            'sku', 'stock', 'low_stock_threshold', 'is_available',
            'category', 'brand', 'weight', 'dimensions',
            'meta_title', 'meta_description',
            'featured', 'is_new', 'is_bestseller',
            'specifications'
        ]

    def create(self, validated_data):
        specifications_data = validated_data.pop('specifications', [])
        product = Product.objects.create(**validated_data)
        for spec_data in specifications_data:
            ProductSpecification.objects.create(product=product, **spec_data)
        return product

    def update(self, instance, validated_data):
        specifications_data = validated_data.pop('specifications', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if specifications_data is not None:
            instance.specifications.all().delete()
            for spec_data in specifications_data:
                ProductSpecification.objects.create(product=instance, **spec_data)

        return instance


# ============ SHIPPING OPTION SERIALIZER ============

class ShippingOptionSerializer(serializers.ModelSerializer):
    """Serializer for shipping options"""
    delivery_estimate = serializers.ReadOnlyField()

    class Meta:
        model = ShippingOption
        fields = [
            'id', 'name', 'description', 'price',
            'estimated_days_min', 'estimated_days_max', 'delivery_estimate',
            'free_shipping_threshold', 'regions', 'is_default'
        ]