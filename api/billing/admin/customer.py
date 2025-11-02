from django.contrib import admin

class StripeCustomerAdmin(admin.ModelAdmin):
    autocomplete_fields = ['user']
    list_display = ['user_email', 'stripe_customer_id']
    list_select_related = ['user']
    list_per_page = 10
    search_fields = ['user__email']

    def user_email(self, obj):
        return obj.user.email

class StripeCustomerPaymentMethodAdmin(admin.ModelAdmin):
    autocomplete_fields = ['stripe_customer']
    list_display = ['stripe_customer_email', 'payment_method_id', 'is_default', 'brand', 'last4', 'exp_month', 'exp_year']
    list_select_related = ['stripe_customer', 'stripe_customer__user']
    list_per_page = 10
    search_fields = ['stripe_customer__user__email', 'payment_method_id']

    def stripe_customer_email(self, obj):
        return obj.stripe_customer.user.email

class CustomerTransactionAdmin(admin.ModelAdmin):
    autocomplete_fields = ['stripe_customer']
    list_display = ['stripe_customer_email', 'payment_intent_id', 'status']
    list_select_related = ['stripe_customer', 'stripe_customer__user']
    list_per_page = 10
    search_fields = ['stripe_customer__user__email', 'payment_intent_id']
    list_filter = ['status']

    def stripe_customer_email(self, obj):
        return obj.stripe_customer.user.email
    
    def product_name(self, obj):
        return obj.product.name if obj.product else "N/A"

class CustomerTransactionProductAdmin(admin.ModelAdmin):
    autocomplete_fields = ['transaction', 'product']
    list_display = ['transaction_id', 'product_name', 'quantity', 'price_at_purchase']
    list_select_related = ['transaction', 'product']
    list_per_page = 10
    search_fields = ['transaction__payment_intent_id', 'product__name']

    def transaction_id(self, obj):
        return obj.transaction.id

    def product_name(self, obj):
        return obj.product.name if obj.product else "N/A"