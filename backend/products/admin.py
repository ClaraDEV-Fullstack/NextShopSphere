from django.contrib import admin
from django.utils.html import format_html, mark_safe
from .models import (
    Category, Product, ProductImage, ProductSpecification,
    Brand, ShippingOption
)


# ============ INLINES ============

class ProductImageInline(admin.TabularInline):
    """Inline for product images"""
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px;"/>',
                obj.image.url
            )
        return mark_safe('<span style="color: #999;">No image</span>')
    image_preview.short_description = 'Preview'


class ProductSpecificationInline(admin.TabularInline):
    """Inline for product specifications"""
    model = ProductSpecification
    extra = 3
    fields = ['name', 'value', 'order']


class SubcategoryInline(admin.TabularInline):
    """Inline for subcategories"""
    model = Category
    fk_name = 'parent'
    extra = 0
    fields = ['name', 'slug', 'is_active', 'display_order']
    prepopulated_fields = {'slug': ('name',)}
    verbose_name = 'Subcategory'
    verbose_name_plural = 'Subcategories'


# ============ CATEGORY ADMIN ============

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for categories with subcategory support"""

    list_display = [
        'name', 'parent', 'icon', 'is_active', 'featured',
        'display_order', 'product_count', 'image_preview'
    ]
    list_filter = ['is_active', 'featured', 'parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'featured', 'display_order']
    ordering = ['display_order', 'name']
    inlines = [SubcategoryInline]

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'description', 'icon')
        }),
        ('Hierarchy', {
            'fields': ('parent',)
        }),
        ('Display', {
            'fields': ('image', 'display_order', 'is_active', 'featured')
        }),
    )

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 40px;"/>',
                obj.image.url
            )
        return mark_safe('<span style="color: #999;">-</span>')
    image_preview.short_description = 'Image'


# ============ BRAND ADMIN ============

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Admin for product brands"""

    list_display = ['name', 'logo_preview', 'product_count', 'is_featured', 'is_active']
    list_filter = ['is_active', 'is_featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'is_active']
    ordering = ['name']

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'description', 'website')
        }),
        ('Display', {
            'fields': ('logo', 'is_featured', 'is_active')
        }),
    )

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'

    def logo_preview(self, obj):
        if obj.logo:
            return format_html(
                '<img src="{}" style="max-height: 30px;"/>',
                obj.logo.url
            )
        return mark_safe('<span style="color: #999;">-</span>')
    logo_preview.short_description = 'Logo'


# ============ PRODUCT ADMIN ============

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin for products with full features"""

    list_display = [
        'name', 'category', 'brand', 'price', 'compare_price',
        'stock', 'stock_status',
        'is_available', 'featured', 'is_new', 'is_bestseller'
    ]
    list_filter = [
        'category', 'brand', 'is_available', 'featured',
        'is_new', 'is_bestseller', 'product_type', 'created_at'
    ]
    search_fields = ['name', 'description', 'sku', 'brand__name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'stock', 'is_available', 'featured', 'is_new', 'is_bestseller']
    inlines = [ProductImageInline, ProductSpecificationInline]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'description', 'short_description', 'product_type')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price')
        }),
        ('Inventory', {
            'fields': ('sku', 'stock', 'low_stock_threshold', 'is_available')
        }),
        ('Categorization', {
            'fields': ('category', 'brand')
        }),
        ('Physical Properties', {
            'fields': ('weight', 'dimensions'),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Display Options', {
            'fields': ('featured', 'is_new', 'is_bestseller')
        }),
    )

    def stock_status(self, obj):
        if obj.stock == 0:
            return mark_safe('<span style="color: red;">❌ Out of Stock</span>')
        elif obj.is_low_stock:
            return format_html(
                '<span style="color: orange;">⚠️ Low ({} left)</span>',
                obj.stock
            )
        return mark_safe('<span style="color: green;">✅ In Stock</span>')
    stock_status.short_description = 'Status'


# ============ PRODUCT IMAGE ADMIN ============

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Separate admin for bulk image management"""

    list_display = ['product', 'image_preview', 'is_primary', 'order']
    list_filter = ['is_primary', 'product__category']
    search_fields = ['product__name', 'alt_text']
    list_editable = ['is_primary', 'order']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px;"/>',
                obj.image.url
            )
        return mark_safe('<span style="color: #999;">No image</span>')
    image_preview.short_description = 'Preview'


# ============ SHIPPING OPTION ADMIN ============

@admin.register(ShippingOption)
class ShippingOptionAdmin(admin.ModelAdmin):
    """Admin for shipping options"""

    list_display = [
        'name', 'price', 'delivery_estimate_display',
        'free_shipping_threshold', 'is_default', 'is_active', 'display_order'
    ]
    list_filter = ['is_active', 'is_default']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_active', 'is_default', 'display_order']
    ordering = ['display_order']

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'description')
        }),
        ('Pricing & Delivery', {
            'fields': ('price', 'estimated_days_min', 'estimated_days_max', 'free_shipping_threshold')
        }),
        ('Availability', {
            'fields': ('regions', 'is_active', 'is_default', 'display_order')
        }),
    )

    def delivery_estimate_display(self, obj):
        return obj.delivery_estimate
    delivery_estimate_display.short_description = 'Delivery'