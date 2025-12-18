from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User admin with extra fields"""

    list_display = ['email', 'username', 'first_name', 'last_name', 'is_staff', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']

    # Add our custom fields to the admin form
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Extra Info', {
            'fields': ('phone', 'address', 'city', 'country', 'avatar')
        }),
    )