from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import (
    Category, Product, ProductImage, ProductSpecification,
    Brand, ShippingOption
)
from .serializers import (
    CategorySerializer, CategoryListSerializer, CategoryTreeSerializer,
    ProductListSerializer, ProductDetailSerializer, ProductCreateSerializer,
    ProductImageSerializer, ProductSpecificationSerializer,
    BrandSerializer, BrandListSerializer,
    ShippingOptionSerializer,
)
# products/views.py - Add temporarily

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
import os
import cloudinary

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_cloudinary(request):
    """Debug Cloudinary configuration"""
    from products.models import ProductImage

    # Check Cloudinary config
    cloudinary_config = {
        'cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME', 'NOT SET'),
        'api_key_set': bool(os.environ.get('CLOUDINARY_API_KEY')),
        'api_secret_set': bool(os.environ.get('CLOUDINARY_API_SECRET')),
    }

    # Check storage backend
    storage_info = {
        'default_storage': settings.DEFAULT_FILE_STORAGE,
        'is_cloudinary': 'cloudinary' in settings.DEFAULT_FILE_STORAGE.lower(),
    }

    # Get sample images and their actual URLs
    sample_images = []
    for img in ProductImage.objects.all()[:5]:
        try:
            img_data = {
                'id': img.id,
                'field_name': str(img.image.name) if img.image else None,
                'field_url': img.image.url if img.image else None,
                'storage_class': img.image.storage.__class__.__name__ if img.image else None,
            }
            sample_images.append(img_data)
        except Exception as e:
            sample_images.append({'id': img.id, 'error': str(e)})

    return Response({
        'cloudinary_config': cloudinary_config,
        'storage_info': storage_info,
        'sample_images': sample_images,
        'render_env': os.environ.get('RENDER', 'not set'),
    })

