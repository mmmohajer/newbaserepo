from celery import shared_task

from billing.tasks.user_billing import create_stripe_customer
from billing.tasks.stripe_sync import attach_payment_method_to_customer, handle_payment_intnet_succeeded, handle_payment_intent_payment_failed

@shared_task
def create_stripe_customer_task(user_id):
    create_stripe_customer(user_id=user_id)

@shared_task
def attach_payment_method_to_customer_task(payment_method_id):
    attach_payment_method_to_customer(payment_method_id=payment_method_id)

@shared_task
def handle_payment_intnet_succeeded_task(payment_intent_id):
    handle_payment_intnet_succeeded(payment_intent_id=payment_intent_id)

@shared_task
def handle_payment_intent_payment_failed_task(payment_intent_id):
    handle_payment_intent_payment_failed(payment_intent_id=payment_intent_id)