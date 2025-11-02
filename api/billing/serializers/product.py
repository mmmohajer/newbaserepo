from rest_framework import serializers

from billing.models import ProductModel

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductModel
        fields = ['id', 'name', 'category', 'price', 
                  'currency', 'description', 'details',
                  'currency_mutltiplier_to_stripe_unit', 
                  'updated_at', 'created_at',
                  'base_price', 'is_active']

