from billing.views import user_billing, webhook, customer, product

UserBillingViewSet = user_billing.UserBillingViewSet.as_view()

WebhookViewSet = webhook.HandleWebhookViewSet.as_view()

CustomerPaymentMethodViewSet = customer.CustomerPaymentMethodViewSet.as_view()
CustomerCreateSetupIntentViewSet = customer.CustomerCreateSetupIntentViewSet.as_view()
CustomerTransactionViewSet = customer.CustomerTransactionViewSet.as_view()

MentorshipProductViewSet = product.MentorshipProductViewSet.as_view()