from app.config import SendGrid_API
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def resetPassword(token, email):
    BaseURL = "http://auth.roomfin.xyz/reset/password?token="
    url = BaseURL + token
    message = Mail(
    from_email='support@roomfin.xyz',
    to_emails=email)
    message.dynamic_template_data = {
        'token': url
    }
    message.template_id = ''
    try:
        sendgrid_client = SendGridAPIClient(SendGrid_API)
        response = sendgrid_client.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

def VerifyEmail(token, email):
    BaseURL = "http://auth.roomfin.xyz/verify?token="
    url = BaseURL + token
    message = Mail(
    from_email='support@leaping.io',
    to_emails=email)
    message.dynamic_template_data = {
        'token': url
    }
    message.template_id = ''
    try:
        sendgrid_client = SendGridAPIClient(SendGrid_API)
        response = sendgrid_client.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)