import smtplib
from email.mime.text import MIMEText
from django.conf import settings

import smtplib
from email.mime.text import MIMEText
from django.conf import settings


def send_verification_email(*, to_email, code, lang, translations):
    sender_email = settings.EMAIL_HOST_USER
    sender_password = settings.EMAIL_HOST_PASSWORD

    body = translations["verification_email_body"].format(code=code)
    subject = translations["verification_email_subject"]

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        return True
    except Exception as e:
        print("SMTP Error:", e)
        return False