from django.db.models.signals import post_save
from django.dispatch import receiver

from billing.models import UserBillingModel
from billing.tasks import create_stripe_customer_task

@receiver(post_save, sender=UserBillingModel)
def create_stripe_customer(sender, instance, created, **kwargs):
    create_stripe_customer_task.delay(user_id=instance.user.id)