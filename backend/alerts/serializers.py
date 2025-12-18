from rest_framework import serializers
from .models import UserNotification


class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = UserNotification
        fields = ['id', 'type', 'title', 'message', 'link', 'is_read', 'created_at', 'time_ago']

    def get_time_ago(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        diff = now - obj.created_at

        if diff < timedelta(minutes=1):
            return 'Just now'
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f'{minutes} minute{"s" if minutes > 1 else ""} ago'
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f'{hours} hour{"s" if hours > 1 else ""} ago'
        elif diff < timedelta(days=7):
            days = diff.days
            return f'{days} day{"s" if days > 1 else ""} ago'
        else:
            return obj.created_at.strftime('%b %d, %Y')