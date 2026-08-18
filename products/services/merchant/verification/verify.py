from django.contrib.auth import login

from products.services.merchant.verification.email import send_verification_email

# services/merchant/verification/service.py
from django.contrib.auth import login


def normalize_code(code):
    arabic = "٠١٢٣٤٥٦٧٨٩"
    english = "0123456789"
    return code.translate(str.maketrans(arabic, english))


from django.contrib.auth import login
from django.contrib.auth import get_user_model

User = get_user_model()

from django.contrib.auth import get_user_model
from django.contrib.auth import login

from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.db import IntegrityError

from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.contrib.auth import login

from django.contrib.auth import get_user_model, login

from django.contrib.auth import get_user_model, login

from django.contrib.auth import get_user_model, login

from django.contrib.auth import get_user_model, login
from products.models import Merchants  # عدلي حسب مكان الموديل
from django.utils import timezone
User = get_user_model()

# def verify_merchant_service(*, request, pending_data, code):
#     try:
#         # توحيد الكود
#         arabic = "٠١٢٣٤٥٦٧٨٩"
#         english = "0123456789"
#         code = code.translate(str.maketrans(arabic, english))

#         saved_code = pending_data.get("code")
#         if not saved_code or code != saved_code:
#             return {"success": False}

#         # الحصول على User أو إنشاؤه
#         user, created = User.objects.get_or_create(
#             username=pending_data["email"],
#             defaults={"email": pending_data["email"]},
#         )
#         if created:
#             user.set_password(pending_data["password"])
#             user.save()

#         # تسجيل الدخول
#         login(request, user)

#         # إنشاء سجل في Merchants إذا لم يكن موجودًا
#         merchant, m_created = Merchants.objects.get_or_create(
#             email=pending_data["email"],
#             defaults={
#                 "user": user,
#                 "name": pending_data.get("name"),
#                 "password": pending_data.get("password"),  # إن كنتِ تريدين حفظها في الموديل
#                 "merchant_lang": pending_data.get("notification_lang", "en"),
#                 "verification_code": code,
#                 "is_verified": True,
#                 "created_at": timezone.now(),
#             }
#         )

#         # تنظيف السيشن
#         request.session.pop("pending_merchant", None)
#         request.session.pop("lang", None)

#         return {"success": True}

#     except Exception as e:
#         print("VERIFY SERVICE ERROR:", e)
#         return {"success": False}
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
def verify_merchant_service(*, request, pending_data, code):
    print("VERIFY SERVICE CALLED")
    try:
        # ==============================
        # توحيد الأرقام العربية إلى الإنجليزية
        # ==============================
        arabic = "٠١٢٣٤٥٦٧٨٩"
        english = "0123456789"
        code = code.translate(str.maketrans(arabic, english))

        # ==============================
        # التحقق من كود التفعيل
        # ==============================
        saved_code = pending_data.get("code")
        if not saved_code or code != saved_code:
            return {
                "success": False,
                "error": "invalid_code",
            }
        print("Entered code:", repr(code))
        print("Saved code:", repr(saved_code))
        email = pending_data["email"]
        instagram_username = pending_data["instagram_username"]

        # ==============================
        # التأكد أن البريد غير مستخدم
        # ==============================
    ##############################################
        # if Merchants.objects.filter(email=email).exists():
        #     return {
        #         "success": False,
        #         "error": "email_exists",
        #     }
    ##############################################
        merchant = Merchants.objects.filter(email=email).first()
        # ==============================
        # التأكد أن المستخدم غير موجود
        # ==============================
        if User.objects.filter(username=email).exists():
            return {
                "success": False,
                "error": "email_exists",
            }
        # ==============================
        # التأكد أن اسم الإنستغرام غير مستخدم
        # ==============================
        if Merchants.objects.filter(
            instagram_username=instagram_username
        ).exists():
            return {
                "success": False,
                "error": "instagram_exists",
            }

        # ==============================
        # إنشاء المستخدم
        # ==============================
        # user = User.objects.create_user(
        #     username=email,
        #     email=email,
        #     password=pending_data["password"],
        # )
        with transaction.atomic():

            user = User.objects.create_user(
                username=email,
                email=email,
                password=pending_data["password"],
            )
#########################
            # merchant = Merchants.objects.create(
            #     user=user,
            #     name=pending_data["name"],
            #     email=email,
            #     instagram_username=instagram_username,
            #     merchant_lang=pending_data.get(
            #         "notification_lang",
            #         "en",
            #     ),
            #     verification_code=code,
            #     is_verified=True,
            #     created_at=timezone.now(),
            # )
#################################
            if merchant:
                merchant.user = user
                merchant.name = pending_data["name"]
                merchant.instagram_username = instagram_username
                merchant.merchant_lang = pending_data.get("notification_lang", "en")
                merchant.verification_code = code
                merchant.is_verified = True
                merchant.save()
            else:
                merchant = Merchants.objects.create(
                    user=user,
                    name=pending_data["name"],
                    email=email,
                    instagram_username=instagram_username,
                    merchant_lang=pending_data.get("notification_lang", "en"),
                    verification_code=code,
                    is_verified=True,
                    created_at=timezone.now(),
    )
        # ==============================
        # إنشاء التاجر
        # ==============================
        # merchant = Merchants.objects.create(
        #     user=user,
        #     name=pending_data["name"],
        #     email=email,
        #     instagram_username=instagram_username,
        #     merchant_lang=pending_data.get(
        #         "notification_lang", "en"
        #     ),
        #     verification_code=code,
        #     is_verified=True,
        #     created_at=timezone.now(),
        # )

        # ==============================
        # تسجيل الدخول
        # ==============================
        login(request, user)
        

        # refresh = RefreshToken.for_user(user)
        refresh = RefreshToken.for_user(user) # توليد التوكين للمستخدم
        request.session.pop("pending_merchant", None)
        request.session.pop("lang", None)
        request.session.modified = True
        # إرجاع رد النجاح مضافاً إليه التوكينات للـ React
        return {
            "success": True,
            "merchant": merchant,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
        # ==============================
        # حذف بيانات التسجيل المؤقتة
        # ==============================
        

        # return {
        #     "success": True,
        #     "merchant": merchant,
        #     "access":str(refresh.access_token),
        #     "refresh":str(refresh),
        # }
        

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("VERIFY SERVICE ERROR:", e)
        return {
            "success": False,
            "error": "server_error",
        }