from django.db import models

from core.models.base_model import TimeStampedUUIDModel
from core.models import UserModel


class UserBilling(TimeStampedUUIDModel):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="billing_info")
    billing_name = models.CharField(max_length=255)
    billing_country = models.CharField(max_length=255)
    billing_state = models.CharField(max_length=255)
    billing_city = models.CharField(max_length=255)
    billing_address = models.CharField(max_length=255)
    billing_zipcode = models.CharField(max_length=20)

    def __str__(self):
        return f"UserBilling: {self.user.email}"

    class Meta:
        verbose_name_plural = "Billing for Users"
        ordering = ('id',)

