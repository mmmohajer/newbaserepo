from rest_framework import views, permissions, response, status
import json

from config.permissions import IsClientOnly
from billing.models import CustomerTransactionModel, StripeCustomerModel, StripeCustomerPaymentMethodModel, ProductModel, CustomerTransactionProductModel
from billing.serializers import StripeCustomerPaymentMethodSerializer, CustomerTransactionSerializer
from billing.utils.stripe_manager import StripeManager
class CustomerPaymentMethodViewSet(views.APIView):
    permission_classes = [IsClientOnly]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.stripe_manager = StripeManager()

    def get(self, request, format=None):
        try:
            cur_cutomer = StripeCustomerModel.objects.filter(user_id=request.user.id).first()
            if not cur_cutomer:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "No Stripe customer found for the user."})
            payment_methods = StripeCustomerPaymentMethodModel.objects.filter(stripe_customer=cur_cutomer)
            serializer = StripeCustomerPaymentMethodSerializer(payment_methods, many=True)
            return response.Response(status=status.HTTP_200_OK, data=serializer.data)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})
    
    def post(self, request, format=None):
        try:
            setup_intent = request.data.get('setup_intent')
            if not setup_intent:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "setup_intent is required."})
            cur_customer = StripeCustomerModel.objects.filter(user=request.user).first()
            if not cur_customer:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "No Stripe customer found for the user."})
            payment_method = self.stripe_manager.retrieve_payment_method_from_succeeded_setup_intent(setup_intent_id=setup_intent)
            if payment_method:
                cur_stripe_customer = StripeCustomerModel.objects.filter(user_id=request.user.id).first()
                if payment_method:
                    payment_method_obj = self.stripe_manager.retrieve_payment_method(payment_method_id=payment_method)
                    defaults = {
                        "brand": payment_method_obj.card.brand,
                        "last4": payment_method_obj.card.last4,
                        "exp_month": payment_method_obj.card.exp_month,
                        "exp_year": payment_method_obj.card.exp_year,
                    }
                    has_default_payment_method = StripeCustomerPaymentMethodModel.objects.filter(
                        stripe_customer=cur_stripe_customer, is_default=True
                    ).exists()
                    if not has_default_payment_method:
                        defaults["is_default"] = True
                    StripeCustomerPaymentMethodModel.objects.update_or_create(
                        stripe_customer=cur_stripe_customer,
                        payment_method_id=payment_method_obj.id,
                        defaults=defaults
                    )
                    if not has_default_payment_method:
                        self.stripe_manager.set_default_payment_method(user_id=cur_stripe_customer.user.id, payment_method_id=payment_method_obj.id)
                    return response.Response(status=status.HTTP_200_OK, data={"success": True})
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "No payment method found in the setup intent."})
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})
        
    def put(self, request, format=None):
        try:
            payment_method_id = request.data.get('payment_method_id')
            if not payment_method_id:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "payment_method_id is required."})
            cur_customer = StripeCustomerModel.objects.filter(user_id=request.user.id).first()
            if not cur_customer:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "No Stripe customer found for the user."})
            payment_method = StripeCustomerPaymentMethodModel.objects.filter(stripe_customer=cur_customer, payment_method_id=payment_method_id).first()
            if not payment_method:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Payment method not found for the user."})
            self.stripe_manager.set_default_payment_method(user_id=request.user.id, payment_method_id=payment_method_id)
            StripeCustomerPaymentMethodModel.objects.filter(stripe_customer=cur_customer).update(is_default=False)
            payment_method.is_default = True
            payment_method.save()
            return response.Response(status=status.HTTP_200_OK, data={"success": True}) 
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})
    
    def delete(self, request, format=None):
        try:
            payment_method_id = request.query_params.get("payment_method_id")
            if not payment_method_id:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "payment_method_id is required."})
            cur_customer = StripeCustomerModel.objects.filter(user_id=request.user.id).first()
            if not cur_customer:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "No Stripe customer found for the user."})
            payment_method = StripeCustomerPaymentMethodModel.objects.filter(stripe_customer=cur_customer, payment_method_id=payment_method_id).first()
            if not payment_method:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Payment method not found for the user."})
            if payment_method.is_default:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Cannot delete the default payment method. Please set another payment method as default before deleting this one."})
            self.stripe_manager.detach_payment_method(payment_method_id=payment_method_id)
            payment_method.delete()
            return response.Response(status=status.HTTP_200_OK, data={"success": True}) 
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})