# ============================================
# CATEGORY VIEWSET
# ============================================
@extend_schema_view(
    list=extend_schema(tags=['Categories'], summary='List all categories'),
    retrieve=extend_schema(tags=['Categories'], summary='Get category details'),
    create=extend_schema(tags=['Categories'], summary='Create category (Admin)'),
    update=extend_schema(tags=['Categories'], summary='Update category (Admin)'),
    partial_update=extend_schema(tags=['Categories'], summary='Partial update category (Admin)'),
    destroy=extend_schema(tags=['Categories'], summary='Delete category (Admin)'),
)
class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for product categories.

    Provides CRUD operations for categories with nested subcategories support.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'display_order', 'created_at']
    ordering = ['display_order', 'name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        if self.action == 'tree':
            return CategoryTreeSerializer
        return CategorySerializer

    @extend_schema(tags=['Categories'], summary='Get root categories only')
    @action(detail=False, methods=['get'])
    def root(self, request):
        """Get only root categories (no parent)"""
        root_categories = self.queryset.filter(parent=None).order_by('display_order', 'name')
        serializer = CategorySerializer(root_categories, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Categories'], summary='Get full category tree')
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get full category tree for navigation"""
        root_categories = self.queryset.filter(parent=None).order_by('display_order', 'name')
        serializer = CategoryTreeSerializer(root_categories, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Categories'], summary='Get featured categories')
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured categories for homepage"""
        featured = self.queryset.filter(featured=True, parent=None).order_by('display_order')[:8]
        serializer = CategorySerializer(featured, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Categories'], summary='Get subcategories')
    @action(detail=True, methods=['get'])
    def subcategories(self, request, slug=None):
        """Get subcategories for a specific category"""
        category = self.get_object()
        subcategories = category.children.filter(is_active=True).order_by('display_order', 'name')
        serializer = CategoryListSerializer(subcategories, many=True)
        return Response(serializer.data)


# ============================================
# BRAND VIEWSET
# ============================================
@extend_schema_view(
    list=extend_schema(tags=['Brands'], summary='List all brands'),
    retrieve=extend_schema(tags=['Brands'], summary='Get brand details'),
    create=extend_schema(tags=['Brands'], summary='Create brand (Admin)'),
    update=extend_schema(tags=['Brands'], summary='Update brand (Admin)'),
    partial_update=extend_schema(tags=['Brands'], summary='Partial update brand (Admin)'),
    destroy=extend_schema(tags=['Brands'], summary='Delete brand (Admin)'),
)
class BrandViewSet(viewsets.ModelViewSet):
    """ViewSet for product brands"""
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'list':
            return BrandListSerializer
        return BrandSerializer

    @extend_schema(tags=['Brands'], summary='Get featured brands')
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured brands for homepage"""
        featured = self.queryset.filter(is_featured=True)[:10]
        serializer = BrandListSerializer(featured, many=True)
        return Response(serializer.data)


# ============================================
# PRODUCT VIEWSET
# ============================================
@extend_schema_view(
    list=extend_schema(tags=['Products'], summary='List all products'),
    retrieve=extend_schema(tags=['Products'], summary='Get product details'),
    create=extend_schema(tags=['Products'], summary='Create product (Admin)'),
    update=extend_schema(tags=['Products'], summary='Update product (Admin)'),
    partial_update=extend_schema(tags=['Products'], summary='Partial update product (Admin)'),
    destroy=extend_schema(tags=['Products'], summary='Delete product (Admin)'),
)
class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for products with filtering, search, and ordering"""
    queryset = Product.objects.filter(is_available=True).select_related('category', 'brand')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'brand__slug', 'featured', 'is_available', 'product_type', 'is_new', 'is_bestseller']
    search_fields = ['name', 'description', 'short_description', 'sku', 'brand__name']
    ordering_fields = ['price', 'created_at', 'name', 'stock']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Category filter (includes subcategories)
        category = self.request.query_params.get('category', None)
        if category:
            try:
                cat = Category.objects.get(slug=category)
                cat_ids = [cat.id]
                cat_ids.extend(cat.children.filter(is_active=True).values_list('id', flat=True))
                queryset = queryset.filter(category_id__in=cat_ids)
            except Category.DoesNotExist:
                queryset = queryset.filter(category__slug=category)

        # Brand filter
        brand = self.request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(brand__slug=brand)

        # Price range
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Stock filter
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock == 'true':
            queryset = queryset.filter(stock__gt=0)

        # On sale filter
        on_sale = self.request.query_params.get('on_sale', None)
        if on_sale == 'true':
            queryset = queryset.filter(compare_price__isnull=False, compare_price__gt=0)

        return queryset

    @extend_schema(tags=['Products'], summary='Get featured products')
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products for homepage"""
        featured = self.queryset.filter(featured=True)[:8]
        serializer = ProductListSerializer(featured, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Products'], summary='Get new arrivals')
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Get newest products"""
        new = self.queryset.filter(is_new=True).order_by('-created_at')[:8]
        serializer = ProductListSerializer(new, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Products'], summary='Get bestsellers')
    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        """Get bestseller products"""
        bestsellers = self.queryset.filter(is_bestseller=True)[:8]
        serializer = ProductListSerializer(bestsellers, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Products'], summary='Get products on sale')
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get products on sale"""
        on_sale = self.queryset.filter(
            compare_price__isnull=False,
            compare_price__gt=0
        ).order_by('-created_at')[:12]
        serializer = ProductListSerializer(on_sale, many=True)
        return Response(serializer.data)

    @extend_schema(tags=['Products'], summary='Search products')
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products by name, description, brand, or category"""
        query = request.query_params.get('q', '')
        if query:
            products = self.queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(category__name__icontains=query) |
                Q(brand__name__icontains=query)
            )[:20]
            serializer = ProductListSerializer(products, many=True)
            return Response(serializer.data)
        return Response([])

    @extend_schema(tags=['Products'], summary='Get related products')
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """Get related products"""
        product = self.get_object()
        related = self.queryset.filter(
            Q(category=product.category) | Q(brand=product.brand)
        ).exclude(id=product.id)[:6]
        serializer = ProductListSerializer(related, many=True)
        return Response(serializer.data)


# ============================================
# PRODUCT IMAGE VIEWSET
# ============================================
@extend_schema_view(
    list=extend_schema(tags=['Products'], summary='List product images'),
    create=extend_schema(tags=['Products'], summary='Add product image (Admin)'),
    retrieve=extend_schema(tags=['Products'], summary='Get product image'),
    update=extend_schema(tags=['Products'], summary='Update product image (Admin)'),
    partial_update=extend_schema(tags=['Products'], summary='Partial update image (Admin)'),
    destroy=extend_schema(tags=['Products'], summary='Delete product image (Admin)'),
)
class ProductImageViewSet(viewsets.ModelViewSet):
    """ViewSet for product images (admin only)"""
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        product_slug = self.kwargs.get('product_slug')
        if product_slug:
            return self.queryset.filter(product__slug=product_slug)
        return self.queryset

    def perform_create(self, serializer):
        product_slug = self.kwargs.get('product_slug')
        product = Product.objects.get(slug=product_slug)
        serializer.save(product=product)


# ============================================
# SHIPPING OPTION VIEWSET
# ============================================
@extend_schema_view(
    list=extend_schema(tags=['Shipping'], summary='List shipping options'),
    retrieve=extend_schema(tags=['Shipping'], summary='Get shipping option details'),
)
class ShippingOptionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for shipping options (read-only for customers)"""
    queryset = ShippingOption.objects.filter(is_active=True)
    serializer_class = ShippingOptionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(tags=['Shipping'], summary='Get available shipping with free shipping check')
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available shipping options for an order total"""
        order_total = request.query_params.get('total', 0)
        try:
            total = float(order_total)
        except ValueError:
            total = 0

        options = self.queryset.all()
        result = []

        for option in options:
            option_data = ShippingOptionSerializer(option).data
            if option.free_shipping_threshold and total >= float(option.free_shipping_threshold):
                option_data['price'] = '0.00'
                option_data['free_shipping_applied'] = True
            else:
                option_data['free_shipping_applied'] = False
            result.append(option_data)

        return Response(result)