from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """Inline display of order items"""
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name', 'product_price', 'quantity', 'item_subtotal']
    fields = ['product', 'product_name', 'product_price', 'quantity', 'item_subtotal']

    def item_subtotal(self, obj):
        """Display subtotal safely"""
        if obj.pk:  # Only for saved items
            return f"${obj.get_subtotal():.2f}"
        return "$0.00"
    item_subtotal.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['user__email', 'shipping_address', 'shipping_city']
    readonly_fields = ['subtotal', 'shipping_cost', 'tax', 'total', 'created_at', 'updated_at']
    inlines = [OrderItemInline]

    fieldsets = (
        ('Customer', {
            'fields': ('user',)
        }),
        ('Status', {
            'fields': ('status', 'payment_status')
        }),
        ('Shipping', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_country', 'shipping_phone')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'shipping_cost', 'tax', 'total')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )