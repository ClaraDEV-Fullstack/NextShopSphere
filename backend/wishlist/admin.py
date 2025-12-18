from django.contrib import admin
from .models import WishlistItem


class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'product__name']
    readonly_fields = ['created_at']


# Register the model
admin.site.register(WishlistItem, WishlistItemAdmin)