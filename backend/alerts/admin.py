from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import UserNotification


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__email']
    list_editable = ['is_read']
    ordering = ['-created_at']