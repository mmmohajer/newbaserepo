from billing.models import user_billing, customer, product

UserBillingModel = user_billing.UserBilling

StripeCustomerModel = customer.StripeCustomer
StripeCustomerPaymentMethodModel = customer.StripeCustomerPaymentMethod
CustomerTransactionModel = customer.CustomerTransaction
CustomerTransactionProductModel = customer.CustomerTransactionProduct

ProductModel = product.Product