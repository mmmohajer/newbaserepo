from billing.models import UserBillingModel, StripeCustomerModel
from billing.utils.stripe_manager import StripeManager

def create_stripe_customer(user_id):
    manager = StripeManager()
    manager.create_stripe_customer(user_id=user_id)
    manager.update_customer_from_billing_info(user_id=user_id)
