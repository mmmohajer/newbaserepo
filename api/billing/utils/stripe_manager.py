from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML
import os
import io
import re
import stripe

from core.models import UserModel
from ai.utils.ocr_manager import OCRManager
from billing.models import StripeCustomerModel, UserBillingModel, StripeCustomerPaymentMethodModel, CustomerTransactionModel, CustomerTransactionProductModel

class StripeManager:
    def __init__(self):
        self.stripe = stripe
        self.stripe.api_key = settings.STRIPE_SECRET_KEY
        self.ocr_manager = OCRManager(
            google_cloud_project_id=settings.GOOGLE_CLOUD_DOCUMENT_AI_PROJECT_ID,
            google_cloud_location=settings.GOOGLE_CLOUD_DOCUMENT_AI_LOCATION,
            google_cloud_processor_id=settings.GOOGLE_CLOUD_DOCUMENT_AI_PROCESSOR_ID
        )

    def create_stripe_customer(self, user_id):
        try:
            cur_user_exists_as_cutomer = StripeCustomerModel.objects.filter(user_id=user_id).exists()
            if cur_user_exists_as_cutomer:
                return None
            cur_user = UserModel.objects.filter(id=user_id).first()
            if not cur_user:
                return None
            customer = self.stripe.Customer.create(email=cur_user.email, name=f"{cur_user.first_name} {cur_user.last_name}", metadata={"user_id": str(cur_user.id), "app_name": settings.APP_NAME})
            cur_stripe_customer = StripeCustomerModel.objects.filter(user=cur_user).first()
            if not cur_stripe_customer:
                cur_stripe_customer = StripeCustomerModel.objects.create(user=cur_user, stripe_customer_id=customer.id)
            else:
                cur_stripe_customer.stripe_customer_id = customer.id
                cur_stripe_customer.save()
            return cur_stripe_customer
        except Exception as e:
            print(f"Error creating Stripe customer: {str(e)}")
            return None
    
    def update_customer(self, user_id, **kwargs):
        try:
            cur_stripe_customer = StripeCustomerModel.objects.filter(user_id=user_id).first()
            if not cur_stripe_customer:
                return self.create_stripe_customer(user_id)
            update_params = {}
            if 'name' in kwargs:
                update_params['name'] = kwargs['name']
            if 'email' in kwargs:
                update_params['email'] = kwargs['email']
            if 'phone' in kwargs:
                update_params['phone'] = kwargs['phone']
            if 'address' in kwargs:
                update_params['address'] = kwargs['address']
            if 'shipping' in kwargs:
                update_params['shipping'] = kwargs['shipping']
            if 'metadata' in kwargs:
                update_params['metadata'] = kwargs['metadata']
            customer = self.stripe.Customer.modify(
                cur_stripe_customer.stripe_customer_id,
                **update_params
            )
            return cur_stripe_customer
        except Exception as e:
            print(f"Error updating Stripe customer: {str(e)}")
            return None
    
    def update_customer_from_billing_info(self, user_id):
        cur_billing_info = UserBillingModel.objects.filter(user_id=user_id).first()
        if not cur_billing_info:
            return None
        cur_stripe_customer = self.update_customer(
            user_id=user_id,
            name=f"{cur_billing_info.billing_name}",
            address={
                "line1": cur_billing_info.billing_address,
                "city": cur_billing_info.billing_city,
                "state": cur_billing_info.billing_state,
                "postal_code": cur_billing_info.billing_zipcode,
                "country": cur_billing_info.billing_country,
            }
        )
        return cur_stripe_customer
    
    def create_setup_intent(self, user_id):
        try:
            cur_billing_info = UserBillingModel.objects.filter(user_id=user_id).first()
            if not cur_billing_info:
                return ""
            cur_customer = StripeCustomerModel.objects.filter(user_id=user_id).first()
            setup_intent = stripe.SetupIntent.create(
                customer=cur_customer.stripe_customer_id,
                payment_method_types=["card"],
                usage="off_session",
            )
            setup_intent.create()
            return setup_intent.client_secret
        except Exception as e:
            print(f"Error creating setup intent: {str(e)}")
            return ""
    
    def get_customer_payment_methods(self, user_id, payment_method_type="card"):
        try:
            cur_stripe_customer = StripeCustomerModel.objects.filter(user_id=user_id).first()
            if not cur_stripe_customer:
                return []
            
            payment_methods = self.stripe.PaymentMethod.list(
                customer=cur_stripe_customer.stripe_customer_id,
                type=payment_method_type
            )
            return payment_methods.data
        except Exception as e:
            print(f"Error retrieving payment methods: {str(e)}")
            return []
    
    def get_default_payment_method(self, user_id):
        try:
            cur_stripe_customer = StripeCustomerModel.objects.filter(user_id=user_id).first()
            if not cur_stripe_customer:
                return None
            
            customer = self.stripe.Customer.retrieve(
                cur_stripe_customer.stripe_customer_id,
                expand=['invoice_settings.default_payment_method']
            )
            
            default_payment_method = customer.invoice_settings.default_payment_method
            
            if default_payment_method:
                return default_payment_method
            else:
                return None
        except Exception as e:
            print(f"Error retrieving default payment method: {str(e)}")
            return None
    
    def set_default_payment_method(self, user_id, payment_method_id):
        try:
            cur_stripe_customer = StripeCustomerModel.objects.filter(user_id=user_id).first()
            if not cur_stripe_customer:
                return ""
            customer = self.stripe.Customer.modify(
                cur_stripe_customer.stripe_customer_id,
                invoice_settings={"default_payment_method": payment_method_id}
            )
            return payment_method_id
        except Exception as e:
            print(f"Error setting default payment method: {str(e)}")
            return ""

    def retrieve_payment_method(self, payment_method_id):
        try:
            payment_method = self.stripe.PaymentMethod.retrieve(payment_method_id)
            return payment_method
        except Exception as e:
            print(f"Error retrieving payment method: {str(e)}")
            return None
    
    def retrieve_payment_method_from_succeeded_setup_intent(self, setup_intent_id):
        try:
            setup_intent = self.stripe.SetupIntent.retrieve(setup_intent_id)
            return setup_intent.payment_method
        except Exception as e:
            print(f"Error retrieving payment method from setup intent: {str(e)}")
            return ""
    
    def detach_payment_method(self, payment_method_id):
        try:
            payment_method = self.stripe.PaymentMethod.detach(payment_method_id)
            return payment_method
        except Exception as e:
            print(f"Error detaching payment method: {str(e)}")
            return None
    
    def charge_default_payment_method(self, user_id, amount, currency="usd", description=None, metadata={}):
        try:
            metadata.update({"user_id": str(user_id), "app_name": settings.APP_NAME})
            cur_stripe_customer = StripeCustomerModel.objects.filter(user_id=user_id).first()
            if not cur_stripe_customer:
                return {"success": False, "message": "Customer not found"}
            
            default_payment_method = self.get_default_payment_method(user_id)
            payment_intent = self.stripe.PaymentIntent.create(
                amount=int(amount),
                currency=currency,
                payment_method=default_payment_method.id,
                customer=cur_stripe_customer.stripe_customer_id,
                description=description,
                metadata=metadata,
                off_session=True,
                confirm=True,
            )
            
            if payment_intent.status == "succeeded":
                return {
                    "success": True,
                    "payment_intent": payment_intent,
                    "message": f"Payment of {amount/100} {currency.upper()} successfully charged"
                }
            elif payment_intent.status == "requires_action":
                return {
                    "success": False,
                    "payment_intent": payment_intent,
                    "message": "Payment requires customer action"
                }
            else:
                return {
                    "success": False,
                    "payment_intent": payment_intent,
                    "message": f"Payment failed with status: {payment_intent.status}"
                }
                
        except Exception as e:
            print(f"Error charging default payment method: {str(e)}")
            return {"success": False, "message": self.clean_stripe_error_message(str(e))}
    
    def refund_payment(self, payment_intent_id, amount={}, reason=None, metadata=None):
        try:
            metadata.update({"app_name": settings.APP_NAME})
            refund_params = {
                "payment_intent": payment_intent_id,
                "metadata": metadata or {}
            }
            
            if amount is not None:
                refund_params["amount"] = amount
                
            if reason is not None:
                refund_params["reason"] = reason  # Can be 'duplicate', 'fraudulent', or 'requested_by_customer'
            
            refund = self.stripe.Refund.create(**refund_params)
            
            return {
                "success": True,
                "refund": refund,
                "message": f"Refund {refund.id} created successfully"
            }
            
        except Exception as e:
            print(f"Error creating refund: {str(e)}")
            return {"success": False, "message": str(e)}
    
    def retrieve_payment_intent(self, payment_intent_id):
        try:
            payment_intent = self.stripe.PaymentIntent.retrieve(payment_intent_id)
            return payment_intent
        except Exception as e:
            print(f"Error retrieving payment intent: {str(e)}")
            return None
    
    def generate_transaction_receipt(self, transaction_id):
        try:
            template_name = "purchase_receipt_no_tax.html"
            cur_transaction = CustomerTransactionModel.objects.filter(id=transaction_id).first()
            cur_billing_info = UserBillingModel.objects.filter(user_id=cur_transaction.stripe_customer.user.id).first()
            if not cur_transaction or not cur_billing_info:
                return None
            transaction_products = CustomerTransactionProductModel.objects.filter(transaction=cur_transaction)
            items = []
            total_amount = 0
            for transaction_product in transaction_products:
                product_description = transaction_product.product.name
                if transaction_product.product.category == "personalized_mentorship":
                    product_description = f"Personalized Mentorship: {transaction_product.product.name}"
                items.append({
                    "date": cur_transaction.created_at.strftime("%b %d, %Y"),
                    "description": product_description,
                    "amount": f"${transaction_product.price_at_purchase:.2f}"
                })
                total_amount += transaction_product.price_at_purchase
            receipt_data = {
                "CLIENT_NAME": cur_billing_info.billing_name,
                "CLIENT_STREET_ADDRESS": cur_billing_info.billing_address,
                "CLIENT_CITY": cur_billing_info.billing_city,
                "CLIENT_PROVINCE": cur_billing_info.billing_state,
                "CLIENT_COUNTRY": cur_billing_info.billing_country,
                "CLIENT_POSTAL_CODE": cur_billing_info.billing_zipcode,
                "RECEIPT_NUMBER": f"REC-{cur_transaction.id:08d}",
                "TRANSACTION_DATE": cur_transaction.created_at.strftime("%b %d, %Y"),
                "ITEMS": items,
                "TOTAL": f"${total_amount:.2f}"
            }
            html_string = render_to_string(template_name, receipt_data)
            pdf_bytes = HTML(string=html_string).write_pdf()
            return pdf_bytes
        except Exception as e:
            print(f"Error generating transaction receipt: {str(e)}")
            return None
    
    def clean_stripe_error_message(self, error_message):
        cleaned = re.sub(r"^Request\s+req_[A-Za-z0-9]+:\s*", "", error_message.strip())
        return cleaned