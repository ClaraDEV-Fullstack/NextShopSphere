from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'rating', 'is_verified_purchase', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'is_approved', 'created_at']
    search_fields = ['user__email', 'product__name', 'title', 'comment']
    list_editable = ['is_approved']
    readonly_fields = ['is_verified_purchase', 'created_at', 'updated_at']

    fieldsets = (
        ('Review Info', {
            'fields': ('user', 'product', 'rating', 'title', 'comment')
        }),
        ('Status', {
            'fields': ('is_verified_purchase', 'is_approved')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )