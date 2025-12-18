from django.db import models
from django.conf import settings
from products.models import Product


class WishlistItem(models.Model):
    """User's wishlist item"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist',
        help_text="User who added this item"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='wishlisted_by',
        help_text="Product in wishlist"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'product']
        verbose_name = 'Wishlist Item'
        verbose_name_plural = 'Wishlist Items'

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"