class CustomerCreateSetupIntentViewSet(views.APIView):
    permission_classes = [IsClientOnly]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.stripe_manager = StripeManager()
    
    def post(self, request, format=None):
        try:
            client_secret = self.stripe_manager.create_setup_intent(user_id=request.user.id)
            if client_secret:
                return response.Response(status=status.HTTP_200_OK, data={"client_secret": client_secret})
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Failed to create setup intent."})
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})

class CustomerTransactionViewSet(views.APIView):
    permission_classes = [IsClientOnly]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.stripe_manager = StripeManager()

    def get(self, request, format=None):
        try:
            transactions = CustomerTransactionModel.objects.filter(stripe_customer__user_id=request.user.id)
            serializer = CustomerTransactionSerializer(transactions, many=True)
            return response.Response(status=status.HTTP_200_OK, data=serializer.data)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})
    
    def post(self, request, format=None):
        """
        Endpoint to create a charge for one or more products.
        Expected input:
        {
            "products": [
                {"id": 1, "quantity": 2},
                {"id": 3, "quantity": 1}
            ],
            "total_amount": 5000
        }
        """
        try:
            products = request.data.get('products', None)
            passed_total_amount = int(request.data.get('total_amount', 0))
            total_amount = 0
            charge_description = ""
            currencies_used = set()
            products_info = {}
            db_products = []
            for product in products:
                product_id = product.get('id', None)
                quantity = product.get('quantity', 1)
                if not product_id or quantity < 1:
                    return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Each product must have a valid id and quantity greater than 0."})
                cur_product = ProductModel.objects.filter(id=product_id, is_active=True).first()
                if not cur_product:
                    return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"Product with id {product_id} not found or inactive."})
                currencies_used.add(cur_product.currency)
                if len(currencies_used) > 1:
                    return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "All products must have the same currency."})
                total_amount += cur_product.price * cur_product.currency_mutltiplier_to_stripe_unit * quantity
                charge_description += f"{cur_product.name} (x{quantity}), "
                db_products.append(cur_product)
                products_info[f"{cur_product.id}"] = {"quantity": quantity, "price": cur_product.price, "category": cur_product.category, "name": cur_product.name}
            charge_description = charge_description.rstrip(", ")
            if passed_total_amount != total_amount:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Total amount mismatch."})
            if total_amount == 0:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Total amount must be greater than zero."})
            cur_customer = StripeCustomerModel.objects.filter(user_id=request.user.id).first()
            if not cur_customer:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "No Stripe customer found for the user."})
            products_info_str = json.dumps({
                str(k): {
                    "quantity": v["quantity"],
                    "price": float(v["price"]),
                    "category": v["category"],
                    "name": v["name"],
                    } for k, v in products_info.items()
            })
            charge_response = self.stripe_manager.charge_default_payment_method(
                user_id=request.user.id,
                amount=int(total_amount),
                currency=list(currencies_used)[0],
                description=charge_description,
                metadata={"products_info": products_info_str, "total_amount": f"{total_amount}"})
            cur_payment_intent = charge_response.get("payment_intent") if charge_response.get("payment_intent") else None
            if not cur_payment_intent or not cur_payment_intent.get("id", None):
                error_message = charge_response.get("message", "Payment intent ID not found in the charge response.")
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": error_message})
            cur_transaction = CustomerTransactionModel.objects.filter(stripe_customer=cur_customer, payment_intent_id=cur_payment_intent.get("id")).first()
            if not cur_transaction:
                cur_transaction = CustomerTransactionModel()
                cur_transaction.stripe_customer = cur_customer
                cur_transaction.payment_intent_id = cur_payment_intent.get("id")
                cur_transaction.metadata = cur_payment_intent.get("metadata")
            if charge_response.get("success"):
                cur_transaction.status = "succeeded"
                cur_transaction.save()
                for product in db_products:
                    transaction_product_exists = CustomerTransactionProductModel.objects.filter(transaction=cur_transaction, product=product).exists()
                    if not transaction_product_exists:
                        transaction_product = CustomerTransactionProductModel()
                        transaction_product.transaction = cur_transaction
                        transaction_product.product = product
                        transaction_product.quantity = products_info[f"{product.id}"]["quantity"]
                        transaction_product.price_at_purchase = product.price
                        transaction_product.save()
                serializer = CustomerTransactionSerializer(cur_transaction)
                return response.Response(status=status.HTTP_200_OK, data=serializer.data)
            cur_transaction.status = "failed"
            cur_transaction.save()
            serializer = CustomerTransactionSerializer(cur_transaction)
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": charge_response.get("message", "Charge failed.")})
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})