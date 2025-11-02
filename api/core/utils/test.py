from core.tasks import send_activation_email_after_register_task

def test_email_sending():
    try:
        send_activation_email_after_register_task.delay(user_id=1, redirect_url="")
    except Exception as e:
        print(e)


def test_core_utils():
    test_email_sending()