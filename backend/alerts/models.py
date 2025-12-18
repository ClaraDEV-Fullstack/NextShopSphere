from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


class UserNotification(models.Model):
    TYPE_CHOICES = [
        ('order', 'Order Update'),
        ('payment', 'Payment'),
        ('promo', 'Promotion'),
        ('system', 'System'),
        ('shipping', 'Shipping'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_notifications'
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        return f"{self.title} - {self.user.email}"