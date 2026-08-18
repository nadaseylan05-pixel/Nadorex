from products.models import Merchants
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from products.services.merchant.verification.email import send_verification_email
from products.services.merchant.verification.code import generate_verification_code
'''
def register_merchant(
    *,
    name,
    email,
    password,
    merchant_lang,
    lang,
    translations
):
    # ❌ هل الإيميل مسجل ومفعل؟
    if Merchants.objects.filter(email=email, is_verified=True).exists():
        return {
            "success": False,
            "error": "email_already_registered"
        }

    # 🔐 توليد كود التحقق
    code = generate_verification_code()

    # ✉️ إرسال الإيميل
    email_sent = send_verification_email(
        to_email=email,
        code=code,
        lang=lang,
        translations=translations
    )

    if not email_sent:
        return {
            "success": False,
            "error": "verification_email_failed"
        }

    # ✅ نجاح
    return {
        "success": True,
        "pending_data": {
            "name": name,
            "email": email,
            "password": password,
            "merchant_lang": merchant_lang,
            "verification_code": code,
        }
    }
'''
from products.models import Merchants
#from products.services.merchant.verification import generate_verification_code

def register_merchant(*, name, email, password, merchant_lang):
    if Merchants.objects.filter(email=email, is_verified=True).exists():
        return {
            "success": False,
            "error": "email_already_registered"
        }

    code = generate_verification_code()

    return {
        "success": True,
        "pending_data": {
            "name": name,
            "email": email,
            "password": password,
            "merchant_lang": merchant_lang,
            "verification_code": code,
        }
    }