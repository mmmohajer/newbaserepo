from django.db import models

from core.models.base_model import TimeStampedUUIDModel


class Product(TimeStampedUUIDModel):
    CATEGORIES_CHOICES = [
        ('product_category_1', 'Product Category 1'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORIES_CHOICES)
    description = models.TextField(blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='usd')
    currency_mutltiplier_to_stripe_unit = models.IntegerField(default=100)
    details = models.JSONField(blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"Product: {self.name} - Price: {self.price} {self.currency}"

    class Meta:
        verbose_name_plural = "Products"
        ordering = ('id',)

