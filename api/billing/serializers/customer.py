from rest_framework import serializers

from config.utils.storage_manager import CloudStorageManager
from billing.models import StripeCustomerPaymentMethodModel, CustomerTransactionModel

class StripeCustomerPaymentMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = StripeCustomerPaymentMethodModel
        fields = ['id', 'is_default', 'brand', 'last4', 
                  'exp_month', 'exp_year', 'payment_method_id',
                  'updated_at', 'created_at']


class CustomerTransactionSerializer(serializers.ModelSerializer):
    receipt = serializers.SerializerMethodField()

    def get_receipt(self, obj):
        if obj.receipt_file_key:
            storage_manager = CloudStorageManager()
            file_url = storage_manager.get_url(file_key=obj.receipt_file_key, acl='private', expires_in=60 * 60)
            return file_url
        return ""

    class Meta:
        model = CustomerTransactionModel
        fields = ['id', 'stripe_customer', 'payment_intent_id', 
                  'metadata', 'status',
                  'created_at', 'updated_at', 'receipt']
