from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product


class Review(models.Model):
    """Product review with rating and comment"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text="User who wrote the review"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text="Product being reviewed"
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Short review title (optional)"
    )
    comment = models.TextField(
        help_text="Detailed review comment"
    )
    is_verified_purchase = models.BooleanField(
        default=False,
        help_text="User has purchased this product"
    )
    is_approved = models.BooleanField(
        default=True,
        help_text="Review is approved and visible"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # One review per user per product
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}★)"

    def save(self, *args, **kwargs):
        # Check if user has purchased this product
        from orders.models import OrderItem
        has_purchased = OrderItem.objects.filter(
            order__user=self.user,
            product=self.product,
            order__status='delivered'
        ).exists()
        self.is_verified_purchase = has_purchased
        super().save(*args, **kwargs)