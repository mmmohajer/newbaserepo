from django.conf import settings
import json
import base64

from config.utils.email import send_email_with_attachment, send_email
from core.models import UserModel
from core.utils.sg_templates import SG_TEMPLATE_IDS
from billing.models import StripeCustomerModel, StripeCustomerPaymentMethodModel, CustomerTransactionModel, ProductModel, CustomerTransactionProductModel
from billing.utils.stripe_manager import StripeManager

def attach_payment_method_to_customer(payment_method_id):
    try:
        stripe_manager = StripeManager()
        payment_method = stripe_manager.retrieve_payment_method(payment_method_id)
        if payment_method:
            cur_stripe_customer = StripeCustomerModel.objects.filter(stripe_customer_id=payment_method.customer).first()
            if cur_stripe_customer:
                defaults = {
                    "brand": payment_method.card.brand,
                    "last4": payment_method.card.last4,
                    "exp_month": payment_method.card.exp_month,
                    "exp_year": payment_method.card.exp_year,
                }
                has_default_payment_method = StripeCustomerPaymentMethodModel.objects.filter(
                    stripe_customer=cur_stripe_customer, is_default=True
                ).exists()
                if not has_default_payment_method:
                    defaults["is_default"] = True
                StripeCustomerPaymentMethodModel.objects.update_or_create(
                    stripe_customer=cur_stripe_customer,
                    payment_method_id=payment_method.id,
                    defaults=defaults
                )
                if not has_default_payment_method:
                    stripe_manager.set_default_payment_method(user_id=cur_stripe_customer.user.id, payment_method_id=payment_method.id)
        return True
    except Exception as e:
        print(f"Error attaching payment method to customer: {str(e)}")
        return False

def handle_payment_intnet_succeeded(payment_intent_id):
    try:
        stripe_manager = StripeManager()
        payment_intent = stripe_manager.retrieve_payment_intent(payment_intent_id)
        if payment_intent:
            customer_id = payment_intent.customer
            cur_customer = StripeCustomerModel.objects.filter(stripe_customer_id=customer_id).first()
            if not cur_customer:
                print(f"No StripeCustomer found for customer ID: {customer_id}")
                return False
            cur_transaction = CustomerTransactionModel.objects.filter(stripe_customer=cur_customer, payment_intent_id=payment_intent_id).first()
            products_info_str = payment_intent.metadata.get("products_info", "{}")
            products_info = json.loads(products_info_str)
            product_ids = [int(pid) for pid in products_info.keys()]
            db_products = ProductModel.objects.filter(id__in=product_ids, is_active=True)
            # --------------------------------- #
            # Handle Action After Purchase  #
            # --------------------------------- #
            
            # --------------------------------- #
            # ----------------------------------#
            if not cur_transaction:
                cur_transaction = CustomerTransactionModel()
                cur_transaction.stripe_customer = cur_customer
                cur_transaction.payment_intent_id = payment_intent.id
                cur_transaction.metadata = payment_intent.metadata
            cur_transaction.status = "succeeded"
            cur_transaction.save()
            for product in db_products:
                transaction_product_exists = CustomerTransactionProductModel.objects.filter(transaction=cur_transaction, product=product).exists()
                if not transaction_product_exists:
                    transaction_product = CustomerTransactionProductModel()
                    transaction_product.transaction = cur_transaction
                    transaction_product.product = product
                    transaction_product.quantity = products_info.get(f"{product.id}", {}).get("quantity", 1)
                    transaction_product.price_at_purchase = product.price
                    transaction_product.save()
            receipt_pdf_bytes = stripe_manager.generate_transaction_receipt(transaction_id=cur_transaction.id)
            encoded_pdf = base64.b64encode(receipt_pdf_bytes).decode("utf-8")
            email_template_id = SG_TEMPLATE_IDS["PURCHASE_RECEIPT"]
            params = {}
            params["first_name"] = cur_customer.user.first_name
            attached_file_info = {
                "file": encoded_pdf,
                "name": f"receipt_{cur_transaction.id}.pdf",
                "file_type": "application/pdf"
            }
            send_email_with_attachment(email=cur_customer.user.email, params=params, attached_file_info=attached_file_info, email_template_id=email_template_id)
        return True
    except Exception as e:
        print(f"Error handling payment intent succeeded: {str(e)}")
        return False

def handle_payment_intent_payment_failed(payment_intent_id):
    try:
        stripe_manager = StripeManager()
        payment_intent = stripe_manager.retrieve_payment_intent(payment_intent_id)
        if payment_intent:
            customer_id = payment_intent.customer
            cur_customer = StripeCustomerModel.objects.filter(stripe_customer_id=customer_id).first()
            if not cur_customer:
                print(f"No StripeCustomer found for customer ID: {customer_id}")
                return False
            products_info_str = payment_intent.metadata.get("products_info", "{}")
            products_info = json.loads(products_info_str)
            product_ids = [int(pid) for pid in products_info.keys()]
            db_products = ProductModel.objects.filter(id__in=product_ids, is_active=True)
            cur_transaction = CustomerTransactionModel.objects.filter(stripe_customer=cur_customer, payment_intent_id=payment_intent_id).first()
            if not cur_transaction:
                cur_transaction = CustomerTransactionModel()
                cur_transaction.stripe_customer = cur_customer
                cur_transaction.payment_intent_id = payment_intent.id
                cur_transaction.metadata = payment_intent.metadata
            cur_transaction.status = "failed"
            cur_transaction.save()
            for product in db_products:
                transaction_product_exists = CustomerTransactionProductModel.objects.filter(transaction=cur_transaction, product=product).exists()
                if not transaction_product_exists:
                    transaction_product = CustomerTransactionProductModel()
                    transaction_product.transaction = cur_transaction
                    transaction_product.product = product
                    transaction_product.quantity = products_info.get(f"{product.id}", {}).get("quantity", 1)
                    transaction_product.price_at_purchase = product.price
                    transaction_product.save()
        total_amount_cents = payment_intent.metadata.get("total_amount", "0")
        total_amount = float(total_amount_cents) / 100
        total_amount_str = "{:.2f}".format(total_amount)
        email_template_id = SG_TEMPLATE_IDS["TRANSACTION_FAILED"]
        params = {}
        params["first_name"] = cur_customer.user.first_name
        params["total_amount"] = total_amount_str
        params["payment_update_url"] = f"{settings.CLIENT_URL}/app/billing/"
        params["transaction_date"] = cur_transaction.created_at.strftime("%b %d, %Y")
        send_email(email=cur_customer.user.email, params=params, email_template_id=email_template_id)
        return True
    except Exception as e:
        print(f"Error handling payment intent payment failed: {str(e)}")
        return False