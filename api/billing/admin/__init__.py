from django.contrib import admin

from billing.models import UserBillingModel, StripeCustomerModel, StripeCustomerPaymentMethodModel, CustomerTransactionModel, ProductModel, CustomerTransactionProductModel
from billing.admin import user_billing, customer, product

admin.site.register(UserBillingModel, user_billing.UserBillingAdmin)

admin.site.register(StripeCustomerModel, customer.StripeCustomerAdmin)
admin.site.register(StripeCustomerPaymentMethodModel, customer.StripeCustomerPaymentMethodAdmin)
admin.site.register(CustomerTransactionModel, customer.CustomerTransactionAdmin)
admin.site.register(CustomerTransactionProductModel, customer.CustomerTransactionProductAdmin)

admin.site.register(ProductModel, product.ProductAdmin)