from django.conf import settings
from rest_framework import viewsets, permissions, status, views, response, decorators, response, pagination
import stripe

from billing.tasks import attach_payment_method_to_customer_task, handle_payment_intnet_succeeded_task, handle_payment_intent_payment_failed_task

class HandleWebhookViewSet(views.APIView):
    permission_classes = [permissions.AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.stripe = stripe
        self.stripe.api_key = settings.STRIPE_SECRET_KEY
        self.endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    def post(self, request, format=None):
        try:
            event = None
            payload = request.body
            sig_header = request.headers.get('Stripe-Signature')
            event = self.stripe.Webhook.construct_event(
                payload, sig_header, self.endpoint_secret
            )
            print(f"Received event: {event['type']}")
            if event['type'] == 'payment_method.attached':
                payment_method_id = event['data']['object']['id']
                attach_payment_method_to_customer_task.delay(payment_method_id=payment_method_id)
                return response.Response(status=status.HTTP_200_OK, data={"success": True, "message": "payment_method.attached handled"})
            if event['type'] == 'payment_intent.succeeded':
                payment_intent_id = event['data']['object']['id']
                handle_payment_intnet_succeeded_task.delay(payment_intent_id=payment_intent_id)
                return response.Response(status=status.HTTP_200_OK, data={"success": True, "message": "payment_intent.succeeded handled"})
            if event['type'] == 'payment_intent.payment_failed':
                payment_intent_id = event['data']['object']['id']
                handle_payment_intent_payment_failed_task.delay(payment_intent_id=payment_intent_id)
                return response.Response(status=status.HTTP_200_OK, data={"success": True, "message": f"payment_intent.payment_failed received for {payment_intent_id}"})
            return response.Response(status=status.HTTP_200_OK, data={"success": False, "message": f"{event['type']} is not in the list of types to return a response"})
        except Exception as e:
            print(e)
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"success": False, "message": f"{str(e)}"})