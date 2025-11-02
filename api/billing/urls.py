from django.urls import path, include
from rest_framework import routers

from . import views

urlpatterns = [
    path('user-billing/', views.UserBillingViewSet),
    path('stripe-main-webhook/', views.WebhookViewSet),
    path('customer-payment-method/', views.CustomerPaymentMethodViewSet),
    path('customer-create-setup-intent/', views.CustomerCreateSetupIntentViewSet),
    path('customer-transaction/', views.CustomerTransactionViewSet),
    path('mentorship-products/', views.MentorshipProductViewSet),
]
