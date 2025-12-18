from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'reference', 'order', 'user', 'amount', 'status', 'card_brand', 'created_at', 'paid_at']
    list_filter = ['status', 'card_brand', 'created_at']
    search_fields = ['reference', 'order__id', 'user__email', 'card_holder_name']
    readonly_fields = ['reference', 'created_at', 'updated_at', 'paid_at']
    raw_id_fields = ['order', 'user']

    fieldsets = (
        ('Payment Info', {
            'fields': ('reference', 'order', 'user', 'amount', 'currency', 'status')
        }),
        ('Card Details', {
            'fields': ('card_brand', 'card_last_four', 'card_holder_name')
        }),
        ('Status', {
            'fields': ('error_message',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at')
        }),
    )