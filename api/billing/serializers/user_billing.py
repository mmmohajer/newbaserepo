from rest_framework import serializers

from billing.models import UserBillingModel

class UserBillingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserBillingModel
        fields = ['id', 'user_id', 'billing_name', 
                  'billing_country', 'billing_state', 
                  'billing_city', 'billing_address', 
                  'billing_zipcode', 
                  'updated_at', 'created_at']