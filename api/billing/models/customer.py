from django.db import models

from core.models.base_model import TimeStampedUUIDModel, TimeStampedModel
from core.models import UserModel
from billing.models.product import Product


class StripeCustomer(TimeStampedModel):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Stripe Customer: {self.stripe_customer_id} - User: {self.user.email}"

    class Meta:
        verbose_name_plural = "Stripe Customers"
        ordering = ('id',)


class StripeCustomerPaymentMethod(TimeStampedModel):
    stripe_customer = models.ForeignKey(StripeCustomer, on_delete=models.CASCADE, related_name='payment_methods')
    payment_method_id = models.CharField(max_length=255, unique=True)
    is_default = models.BooleanField(default=False)
    brand = models.CharField(max_length=100)
    last4 = models.CharField(max_length=4)
    exp_month = models.IntegerField()
    exp_year = models.IntegerField()

    def __str__(self):
        return f"Payment Method: {self.payment_method_id} for Customer: {self.stripe_customer.user.email}"

    class Meta:
        verbose_name_plural = "Payment Methods for Stripe Customers"
        ordering = ('id',)

class CustomerTransaction(TimeStampedUUIDModel):

    STATUS_CHOICES = [
        ('succeeded', 'Succeeded'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
        ('requires_action', 'Requires Action'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]

    stripe_customer = models.ForeignKey(StripeCustomer, on_delete=models.CASCADE, related_name='transactions')
    payment_intent_id = models.CharField(max_length=255, unique=True)
    metadata = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    receipt_file_key = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Customer: {self.stripe_customer.user.email}"

    class Meta:
        verbose_name_plural = "Customer Transactions"
        ordering = ('-created_at',)

class CustomerTransactionProduct(TimeStampedModel):
    transaction = models.ForeignKey(CustomerTransaction, on_delete=models.CASCADE, related_name='products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Transaction: {self.transaction.id} - Product: {self.product.name} - Quantity: {self.quantity}"

    class Meta:
        verbose_name_plural = "Customer Transaction Products"
        ordering = ('id',)