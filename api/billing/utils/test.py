from billing.utils.stripe_manager import StripeManager

def test_stripe_manager():
    manager = StripeManager()
    # manager.create_stripe_customer(user_id=2)
    # res = manager.create_setup_intent(user_id=3)
    # res = manager.get_customer_payment_methods(user_id=3)
    # res = manager.get_default_payment_method(user_id=3)
    # res = manager.set_default_payment_method(user_id=3, payment_method_id="pm_1SIFRQIbUFZ9Im2HP2T3ngN3")
    # res = manager.retrieve_payment_method_from_succeeded_setup_intent(setup_intent_id="seti_1SIDdOIbUFZ9Im2HIifVO2cM")
    # res = manager.detach_payment_method(payment_method_id="pm_1SIDe4IbUFZ9Im2Hi4IU7WBl")
    products_info = { 
        2: {
            "quantity": 2,
            "price": 200,
            "category": "Test Category",
            "name": "Test Product"
        }
    }
    res = manager.charge_default_payment_method(user_id=3, amount=500, currency="usd", description="Test Charge", metadata={"products_info": str(products_info)})
    # res = manager.refund_payment(payment_intent_id="pi_3SIYzqIbUFZ9Im2H1C6EwmFB", reason="requested_by_customer", metadata={"order_id": "12345"})
    # pdf_bytes = manager.generate_transaction_receipt({
    #     "CLIENT_NAME": "John Doe",
    #     "CLIENT_STREET_ADDRESS": "123 Main Street",
    #     "CLIENT_CITY": "Toronto",
    #     "CLIENT_PROVINCE": "ON",
    #     "CLIENT_COUNTRY": "CA",
    #     "CLIENT_POSTAL_CODE": "M1M 1M1",
    #     "RECEIPT_NUMBER": "REC-2023-001",
    #     "TRANSACTION_DATE": "October 16, 2025",
    #     "ITEMS": [
    #         {
    #             "date": "October 16, 2025",
    #             "description": "1-Hour Mentorship Session",
    #             "amount": "$150.00"
    #         },
    #         {
    #             "date": "October 16, 2025", 
    #             "description": "Platform Fee",
    #             "amount": "$10.00"
    #         }
    #     ],
    #     "TOTAL": "$160.00"
    # })
    # with open('/websocket_tmp/receipt.pdf', 'wb') as f:
    #     f.write(pdf_bytes)  
    print("StripeManager test executed")
    print("Response:", res)


def test_billing_utils():
    test_stripe_manager()