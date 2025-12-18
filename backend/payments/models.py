from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from orders.models import Order
import uuid


class Payment(models.Model):
    """Mock payment record for orders"""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    # Unique reference
    reference = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique payment reference"
    )

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='payment',
        help_text="Order this payment is for"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        help_text="User who made the payment"
    )

    # Payment details
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Payment amount"
    )
    currency = models.CharField(
        max_length=3,
        default='USD',
        help_text="Currency code"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Payment status"
    )

    # Card details (masked for display)
    card_last_four = models.CharField(
        max_length=4,
        blank=True,
        null=True,
        help_text="Last 4 digits of card"
    )
    card_brand = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Card brand (Visa, Mastercard)"
    )
    card_holder_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Name on card"
    )

    # Error info
    error_message = models.TextField(
        blank=True,
        null=True,
        help_text="Error message if payment failed"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="When payment was confirmed"
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.reference} - Order #{self.order.id} - {self.status}"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"PAY-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)