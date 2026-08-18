import random
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from products.models import Merchants

'''
def verify_merchant_code(*, pending_data, code):
    """
    pending_data: dict من session
    code: الكود المدخل من المستخدم
    """

    if code != str(pending_data["verification_code"]):
        return {
            "success": False,
            "error": "invalid_code",
        }

    # إنشاء User
    user = User.objects.create(
        username=pending_data["email"],
        email=pending_data["email"],
        password=make_password(pending_data["password"]),
    )

    # إنشاء Merchant
    merchant = Merchants.objects.create(
        user=user,
        name=pending_data["name"],
        email=pending_data["email"],
        password=user.password,
        merchant_lang=pending_data["merchant_lang"],
        is_verified=True,
        verification_attempts=0,
    )

    return {
        "success": True,
        "user": user,
        "merchant": merchant,
    }
'''
def verify_merchant_code(*, pending_data, code):
    """
    pending_data: dict من session
    code: الكود المدخل من المستخدم
    """
    print("VERIFY SERVICE CALLED")
    if code != str(pending_data["code"]): # 💡 تم تعديل المفتاح ليتطابق مع "code" المذخور في الـ session
        return {
            "success": False,
            "error": "invalid_code",
        }

    # إنشاء User
    user = User.objects.create(
        username=pending_data["email"],
        email=pending_data["email"],
        password=make_password(pending_data["password"]),
    )

    # إنشاء Merchant
    merchant = Merchants.objects.create(
        user=user,
        name=pending_data["name"],
        email=pending_data["email"],
        password=user.password,
        merchant_lang=pending_data["notification_lang"], # 💡 تم تعديل المفتاح ليطابق الـ session
        
        # 💡 السطر السحري الجديد لحفظ حساب إنستغرام في قاعدة البيانات
        instagram_username=pending_data.get("instagram_username"), 
        
        is_verified=True,
        verification_attempts=0,
    )

    return {
        "success": True,
        "user": user,
        "merchant": merchant,
    }
def generate_verification_code():
    return str(random.randint(100000, 999999))