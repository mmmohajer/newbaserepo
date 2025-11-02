from config.utils.email import send_email

def test_email_sending():
    try:
        send_email(email="mmmohajer70@gmail.com", params={"first_name": "Mohammad", "activate_link": "http://localhost:8000/activate"}, email_template_id="d-93cfd0c8058e4e0685cded44d6bce945")
    except Exception as e:
        print(e)


def test_config_utils():
    test_email_sending()