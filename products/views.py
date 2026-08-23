from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render
from .utils import load_translations, t
from products.services.translations import get_translations
from operator import truediv
from django.core.signals import request_started
from rest_framework.decorators import api_view
import os, uuid
import requests
#from rest_framework.response import Response
from django.db.models import Sum, Avg
from .models import Products, Orders, ProductReviews  # تأكدي من مسميات الموديلز لديكِ
from .services.merchant.login import validate_merchant_login  # الدالة اللي تتحقق من البائع
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Avg
from products.services.merchant.show_products import update_order_status_service
print(update_order_status_service)
from django.db.models import Sum, Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import traceback
import secrets

from urllib.parse import urlencode
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg
from django.db.models.functions import Lower  # ← استيراد دالة تحويل الحروف لصغيرة في قاعدة البيانات
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Merchants, Products, Orders, ProductReviews
from django.utils import timezone
from django.db.models import Sum, Count, Max, Avg
from datetime import timedelta
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def seller_dashboard_api(request):
#     user = request.user
#     lang =request.GET.get("lang", "en")
#     try:
#         merchant = Merchants.objects.get(email=user.email)
#     except Merchants.DoesNotExist:
#         return Response({"success": False, "message": "Merchant profile not found"}, status=404)
    
#     try:
#         merchant_products = Products.objects.filter(merchant_email=merchant.email)
#         merchant_orders = Orders.objects.filter(product__in=merchant_products)
#         print(f"The merchant is : and the orders are : {merchant}  {merchant_orders} ")
#         active_products_count = merchant_products.count()
        
#         # 🎯 الحل الذكي: نقوم بتحويل حالة الأحرف لجدول الطلبات مؤقتاً لصغيرة (.annotate) ثم نفلتر
#         # هذا السطر يعمل مع "processing", "Processing", "PROCESSING" إلخ.
#         total_sales = merchant_orders.annotate(
#             status_lower=Lower('status')
#         ).filter(
#             status_lower__in=["processing", "shipped", "completed"]
#         ).aggregate(
#             total=Sum('total_price')
#         )['total'] or 0.0
        
#         # 🎯 نفس الفكرة للطلبات المعلقة: تقبل pending و processing بأي حالة أحرف
#         pending_orders_count = merchant_orders.annotate(
#             status_lower=Lower('status')
#         ).filter(
#             status_lower__in=["pending", "processing"]
#         ).count()
        
#         average_rating = ProductReviews.objects.filter(
#             product__in=merchant_products
#         ).aggregate(
#             avg_rating=Avg('rating')
#         )['avg_rating'] or 5.0
        
#         # --- تجهيز قائمة آخر 10 طلبات ---
#         recent_orders = merchant_orders.order_by('-order_date')[:10]
#         orders_list = [
#             {
#                 "id": order.id,
#                 "product_name": order.product.name if order.product else "Unknown", 
#                 "total_price": float(order.total_price) if order.total_price else 0.0,
#                 # تأمين إرجاعها للفرونت إند بحروف صغيرة دائماً لتسهيل عمل الـ React
#                 "status": (order.status or "processing").lower()  
#             } for order in recent_orders
#         ]
            
#         # --- تجهيز قائمة آخر 5 مراجعات ---
#         recent_reviews = ProductReviews.objects.filter(
#             product__in=merchant_products
#         ).order_by('-created_at')[:5]
#         print("=" * 50)
#         print("Merchant ID:", merchant.id)
#         print("Merchant Email:", merchant.email)

#         print("Products:", merchant_products.count())
#         print("Orders by product:", merchant_orders.count())

#         orders_by_merchant = Orders.objects.filter(merchant=merchant)
#         print("Orders by merchant:", orders_by_merchant.count())

#         for o in orders_by_merchant:
#             print(
#                 f"Order {o.id} | Product={o.product_id} | Merchant={o.merchant_id} | Status={o.status}"
#             )

#         print("=" * 50)
#         reviews_list = [
#             {
#                 "id": review.id,
#                 "customer_name": review.customer_name,
#                 "product_name": review.product.name if review.product else "Unknown",
#                 "rating": review.rating,
#                 "comment": review.comment,
#                 "created_at": review.created_at.isoformat() if review.created_at else ""
#             } for review in recent_reviews
#         ]
#         print("ORDERS ARE :",reviews_list)

#         return Response({
#             "success": True,
#             "stats": {
#                 "totalSales": float(total_sales),
#                 "pendingOrders": pending_orders_count,
#                 "activeProducts": active_products_count,
#                 "averageRating": round(float(average_rating), 1),
#             },
#             "orders": orders_list,
#             "reviews": reviews_list,
#             "translations":get_translations(["seller", "common","products","orders","returns"], lang)
#         })

#     except Exception as e:
#         traceback.print_exc()
#         return Response({"success": False, "message": f"Server Error: {str(e)}"}, status=500)
from django.db.models import Sum, Count, Avg, Max
from django.db.models.functions import Lower

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_dashboard_api(request):
    user = request.user
    lang = request.GET.get("lang", "en")
    
    try:
        merchant = Merchants.objects.get(email=user.email)
    except Merchants.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Merchant profile not found"
            },
            status=404,
        )

    try:
        merchant_products = Products.objects.filter(
            merchant_email=merchant.email,
            # is_archived=False
        )

        merchant_orders = Orders.objects.filter(
            merchant=merchant
        )

        active_products_count = merchant_products.count()

        total_sales = (
            merchant_orders
            .annotate(status_lower=Lower("status"))
            .filter(
                status_lower__in=[
                    "processing",
                    "shipped",
                    "completed",
                    "delivered",
                ]
            )
            .aggregate(total=Sum("total_price"))["total"]
            or 0
        )

        pending_orders_count = (
            merchant_orders
            .annotate(status_lower=Lower("status"))
            .filter(
                status_lower__in=[
                    "pending",
                    "processing",
                ]
            )
            .count()
        )

        average_rating = (
            ProductReviews.objects
            .filter(product__in=merchant_products)
            .aggregate(avg_rating=Avg("rating"))["avg_rating"]
            or 5
        )

        # ====================================================
        # آخر الطلبات (مجمعة حسب order_number)
        # ====================================================

        grouped_orders = (
            merchant_orders
            .values("order_number")
            .annotate(
                total_price=Sum("total_price"),
                products_count=Count("id"),
                last_date=Max("order_date"),
            )
            .order_by("-last_date")[:10]
        )

        orders_list = []

        for group in grouped_orders:

            first_order = (
                merchant_orders
                .filter(order_number=group["order_number"])
                .first()
            )

            orders_list.append({
                "order_number": group["order_number"],
                "customer_name": first_order.name,
                "phone": first_order.phone,
                "status": (first_order.status or "processing").lower(),
                "products_count": group["products_count"],
                "total_price": float(group["total_price"] or 0),
                "order_date": (
                    first_order.order_date.isoformat()
                    if first_order.order_date else ""
                ),
            })

        # ====================================================
        # آخر المراجعات
        # ====================================================

        recent_reviews = (
            ProductReviews.objects
            .filter(product__in=merchant_products)
            .order_by("-created_at")[:5]
        )

        reviews_list = [
            {
                "id": review.id,
                "customer_name": review.customer_name,
                "product_name": review.product.name if review.product else "Unknown",
                "rating": review.rating,
                "comment": review.comment,
                "created_at": (
                    review.created_at.isoformat()
                    if review.created_at else ""
                ),
            }
            for review in recent_reviews
        ]
        print("LANG:", lang)

        test_translations = get_translations(
            ["seller", "common", "products", "orders", "returns"],
            lang,
        )

        print("TRANSLATIONS TEST:", test_translations)

        return Response({
            "success": True,
            "instagram_username": merchant.instagram_username,
            "stats": {
                "totalSales": float(total_sales),
                "pendingOrders": pending_orders_count,
                "activeProducts": active_products_count,
                "averageRating": round(float(average_rating), 1),
            },
            "orders": orders_list,
            "reviews": reviews_list,
            "translations": get_translations(
                [
                    "seller",
                    "common",
                    "products",
                    "orders",
                    "returns",
                ],
                lang,
            ),
        })

    except Exception as e:
        traceback.print_exc()
        return Response(
            {
                "success": False,
                "message": f"Server Error: {str(e)}",
            },
            status=500,
        )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_orders_api(request):
   
    user = request.user
    lang = request.GET.get("lang", "en")
    print("--- تم الدخول إلى الدالة بنجاح! ---")
    try:
        merchant = Merchants.objects.get(email=user.email)
        
    except Merchants.DoesNotExist:
        return Response(
            {"success": False, "message": "Merchant profile not found"},
            status=404
        )

    try:
        merchant_products = Products.objects.filter(
            merchant_email=merchant.email
        )

        merchant_orders = Orders.objects.filter(
            product__in=merchant_products
        ).order_by("-order_date")

        orders_list = [
            {
                "id": order.id,
                "product_name": order.product.name if order.product else "Unknown",
                "total_price": float(order.total_price) if order.total_price else 0.0,
                "status": (order.status or "processing").lower(),
            }
            for order in merchant_orders
        ]
        print(f"The orders are : {orders_list}")
        return Response({
            "success": True,
            "orders": orders_list
        })

    except Exception as e:
        traceback.print_exc()
        return Response(
            {
                "success": False,
                "message": f"Server Error: {str(e)}",
                "translations": get_translations(["orders", "commun"], lang)
            },
            status=500
        )

from django.db import transaction
from rest_framework.response import Response

from django.shortcuts import render
from products.services.translations import index_translations

def index_api(request):
    #lang = request.session.get("lang", "en")
    lang = request.GET.get("lang", "en")
    
    data = index_translations(lang)
    texts = get_translations(["home"], lang)
   
    texts["lang"]= lang
    return JsonResponse(data)
from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.urls import reverse
# from pywebio.platform.django import webio_view
# from products.logic.buyer import show_products_for_buyer, view_cart
# from products.utils import load_translations, t
# from products.utils import generate_session_id, get_or_create_session_id
# from products.db import connect_db

from django.shortcuts import render
from django.http import HttpRequest
from .utils import load_translations, t, get_or_create_session_id
from .models import CartItems, Orders # تأكدي أن هذا موجود
from django.db.models import Count

def requested_products(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()
    session_id = get_or_create_session_id(request)
    
    # ثم نضيف البيانات الإضافية المطلوبة للعرض
    context.update({
        'lang': lang,
        
        'translations': translations,
        't': lambda key, fallback=None: t(key, lang, translations, fallback),
        })
    
    # return render(request, 'products/buyer.html', context)

    return render(request, 'products/requested_products.html')

from products.services.translations import commerce_view_translations
from django.http import JsonResponse

def commerce_view_api(request):
    lang = request.GET.get('lang', 'ar')
    data = commerce_view_translations(lang)

    return JsonResponse(data, safe=False)

from django.shortcuts import render, redirect
from .models import Merchants
from .utils import generate_verification_code, send_verification_email, register_merchant_in_iyzico
#import bcrypt

# هنا
import random
from django.core.mail import send_mail


from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from products.models import Merchants
from products.utils import t, load_translations, generate_verification_code, send_verification_email
#import bcrypt
import uuid

import smtplib
from email.mime.text import MIMEText

from email.mime.text import MIMEText
import smtplib
from django.conf import settings
# THe last 

from django.contrib.auth.models import User
from django.contrib.auth import login
from django.contrib.auth.hashers import make_password


from django.shortcuts import render, redirect
from django.contrib.auth import login
#from products.services.merchant.verification import verify_merchant_code
#from products.services.merchant.login import validate_merchant_login

from products.services.translations import merchant_verify_translations

from rest_framework.decorators import api_view
#from rest_framework.response import Response
#from rest_framework import status

from products.services.translations import merchant_verify_translations
from products.services.merchant.verification.verify import  verify_merchant_service

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


from rest_framework.decorators import api_view
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# @api_view(["POST"])
# def merchant_verify_api(request):
#     lang = request.session.get("lang", "ar")
#     translations = merchant_verify_translations(lang)

#     pending = request.session.get("pending_merchant")
#     if not pending:
#         return Response({"success": False, "message": translations["session_expired"]}, status=400)

#     code = request.data.get("code", "").strip()
#     if not code:
#         return Response({"success": False, "message": translations["verification_code_required"]}, status=400)

#     # ✅ استدعاء دالة الخدمة للتحقق وإنشاء المستخدم
#     result = verify_merchant_service(request=request, pending_data=pending, code=code)

#     if not result["success"]:
#         return Response({"success": False, "message": translations["invalid_verification_code"]}, status=400)

#     return Response({"success": True, "message": translations["verification_success"]}, status=200)
@api_view(["POST"])
def merchant_verify_api(request):
    lang = request.session.get("lang", "ar")
    translations = merchant_verify_translations(lang)
    try:
        
        pending = request.session.get("pending_merchant")
        if not pending:
            return Response(
                {
                    "success": False,
                    "message": translations["session_expired"],
                },
                status=400,
            )

        code = request.data.get("code", "").strip()
        if not code:
            return Response(
                {
                    "success": False,
                    "message": translations["verification_code_required"],
                },
                status=400,
            )

        result = verify_merchant_service(
            request=request,
            pending_data=pending,
            code=code,
        )
        print(result)
        if not result["success"]:

            if result["error"] == "invalid_code":
                message = translations["invalid_verification_code"]

            elif result["error"] == "email_exists":
                message = translations["email_already_registered"]

            elif result["error"] == "instagram_exists":
                message = translations["instagram_username_already_registered"]

            else:
                message = translations.get("server_error",
                                       "server_error",
                                       
                )

            return Response(
                {
                    "success": False,
                    "message": message,
                },
                status=400,
            )

        return Response(
            {
                "success": True,
                "message": translations["verification_success"],
                # "redirect_url": "/seller/dashboard",
                "redirect_url": "/seller/login/add",
                "access":result["access"],
                "refresh":result["refresh"],
            },
            status=200,
        )
    except Exception as e:
        print("ERROR IN REGISTRATION:", e)
        return Response(
            {
                "success": False,
                "message": translations.get(
                    "server_error",
                    "Server error",
                ),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
# @api_view(["POST"])
# def merchant_register_api(request):
#     # ==============================
#     # اللغة
#     # ==============================
#     lang = request.GET.get("lang", "en")
#     translations = merchant_register_translations(lang)

#     # ==============================
#     # قراءة البيانات
#     # ==============================
#     name = request.data.get("name")
#     email = request.data.get("email")
#     password = request.data.get("password")
#     notification_lang = request.data.get("notification_lang", lang)
    
#     # 💡 قراءة يوزر إنستغرام الجديد وتنظيفه من المسافات
#     instagram_username = request.data.get("instagram_username", "").strip().lower()

#     # 💡 التحقق من أن جميع الحقول الأساسية بما فيها إنستغرام تم إدخالها
#     if not all([name, email, password, instagram_username]):
#         return Response(
#             {
#                 "success": False,
#                 "message": translations.get(
#                     "missing_fields",
#                     "All fields are required"
#                 )
#             },
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # 💡 خطوة ذكية: التحقق الفوري إذا كان يوزر إنستغرام مسجل مسبقاً قبل إرسال كود التحقق
#     if Merchants.objects.filter(instagram_username=instagram_username).exists():
#         return Response(
#             {
#                 "success": False,
#                 "message": "اسم مستخدم إنستغرام هذا مسجل كمتجر بالفعل!" # يمكنك إضافتها للـ translations لاحقاً
#             },
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # ==============================
#     # توليد كود التحقق
#     # ==============================
#     verification_code = generate_verification_code() #str(random.randint(100000, 999999))

#     # ==============================
#     # حفظ البيانات مؤقتًا في session (تم إضافة حقل إنستغرام)
#     # ==============================
#     request.session["pending_merchant"] = {
#         "name": name,
#         "email": email,
#         "password": password,  # لاحقًا hashing
#         "instagram_username": instagram_username, # 💡 تم حفظه هنا ليمر إلى دالة التحقق النهائية
#         "notification_lang": notification_lang,
#         "code": verification_code,
#     }
#     request.session["lang"] = notification_lang
#     request.session.modified = True
    
#     #print("sent email:", verification_code)
#     # ==============================
#     # إرسال الكود (Email / Console مؤقتًا)
#     # ==============================
#     print("MERCHANT VERIFY CODE:", verification_code)
#     print("SESSION KEYS:", request.session.keys())
    
#     return Response(
#         {
#             "success": True,
#             "message": translations.get(
#                 "verification_sent",
#                 "Verification code sent successfully"
#             ),
#         },
#         status=status.HTTP_200_OK
#     )
from django.contrib.auth.models import User
@api_view(["POST"])
def merchant_register_api(request):
    
    # ==============================
    # اللغة
    # ==============================
    lang = request.GET.get("lang", "en")
    translations = merchant_register_translations(lang)
    try:
    # ==============================
    # قراءة البيانات
    # ==============================
        name = request.data.get("name", "").strip()
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        notification_lang = request.data.get("notification_lang", lang)
        instagram_username = request.data.get(
            "instagram_username", ""
        ).strip().lower()
        name = request.data.get("name", "").strip()
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        notification_lang = request.data.get("notification_lang", lang)
        instagram_username = request.data.get(
            "instagram_username", ""
        ).strip().lower()

        print("EMAIL:", email)
        print("INSTAGRAM:", instagram_username)

        print("User exists:", User.objects.filter(username=email).exists())
        print("Merchant exists:", Merchants.objects.filter(email=email).exists())
        print(
            "Instagram exists:",
            Merchants.objects.filter(
                instagram_username=instagram_username
            ).exists(),
        )
        # ==============================
        # التحقق من الحقول المطلوبة فقط
        # ==============================
        if not all([name, email, password, instagram_username]):
            return Response(
                {
                    "success": False,
                    "message": translations.get(
                        "missing_fields",
                        "All fields are required",
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        # ==============================
        # التحقق من البريد الإلكتروني
        # ==============================
############################
        # if Merchants.objects.filter(email=email).exists():
        #     return Response(
        #         {
        #             "success": False,
        #             "message": translations["email_already_registered"],
        #         },
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )
###############################
        existing_merchant = Merchants.objects.filter(email=email).first()

        if existing_merchant and existing_merchant.user_id is not None:
            return Response(
                {
                    "success": False,
                    "message": translations["email_already_registered"],
                },
                status=status.HTTP_400_BAD_REQUEST,
    )
        # ==============================
        # التحقق من اسم مستخدم إنستغرام
        # ==============================
    #########################
        # if Merchants.objects.filter(
        #     instagram_username=instagram_username
        # ).exists():
        #     return Response(
        #         {
        #             "success": False,
        #             "message": translations["instagram_username_already_registered"],
        #         },
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )
    ###########################
        existing_instagram = Merchants.objects.filter(
            instagram_username=instagram_username
        ).first()

        if existing_instagram and existing_instagram.email != email:####
    #############################
        #اخر شي اضفته 
        # if User.objects.filter(username=email).exists():
            return Response(
                {
                    "success": False,
                    "message": translations.get(
                        "email_already_registered",
                        "This email is already registered.",
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        # ==============================
        # إنشاء كود التحقق
        # ==============================
        verification_code = generate_verification_code()
        email_sent = send_verification_email(email, verification_code)
        print("Generated code:", verification_code)
        if not email_sent:
            return Response(
                {
                    "success": False,
                    "message": translations.get("email_send_failed",
                                            "Failed to send verification email",
                                            ),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
        # ==============================
        # حفظ البيانات مؤقتاً
        # ==============================
        request.session["pending_merchant"] = {
            "name": name,
            "email": email,
            "password": password,
            "instagram_username": instagram_username,
            "notification_lang": notification_lang,
            "code": verification_code,
        }

        request.session["lang"] = notification_lang
        request.session.modified = True

    # ==============================
    # إرسال الكود (سيستبدل لاحقاً بالإيميل)
    # ==============================
        print("MERCHANT VERIFY CODE:", verification_code)
    
        return Response(
            {
                "success": True,
                "message": translations.get(
                    "verification_sent",
                    "Verification code sent successfully",
                ),
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print("ERROR IN REGISTRATION:", e)
        return Response(
            {
                "success": False,
                "message": translations.get(
                    "server_error",
                    "Server error",
                ),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        
from rest_framework.decorators import api_view
from rest_framework.response import Response


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def instagram_login(request):
#     merchant = Merchants.objects.get(user=request.user)

#     state = secrets.token_urlsafe(32)

#     request.session[f"instagram_state_{state}"] = merchant.id
#     request.session.modified = True
#     print("===== INSTAGRAM STATE =====")
#     print("STATE:", state)
#     print("MERCHANT ID:", merchant.id)
#     print("SESSION KEY EXISTS:", request.session.get(f"instagram_state_{state}"))
#     print("SESSION KEY:", f"instagram_state_{state}")
#     params = {
#         "force_reauth": "true",
        
#         "client_id": "1430555705712818",
#         "redirect_uri": "https://nadorex.onrender.com/api/instagram/callback/",
#         "response_type": "code",
#         "scope": (
#             "instagram_business_basic,"
#             "instagram_business_manage_messages,"
#             "instagram_business_manage_comments,"
#             "instagram_business_content_publish,"
#             "instagram_business_manage_insights"
#         ),
#         "state": state,
#     }

#     query_string = urlencode(params)
#     print("INSTAGRAM PARAMS:", params)
#     print("INSTAGRAM QUERY:", query_string)
#     print("INSTAGRAM LOGIN URL:", f"https://www.instagram.com/oauth/authorize?{query_string}")
#     return Response({
#         "success": True,
#         "login_url": f"https://www.instagram.com/oauth/authorize?{query_string}"
#     })
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def instagram_login(request):
    try:
        merchant = Merchants.objects.get(
            user=request.user
        )

    except Merchants.DoesNotExist:
        return Response(
            {
                "success": False,
                "error": "Merchant not found"
            },
            status=404
        )

    # ==========================================
    # إنشاء State آمن وموقّع
    # ==========================================
    # نضع merchant.id داخل state ولكن بتوقيع Django
    # حتى لا يستطيع المستخدم تغييره.
    signer = TimestampSigner()

    state = signer.sign(
        str(merchant.id)
    )

    # ==========================================
    # Instagram OAuth parameters
    # ==========================================

    params = {
        "force_reauth": "true",

        # Instagram App ID
        "client_id": "1430555705712818",

        # يجب أن يطابق Meta تمامًا
        "redirect_uri":
            "https://nadorex.onrender.com/api/instagram/callback/",

        # نريد Authorization Code
        "response_type": "code",

        # الصلاحيات المطلوبة
        "scope": (
            "instagram_business_basic,"
            "instagram_business_manage_messages,"
            "instagram_business_manage_comments,"
            "instagram_business_content_publish,"
            "instagram_business_manage_insights"
        ),

        # State الموقّع
        "state": state,
    }

    query_string = urlencode(params)

    login_url = (
        "https://www.instagram.com/oauth/authorize?"
        f"{query_string}"
    )

    print("===== INSTAGRAM LOGIN =====")
    print("MERCHANT ID:", merchant.id)
    print("STATE CREATED: True")

    return Response(
        {
            "success": True,
            "login_url": login_url
        }
    )
# @api_view(["GET"])
# def instagram_callback(request):
#     # ==========================================
#     # 1️⃣ الحصول على Authorization Code
#     # ==========================================
#     # Instagram يرسله لنا بعد أن يضغط المستخدم "السماح"
#     code = request.GET.get("code")

#     if not code:
#         return Response(
#             {
#                 "success": False,
#                 "error": "Instagram authorization code is missing"
#             },
#             status=400
#         )

#     # ==========================================
#     # 2️⃣ Instagram App ID
#     # ==========================================
#     # Instagram App ID الموجود في Meta App Dashboard
#     client_id = os.getenv("INSTAGRAM_CLIENT_ID")

#     # ==========================================
#     # 3️⃣ Instagram App Secret
#     # ==========================================
#     # Instagram App Secret الموجود في Meta App Dashboard
#     # ⚠️ لا تضعيه في React أو GitHub
#     client_secret = os.getenv("INSTAGRAM_CLIENT_SECRET")

#     # ==========================================
#     # 4️⃣ Grant Type - Step 2
#     # ==========================================
#     # ثابت حسب وثائق Instagram Business Login
#     grant_type = "authorization_code"

#     # ==========================================
#     # 5️⃣ Redirect URI
#     # ==========================================
#     # يجب أن يطابق Redirect URI الموجود في Meta
#     redirect_uri = (
#         "https://nadorex.onrender.com/api/instagram/callback/"
#     )

#     try:

#         # ==========================================
#         # STEP 2️⃣
#         # Exchange Authorization Code
#         # للحصول على Short-Lived Access Token
#         # ==========================================

#         response = requests.post(
#             "https://api.instagram.com/oauth/access_token",
#             data={
#                 # Instagram App ID
#                 "client_id": client_id,

#                 # Instagram App Secret
#                 "client_secret": client_secret,

#                 # ثابت
#                 "grant_type": grant_type,

#                 # Redirect URI
#                 "redirect_uri": redirect_uri,

#                 # Authorization Code
#                 "code": code,
#             },
#             timeout=15
#         )

#         print("===== INSTAGRAM STEP 2 =====")
#         print("STATUS:", response.status_code)
#         print("RESPONSE:", response.text)

#         if response.status_code != 200:
#             return Response(
#                 {
#                     "success": False,
#                     "error": "Failed to exchange Instagram code",
#                     "instagram_response": response.text,
#                 },
#                 status=400
#             )

#         token_data = response.json()

#         # ==========================================
#         # Short-Lived Access Token
#         # ==========================================

#         short_lived_token = token_data.get("access_token")

#         # Instagram User ID
#         instagram_user_id = token_data.get("user_id")

#         if not short_lived_token:
#             return Response(
#                 {
#                     "success": False,
#                     "error": "Instagram access token was not returned",
#                 },
#                 status=400
#             )

#         print("✅ SHORT-LIVED TOKEN RECEIVED")
#         print("INSTAGRAM USER ID:", instagram_user_id)

#         # ==========================================
#         # STEP 3️⃣
#         # Exchange Short-Lived Token
#         # للحصول على Long-Lived Access Token
#         # ==========================================

#         long_lived_response = requests.get(
#             "https://graph.instagram.com/access_token",
#             params={
#                 # ثابت حسب وثائق Meta
#                 "grant_type": "ig_exchange_token",

#                 # Instagram App Secret
#                 "client_secret": client_secret,

#                 # Short-Lived Access Token
#                 "access_token": short_lived_token,
#             },
#             timeout=15
#         )

#         print("===== INSTAGRAM STEP 3 =====")
#         print("STATUS:", long_lived_response.status_code)

#         # ⚠️ لا نطبع response.text هنا
#         # لأنه قد يحتوي على Access Token

#         if long_lived_response.status_code != 200:
#             print(
#                 "STEP 3 ERROR:",
#                 long_lived_response.text
#             )

#             return Response(
#                 {
#                     "success": False,
#                     "error": "Failed to get long-lived Instagram access token",
#                 },
#                 status=400
#             )

#         long_lived_data = long_lived_response.json()

#         # ==========================================
#         # Long-Lived Access Token
#         # ==========================================

#         long_lived_token = long_lived_data.get("access_token")

#         # مدة صلاحية الـToken بالثواني
#         expires_in = long_lived_data.get("expires_in")

#         if not long_lived_token:
#             return Response(
#                 {
#                     "success": False,
#                     "error": "Long-lived Instagram access token was not returned",
#                 },
#                 status=400
#             )

#         print("✅ LONG-LIVED TOKEN RECEIVED")
#         print("EXPIRES IN:", expires_in)

#         # ==========================================
#         # 8️⃣ نتيجة الاختبار
#         # ==========================================

#         return Response({
#             "success": True,
#             "message": "Instagram authentication completed successfully",

#             # لا نعرض الـToken نفسه
#             "access_token_received": True,

#             # Instagram User ID
#             "instagram_user_id": instagram_user_id,

#             # مدة صلاحية الـLong-Lived Token
#             "expires_in": expires_in,
#         })

#     except Exception as e:

#         print("🔥 INSTAGRAM TOKEN ERROR:", str(e))

#         return Response(
#             {
#                 "success": False,
#                 "error": "Instagram token exchange failed",
#                 "debug": str(e),
#             },
#             status=500
#         )
# @api_view(["GET"])
# def instagram_callback(request):

#     # ==========================================
#     # 1️⃣ الحصول على Authorization Code
#     # ==========================================
#     # Instagram يرسله لنا بعد موافقة المستخدم
#     code = request.GET.get("code")

#     if not code:
#         return Response(
#             {
#                 "success": False,
#                 "error": "Instagram authorization code is missing"
#             },
#             status=400
#         )

#     # ==========================================
#     # 2️⃣ الحصول على State
#     # ==========================================
#     # الـstate أنشأناه في instagram_login
#     # وهو مربوط بـ merchant.id داخل session
#     state = request.GET.get("state")

#     if not state:
#         return Response(
#             {
#                 "success": False,
#                 "error": "Instagram state is missing"
#             },
#             status=400
#         )

#     # ==========================================
#     # 3️⃣ التحقق من State ومعرفة التاجر
#     # ==========================================
#     print("===== INSTAGRAM CALLBACK STATE =====")
#     print("STATE:", state)
#     print("SESSION KEY:", f"instagram_state_{state}")
#     print("MERCHANT ID FROM SESSION:", request.session.get(f"instagram_state_{state}"))
#     merchant_id = request.session.get(
#         f"instagram_state_{state}"
#     )

#     if not merchant_id:
#         return Response(
#             {
#                 "success": False,
#                 "error": "Invalid or expired Instagram state"
#             },
#             status=400
#         )

#     try:
#         merchant = Merchants.objects.get(
#             id=merchant_id
#         )

#     except Merchants.DoesNotExist:
#         return Response(
#             {
#                 "success": False,
#                 "error": "Merchant not found"
#             },
#             status=404
#         )

#     # ==========================================
#     # 4️⃣ Instagram App ID
#     # ==========================================
#     client_id = os.getenv(
#         "INSTAGRAM_CLIENT_ID"
#     )

#     # ==========================================
#     # 5️⃣ Instagram App Secret
#     # ==========================================
#     # ⚠️ يبقى في Environment Variables
#     # ولا يظهر في React أو GitHub
#     client_secret = os.getenv(
#         "INSTAGRAM_CLIENT_SECRET"
#     )

#     if not client_id or not client_secret:
#         return Response(
#             {
#                 "success": False,
#                 "error": "Instagram credentials are not configured"
#             },
#             status=500
#         )

#     # ==========================================
#     # 6️⃣ Redirect URI
#     # ==========================================
#     # يجب أن يطابق الموجود في Meta تمامًا
#     redirect_uri = (
#         "https://nadorex.onrender.com/api/instagram/callback/"
#     )

#     try:

#         # ==========================================
#         # STEP 2️⃣
#         # Exchange Authorization Code
#         # للحصول على Short-Lived Access Token
#         # ==========================================

#         response = requests.post(
#             "https://api.instagram.com/oauth/access_token",
#             data={

#                 # Instagram App ID
#                 "client_id": client_id,

#                 # Instagram App Secret
#                 "client_secret": client_secret,

#                 # ثابت
#                 "grant_type": "authorization_code",

#                 # Redirect URI
#                 "redirect_uri": redirect_uri,

#                 # Authorization Code
#                 "code": code,
#             },
#             timeout=15
#         )

#         print(
#             "===== INSTAGRAM STEP 2 ====="
#         )

#         print(
#             "STATUS:",
#             response.status_code
#         )

#         if response.status_code != 200:

#             print(
#                 "STEP 2 ERROR:",
#                 response.text
#             )

#             return Response(
#                 {
#                     "success": False,
#                     "error": "Failed to exchange Instagram code"
#                 },
#                 status=400
#             )

#         token_data = response.json()

#         # ==========================================
#         # Short-Lived Access Token
#         # ==========================================

#         short_lived_token = token_data.get(
#             "access_token"
#         )

#         # Instagram User ID
#         instagram_user_id = token_data.get(
#             "user_id"
#         )

#         if not short_lived_token:

#             return Response(
#                 {
#                     "success": False,
#                     "error": "Instagram access token was not returned"
#                 },
#                 status=400
#             )

#         print(
#             "✅ SHORT-LIVED TOKEN RECEIVED"
#         )

#         print(
#             "INSTAGRAM USER ID:",
#             instagram_user_id
#         )

#         # ==========================================
#         # STEP 3️⃣
#         # الحصول على Long-Lived Access Token
#         # ==========================================

#         long_lived_response = requests.get(
#             "https://graph.instagram.com/access_token",
#             params={

#                 # ثابت حسب وثائق Meta
#                 "grant_type":
#                     "ig_exchange_token",

#                 # Instagram App Secret
#                 "client_secret":
#                     client_secret,

#                 # Short-Lived Access Token
#                 "access_token":
#                     short_lived_token,
#             },
#             timeout=15
#         )

#         print(
#             "===== INSTAGRAM STEP 3 ====="
#         )

#         print(
#             "STATUS:",
#             long_lived_response.status_code
#         )

#         if long_lived_response.status_code != 200:

#             print(
#                 "STEP 3 ERROR:",
#                 long_lived_response.text
#             )

#             return Response(
#                 {
#                     "success": False,
#                     "error":
#                         "Failed to get long-lived Instagram access token"
#                 },
#                 status=400
#             )

#         long_lived_data = (
#             long_lived_response.json()
#         )

#         # ==========================================
#         # Long-Lived Access Token
#         # ==========================================

#         long_lived_token = (
#             long_lived_data.get(
#                 "access_token"
#             )
#         )

#         # مدة صلاحية الـToken بالثواني
#         expires_in = (
#             long_lived_data.get(
#                 "expires_in"
#             )
#         )

#         if not long_lived_token:

#             return Response(
#                 {
#                     "success": False,
#                     "error":
#                         "Long-lived Instagram access token was not returned"
#                 },
#                 status=400
#             )

#         print(
#             "✅ LONG-LIVED TOKEN RECEIVED"
#         )

#         print(
#             "EXPIRES IN:",
#             expires_in
#         )

#         # ==========================================
#         # 7️⃣ حفظ بيانات Instagram للتاجر
#         # ==========================================

#         merchant.instagram_access_token = (
#             long_lived_token
#         )

#         merchant.instagram_user_id = (
#             instagram_user_id
#         )

#         # ==========================================
#         # 8️⃣ حساب وقت انتهاء الـToken
#         # ==========================================

#         if expires_in:

#             merchant.instagram_token_expires_at = (
#                 timezone.now()
#                 + timedelta(
#                     seconds=int(expires_in)
#                 )
#             )

#         # ==========================================
#         # 9️⃣ حفظ التعديلات
#         # ==========================================

#         merchant.save(
#             update_fields=[
#                 "instagram_access_token",
#                 "instagram_user_id",
#                 "instagram_token_expires_at",
#             ]
#         )

#         # ==========================================
#         # 🔟 حذف State بعد نجاح العملية
#         # ==========================================

#         del request.session[
#             f"instagram_state_{state}"
#         ]

#         request.session.modified = True

#         # ==========================================
#         # 1️⃣1️⃣ النتيجة
#         # ==========================================

#         return Response(
#             {
#                 "success": True,
#                 "message":
#                     "Instagram connected successfully",

#                 "instagram_connected": True,

#                 "instagram_user_id":
#                     instagram_user_id,

#                 "access_token_saved": True,

#                 "token_expires_at":
#                     merchant.instagram_token_expires_at,
#             }
#         )

#     except Exception as e:

#         print(
#             "🔥 INSTAGRAM CALLBACK ERROR:",
#             str(e)
#         )

#         return Response(
#             {
#                 "success": False,
#                 "error":
#                     "Instagram authentication failed",
#                 "debug": str(e),
#             },
#             status=500
#         )
@api_view(["GET"])
def instagram_callback(request):

    # ==========================================
    # 1️⃣ Authorization Code
    # ==========================================

    code = request.GET.get("code")

    if not code:
        return Response(
            {
                "success": False,
                "error":
                    "Instagram authorization code is missing"
            },
            status=400
        )

    # ==========================================
    # 2️⃣ State
    # ==========================================

    state = request.GET.get("state")

    if not state:
        return Response(
            {
                "success": False,
                "error":
                    "Instagram state is missing"
            },
            status=400
        )

    # ==========================================
    # 3️⃣ التحقق من State
    # ==========================================

    signer = TimestampSigner()

    try:

        merchant_id = signer.unsign(
            state,
            max_age=600
        )

    except SignatureExpired:

        return Response(
            {
                "success": False,
                "error":
                    "Instagram state expired"
            },
            status=400
        )

    except BadSignature:

        return Response(
            {
                "success": False,
                "error":
                    "Invalid Instagram state"
            },
            status=400
        )

    # ==========================================
    # 4️⃣ الحصول على Merchant
    # ==========================================

    try:

        merchant = Merchants.objects.get(
            id=int(merchant_id)
        )

    except Merchants.DoesNotExist:

        return Response(
            {
                "success": False,
                "error":
                    "Merchant not found"
            },
            status=404
        )

    print("===== INSTAGRAM CALLBACK =====")
    print("MERCHANT ID:", merchant.id)
    print("STATE VERIFIED: True")

    # ==========================================
    # 5️⃣ Instagram credentials
    # ==========================================

    client_id = os.getenv(
        "INSTAGRAM_CLIENT_ID"
    )

    client_secret = os.getenv(
        "INSTAGRAM_CLIENT_SECRET"
    )

    if not client_id or not client_secret:

        return Response(
            {
                "success": False,
                "error":
                    "Instagram credentials are not configured"
            },
            status=500
        )

    # ==========================================
    # 6️⃣ Redirect URI
    # ==========================================

    redirect_uri = (
        "https://nadorex.onrender.com/"
        "api/instagram/callback/"
    )

    try:

        # ==========================================
        # STEP 2️⃣
        # Code → Short-lived Access Token
        # ==========================================

        response = requests.post(
            "https://api.instagram.com/oauth/access_token",

            data={

                "client_id":
                    client_id,

                "client_secret":
                    client_secret,

                "grant_type":
                    "authorization_code",

                "redirect_uri":
                    redirect_uri,

                "code":
                    code,
            },

            timeout=15
        )

        print("===== INSTAGRAM STEP 2 =====")
        print(
            "STATUS:",
            response.status_code
        )

        if response.status_code != 200:

            print(
                "STEP 2 ERROR:",
                response.text
            )

            return Response(
                {
                    "success": False,
                    "error":
                        "Failed to exchange Instagram code"
                },
                status=400
            )

        token_data = response.json()

        short_lived_token = (
            token_data.get(
                "access_token"
            )
        )

        instagram_user_id = (
            token_data.get(
                "user_id"
            )
        )

        if not short_lived_token:

            return Response(
                {
                    "success": False,
                    "error":
                        "Instagram access token was not returned"
                },
                status=400
            )

        print(
            "SHORT-LIVED TOKEN RECEIVED: True"
        )

        print(
            "INSTAGRAM USER ID:",
            instagram_user_id
        )

        # ==========================================
        # STEP 3️⃣
        # Short-lived → Long-lived Token
        # ==========================================

        long_lived_response = requests.get(
            "https://graph.instagram.com/access_token",

            params={

                "grant_type":
                    "ig_exchange_token",

                "client_secret":
                    client_secret,

                "access_token":
                    short_lived_token,
            },

            timeout=15
        )

        print("===== INSTAGRAM STEP 3 =====")
        print(
            "STATUS:",
            long_lived_response.status_code
        )

        if long_lived_response.status_code != 200:

            print(
                "STEP 3 ERROR:",
                long_lived_response.text
            )

            return Response(
                {
                    "success": False,
                    "error":
                        "Failed to get long-lived Instagram access token"
                },
                status=400
            )

        long_lived_data = (
            long_lived_response.json()
        )

        long_lived_token = (
            long_lived_data.get(
                "access_token"
            )
        )

        expires_in = (
            long_lived_data.get(
                "expires_in"
            )
        )

        if not long_lived_token:

            return Response(
                {
                    "success": False,
                    "error":
                        "Long-lived Instagram access token was not returned"
                },
                status=400
            )

        print(
            "LONG-LIVED TOKEN RECEIVED: True"
        )

        print(
            "EXPIRES IN:",
            expires_in
        )

        # ==========================================
        # 7️⃣ حفظ بيانات Instagram
        # ==========================================

        merchant.instagram_access_token = (
            long_lived_token
        )

        merchant.instagram_user_id = (
            instagram_user_id
        )

        # ==========================================
        # 8️⃣ تاريخ انتهاء Token
        # ==========================================

        if expires_in:

            merchant.instagram_token_expires_at = (
                timezone.now()
                + timedelta(
                    seconds=int(expires_in)
                )
            )

        # ==========================================
        # 9️⃣ حفظ Merchant
        # ==========================================

        merchant.save(
            update_fields=[
                "instagram_access_token",
                "instagram_user_id",
                "instagram_token_expires_at",
            ]
        )

        print(
            "INSTAGRAM DATA SAVED: True"
        )

        # ==========================================
        # 🔟 النتيجة
        # ==========================================

        return Response(
            {
                "success": True,

                "message":
                    "Instagram connected successfully",

                "instagram_connected":
                    True,

                "instagram_user_id":
                    instagram_user_id,

                "access_token_saved":
                    True,

                "token_expires_at":
                    merchant.instagram_token_expires_at,
            }
        )

    except Exception as e:

        print(
            "🔥 INSTAGRAM CALLBACK ERROR:",
            str(e)
        )

        return Response(
            {
                "success": False,

                "error":
                    "Instagram authentication failed",

                "debug":
                    str(e),
            },
            status=500
        )
@api_view(["POST"])
def instagram_deauthorize(request):
    return Response({
        "success": True,
        "message": "Instagram deauthorization received"
    })


@api_view(["POST"])
def instagram_data_deletion(request):
    return Response({
        "success": True,
        "message": "Instagram data deletion request received"
    })
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import uuid

from django.contrib.auth.models import User
from django.db import transaction
import uuid

from django.contrib.auth.models import User
from django.db import transaction
import uuid

from django.db import transaction
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import uuid

import uuid
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.db import transaction
# THe last
from django.utils import translation

from products.services.merchant.registration import register_merchant
from products.services.translations import merchant_register_translations

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import random
from products.services.merchant.verification.code import generate_verification_code

import uuid
import random
import smtplib
from email.mime.text import MIMEText
from django.shortcuts import render, redirect
from django.db import transaction
from django.contrib.auth.models import User
from .models import Merchants
from django.conf import settings
# from .translations import load_translations, t  # دوال الترجمات

from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from products.models import Merchants

from products.utils import t, load_translations

from django.shortcuts import render, redirect
from django.contrib.auth import login
from products.services.translations import merchant_login_translations


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .services.translations import merchant_login_translations
#from .services.auth import validate_merchant_login  # الدالة اللي تتحقق من البائع

from django.http import JsonResponse
from .services.translations import merchant_login_translations

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
import json

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

#from .services.auth import validate_merchant_login
from .services.translations import merchant_login_translations
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import traceback
import logging
logger = logging.getLogger(__name__)

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from products.services.translations import merchant_login_translations 

@csrf_exempt
def merchant_login_api(request):
    lang = request.GET.get("lang", "en")
    
    print("==== LOGIN API CALLED ====")

    if request.method != "POST":
        print("❌ Method not POST:", request.method)
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        # 1️⃣ طباعة البودي الخام
        print("RAW BODY:", request.body)

        # 2️⃣ تحويل JSON
        data = json.loads(request.body.decode("utf-8"))
        print("PARSED DATA:", data)

        email = data.get("email")
        password = data.get("password")

        print("EMAIL:", email)
        print("LANG:", lang)

        if not email or not password:
            print("❌ Missing email or password")
            return JsonResponse(
                {"success": False, "error": "Email and password required"},
                status=400
            )

        # 3️⃣ فحص دالة التحقق (تم تمرير المتغيرات مباشرة لحل مشكلة الـ TypeError نهائياً)
        #result = validate_merchant_login(email, password)
        # قم بتغيير هذا السطر في الـ view:
        result = validate_merchant_login(email=email, password=password)
        print("LOGIN RESULT:", result)

        if not result:
            print("❌ validate_merchant_login returned None")
            return JsonResponse(
                {"success": False, "error": "Login validation failed"},
                status=500
            )

        print("RESULT.SUCCESS:", getattr(result, "success", "NO ATTR"))
        print("RESULT.USER:", getattr(result, "user", "NO USER"))

        if not result.success:
            print("❌ Login failed:", result.error)
            return JsonResponse(
                {
                    "success": False,
                    "error": merchant_login_translations(result.error, lang)
                },
                status=401
            )

        # ✅ الآن سيتم الدخول وتفتح الواجهة ولكن مضافاً إليها التوكين الحقيقي!
        print("✅ LOGIN OK - GENERATING JWT TOKENS")
        
        user = result.user
        refresh = RefreshToken.for_user(user) # توليد التوكين للمستخدم

        # إرجاع رد النجاح مضافاً إليه التوكينات للـ React
        return JsonResponse(
            {
                "success": True,
                "message": "Login successful",
                "redirect_url": "/seller/login/add",
                "access": str(refresh.access_token),  # 🔑 التوكين الأساسي لـ React
                "refresh": str(refresh),               # 🔑 توكين التجديد
                "translations": get_translations("auth",lang)
            },
            status=200
        )

    except Exception as e:
        print("🔥 LOGIN EXCEPTION TYPE:", type(e))
        print("🔥 LOGIN EXCEPTION:", str(e))
        
        # في حال حدوث أي خطأ غير متوقع يرجع الفشل صراحةً
        return JsonResponse(
            {
                "success": False,
                "error": "Internal server error",
                "debug": str(e)
            },
            status=500
        )
from django.shortcuts import render
#from products.services.merchant.show_products import show_products_service
from products.services.translations import show_products 
#اللي شكلها للمشتري

# products/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# from core.utils.translations import load_translations, t
from .models import Categories, CategoryTranslations

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Categories, CategoryTranslations, Products
from django.core.files.storage import FileSystemStorage

# views.py

import uuid
from django.shortcuts import render, redirect
# from .utils import get_all_color_gradients
from .models import Categories, Products
from django.contrib import messages

commission_rates = {"USD": 0.10, "EUR": 0.12, "TRY": 0.15}
currency_symbols = {"USD": "$", "EUR": "€", "TRY": "₺"}

from django.shortcuts import render, redirect
from django.contrib import messages
from django.db import transaction
from .models import Products
from .utils import get_available_colors, get_available_sizes, calculate_commission

# views.py
from django.shortcuts import render, redirect
from .models import Products, CategoryTranslations
from .utils import get_available_sizes, get_available_colors, calculate_commission
import uuid, os


from django.conf import settings

from django.shortcuts import render, redirect, get_object_or_404

from django.shortcuts import render, redirect
from .models import Products, Categories
from .utils import get_available_sizes, get_available_colors, calculate_commission, load_translations

from django.shortcuts import render, redirect
from .models import Products,ProductImages, Categories
from .utils import get_available_sizes, get_available_colors, calculate_commission, load_translations

from django.shortcuts import render, redirect
from .models import Products,ProductImages
from django.utils import timezone

from django.shortcuts import render, redirect
from products.services.product.add_product import create_product
from products.models import Products, Categories
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from products.services.product.add_product import create_product
# @api_view(["GET"])
# def categories_api(request):
#     lang = request.GET.get("lang", "en")

#     categories = Categories.objects.all()
#     translations = CategoryTranslations.objects.filter(language=lang)

#     translation_map = {
#         t.category_code: t.translation for t in translations
#     }

#     data = [
#         {
#             "code": c.code,
#             "name": translation_map.get(c.code, c.code)
#         }
#         for c in categories
#     ]

#     return Response({
#         "success": True,
#         "categories": data
#     })

from django.http import JsonResponse
from django.views.decorators.http import require_POST


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def get_products_api(request):
    products = Products.objects.all().order_by("-id")

    data = []

    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "stock": p.stock,
            "image": request.build_absolute_uri(p.base_image.url) if p.base_image else None,
        })

    return Response({"products": data})

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Products
from products.serializers.product_serializer import ProductDetailSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def product_detail_api(request, product_id):
    try:
        print("PRODUCT ID:", product_id)
        print("USER:", request.user)
        print(request.user)
        print(request.user.merchant)
        '''
        product = (
            Products.objects
            .select_related()
            .prefetch_related("variants", "productimages_set")
            .get(id=product_id, merchant=request.user)
        )
        '''
        lang = request.GET.get(
            "lang",
            "en"
        )
        merchant = request.user.merchant

        product = (
            Products.objects
            .select_related()
            .prefetch_related("variants", "images")
            .get(id=product_id, merchant=merchant)
        )
        serializer = ProductDetailSerializer(
            product,
            context={
                "lang":lang
            })
        
        #print(Products.objects.filter(id=product_id).exists())
        print("product found",serializer.data)
        return JsonResponse({
            "success": True,
            "product": serializer.data
        })

    except Products.DoesNotExist:
        return JsonResponse({
            "success": False,
            "error": "المنتج غير موجود أو ليس لديك صلاحية"
        }, status=404)

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=400)

import re
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product_api(request):
    lang = request.GET.get ("lang", "en")
    try:
        # 1. تحويل البيانات النصية إلى ديكشنري قابل للتعديل
        product_data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        
        # 2. تجميع الـ Variants ديناميكيًا من الـ FormData
        variants_dict = {}
        for key, value in request.data.items():
            match = re.match(r'variants\[(\d+)\]\[(\w+)\]', key)
            if match:
                index = int(match.group(1))
                field_name = match.group(2)
                if index not in variants_dict:
                    variants_dict[index] = {}
                variants_dict[index][field_name] = value

        # فحص ملفات الصور الخاصة بالـ Variants (الصورة الأساسية للـ Variant)
        for key, file_obj in request.FILES.items():
            match = re.match(r'variants\[(\d+)\]\[image\]', key)
            if match:
                index = int(match.group(1))
                if index not in variants_dict:
                    variants_dict[index] = {}
                variants_dict[index]['image'] = file_obj

        # 3. تجميع الصور الإضافية للمنتج (Product Gallery Images)
        product_extra_images = []
        for key, file_obj in request.FILES.items():
            if key.startswith('product_images'):
                product_extra_images.append(file_obj)
        product_data['extra_images'] = product_extra_images
        '''
        # 4. تجميع الصور الإضافية لكل Variant (ProductVariantImages)
        for key, file_obj in request.FILES.items():
            match = re.match(r'variants\[(\d+)\]\[extra_images\]', key)
            if match:
                index = int(match.group(1))
                if index in variants_dict:
                    if 'extra_images' not in variants_dict[index]:
                        variants_dict[index]['extra_images'] = []
                    variants_dict[index]['extra_images'].append(file_obj)
        '''
        # 4. تجميع الصور الإضافية لكل Variant (ProductVariantImages)
        for key in request.FILES.keys():
            match = re.match(r'variants\[(\d+)\]\[extra_images\]', key)
            if match:
                index = int(match.group(1))

                if index not in variants_dict:
                    variants_dict[index] = {}

                variants_dict[index]["extra_images"] = request.FILES.getlist(key)
        # ترتيب الـ Variants حسب الـ Index
        sorted_indices = sorted(variants_dict.keys())
        variants_list = [variants_dict[i] for i in sorted_indices]
        product_data['variants'] = variants_list
        merchant = Merchants.objects.get(user=request.user)
        # 5. استدعاء دالة الإنشاء
        product = create_product(
            merchant=merchant,
            data=product_data,
            files=request.FILES
        )

        return JsonResponse({
            "success": True,
            "product_id": product.id,
            "translations": get_translations(["products","common"], lang)
            
        })

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JsonResponse({"success": False, "error": str(e)}, status=400)



from django.shortcuts import render, get_object_or_404
from .models import Products


########################333333333333333
# def register_test(request):
#    return render(request, "products/register.html")


def merchant_iyzico(request):
    lang = request.session.get("lang", "ar")
    translations_file = load_translations()

    translations = {
        "iyzico_title": t("iyzico_title", lang, translations_file),
        "submit_button": t("submit_button", lang, translations_file),

        "subMerchantType_label": t("subMerchantType_label", lang, translations_file),
        "name_label": t("name_label", lang, translations_file),
        "email_label": t("email_label", lang, translations_file),
        "gsmNumber_label": t("gsmNumber_label", lang, translations_file),
        "iban_label": t("iban_label", lang, translations_file),
        "taxNumber_label": t("taxNumber_label", lang, translations_file),
        "identityNumber_label": t("identityNumber_label", lang, translations_file),
        "identityType_label": t("identityType_label", lang, translations_file),
        "address_label": t("address_label", lang, translations_file),
        "city_label": t("city_label", lang, translations_file),
        "country_label": t("country_label", lang, translations_file),
        "zipCode_label": t("zipCode_label", lang, translations_file),
    }

    if request.method == "POST":
        form = IyzicoForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            email = data["email"]

            result = register_merchant_in_iyzico(data)

            if result["success"]:
                merchant = Merchants.objects.get(email=email)
                merchant.iyzico_merchant_key = result["merchant_key"]
                merchant.iyzico_sub_key = result["sub_merchant_key"]
                merchant.save()

                return render(request, "products/iyzico_success.html", translations)

            return render(request, "products/iyzico.html", {
                "form": form,
                "error": result["error"],
                **translations
            })

    else:
        form = IyzicoForm()

    return render(request, "products/iyzico.html", {
        "form": form,
        **translations
    })

#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


def stores_and_products_view(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()
    session_id = get_or_create_session_id(request)
    cart_count = CartItems.objects.filter(session_id=session_id).values('product__id').distinct().count()

    stores = Merchants.objects.all().order_by('name')
    logger.debug("عدد المتاجر: %s", stores.count())

    selected_merchant = None
    products = Products.objects.none()
    selected_email = request.GET.get('store_email')
    logger.debug("store_email من GET: %r", selected_email)

    if selected_email:
        selected_email_clean = selected_email.strip()
        try:
            selected_merchant = Merchants.objects.get(email__iexact=selected_email_clean)
            logger.debug("تم العثور على المتجر: %s (id=%s)", selected_merchant.name, selected_merchant.id)
        except Merchants.DoesNotExist:
            logger.error("لا يوجد متجر يطابق البريد الإلكتروني المعطى: %s", selected_email_clean)
            selected_merchant = None

        if selected_merchant:
            # استخدام FK المعلوم اسمه 'merchant'
            try:
                products_qs = Products.objects.filter(merchant=selected_merchant)
                logger.debug("Products.objects.filter(merchant=...) -> count=%s", products_qs.count())
            except Exception as e:
                logger.exception("خطأ عند الفلترة باستخدام FK 'merchant': %s", e)
                products_qs = Products.objects.none()

            products = products_qs.order_by('-id') if hasattr(products_qs, 'order_by') else products_qs
            logger.debug("بعد الترتيب — عدد المنتجات: %s", getattr(products, 'count', lambda: len(products))())

    # تشخيص سريع
    try:
        store_emails = list(stores.values_list('email', flat=True)[:50])
        logger.debug("بعض ايميلات المتاجر: %s", store_emails[:10])
    except Exception as e:
        logger.exception("خطأ أثناء جلب ايميلات المتاجر: %s", e)
    from django.conf import settings
    context = {
        'stores': stores,
        'MEDIA_URL':settings.MEDIA_URL,
        'selected_merchant': selected_merchant,
        'products': products,
        'lang': lang,
        'cart_count': cart_count,
        'translations': translations,
        't': lambda key, fallback = None: t(key, lang, translations, fallback),
        'add_to_cart_text': t('add_to_cart', lang, translations),
        '_debug_selected_email': selected_email,
        '_debug_products_count': getattr(products, 'count', lambda: len(products))(),
       
    }
    return render(request, 'products/stores_and_products.html', context)
 

# تأكد من وجود كل هذه الاستيرادات في أعلى الملف
import logging
from django.shortcuts import render
from django.conf import settings
from products.models import Merchants, Products, CartItems
from .utils import load_translations, t, get_or_create_session_id

logger = logging.getLogger(__name__)

# في ملف products/views.py

# تأكد من وجود كل هذه الاستيرادات في أعلى الملف

from django.db.models.fields.files import FieldFile

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from products.services.translations import store_page_translations


@csrf_exempt
def store_page_api(request):
    lang = request.GET.get("lang", "en")

    return JsonResponse({
        "success": True,
        "texts": store_page_translations(lang),
        **get_store_data(request=request),
    })


# الاحتياط

def set_language(request, lang):
    request.session['lang'] = lang
    next_page = request.GET.get('next', '/')
    return redirect(next_page)


from django.http import JsonResponse

from django.http import JsonResponse
from products.services.buyer.buyer_product import get_products,\
    FavoriteServiceKeeper

def buyer_products_api(request):
    #raise Exception("I AM HERE")
    print("BUYER API CALLED")
    lang = request.GET.get("lang", "en")
    '''
    data = get_products(
        request=request,
        lang=lang,
        cart_count=0
    )
    '''
    data = get_products(request)
    data["translations"]=get_translations(["products","cart","common","search"] ,lang)
    return JsonResponse(data, json_dumps_params={"ensure_ascii": False})
from django.shortcuts import render
from .models import CartItems, Products, Merchants 
from django.db.models import Sum


def get_all_stores():
    stores = Merchants.objects.all().order_by('name')
    return stores


def get_products_by_store(email):
    try:
        merchant = Merchants.objects.get(email=email)
    except Merchants.DoesNotExist:
        return []  # إذا لم يوجد متجر بالإيميل

    products = Products.objects.filter(merchant=merchant).order_by('-created_at')
    # إذا تريدين طباعتها
    print(f"Products for {email}: {list(products.values())}")
    return products


def stores_view(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()

    session_id = get_or_create_session_id(request)
    cart_count = CartItems.objects.filter(session_id=session_id).values('product__id').distinct().count()

    stores = Merchants.objects.all().order_by('name')

    context = {
        'stores': stores,
        'lang': lang,
        'cart_count': cart_count,
        'translations': translations,
        't': lambda key, fallback = None: t(key, lang, translations, fallback),
    }
    return render(request, 'products/stores.html', context)

from django.shortcuts import render, get_object_or_404

# تأكد من استيراد النماذج والدوال المساعدة
from .models import Merchants, Products, CartItems
# from .utils import load_translations, get_or_create_session_id, t

import logging

logger = logging.getLogger(__name__)

from django.shortcuts import render
from django.http import HttpResponse
# عدّلي أسماء الموديلات حسب مشروعك:
from .models import Merchants, Products  # <-- تأكدي أن اسم الموديل هنا صحيح (Products أو Product)

# الاحتياط

from django.shortcuts import render, redirect, get_object_or_404
from .models import CartItems, Orders, Products
from django.db.models import Sum
from .utils import t, load_translations

def buyer_cart_page(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()
    t_func = lambda key, fallback = None: t(key, lang, translations, fallback)

    # هذا السطر فقط لغرض التجربة
    print("All translation keys for English:", list(translations['en'].keys()))
    session_id = get_or_create_session_id(request)
    # session_id = request.session.session_key
    if not session_id:
        request.session.save()
        session_id = request.session.session_key
    from .models import CartItems
    print("--- DIAGNOSIS START ---")
    print("All fields in CartItems model:", [field.name for field in CartItems._meta.get_fields()])
    print("--- DIAGNOSIS END ---")
    # --- انتهت الإضافة ---

    cart_items = CartItems.objects.filter(session_id=session_id).select_related('product')
    confirmed_orders = Orders.objects.filter(session_id=session_id)
    
    total_quantity = cart_items.aggregate(total=Sum('quantity'))['total'] or 0
    
    for item in cart_items:
        item.total_price = item.product.price * item.quantity

    total_price = sum(item.total_price for item in cart_items)

    context = {
        'cart_items': cart_items,
        'total_quantity': total_quantity,
        'total_price': total_price,
        'translations': {
            'cart_items': t_func('cart_items'),
            'no_image': t_func('no_image', 'لا توجد صورة'),
            'delete': t_func('delete', 'حذف'),
            'edit': t_func('edit', 'تعديل'),
            'confirm_order': t_func('confirm_order', 'تأكيد الطلب'),
            'cart_empty': t_func('cart_empty', 'السلة فارغة'),
            'back_to_shopping': t_func('back_to_shopping', 'العودة للتسوق'),
            'confirm_delete_item': t_func('confirm_delete_item', 'هل أنت متأكد من حذف هذا المنتج من السلة؟'),
            'product_image': t_func('product_image', 'صورة المنتج'),
            'product_name': t_func('product_name', 'اسم المنتج'),
            'price': t_func('price', 'السعر'),
            'quantity': t_func('quantity', 'الكمية'),
            'total': t_func('total', 'الإجمالي'),
            'action': t_func('action', 'الإجراء'),
        },
        'lang': lang,
    }

    # ما في داعي تجربي cart_items[0] لأنه ممكن يسبب خطأ لو السلة فاضية
    # print(type(cart_items[0]))
    # print(dir(cart_items[0]))
    print(str(cart_items.query))
    return render(request, 'products/view_cart.html', context)


def delete_cart_item_view(request, item_id):
    session_id = request.session.session_key
    item = get_object_or_404(CartItems, id=item_id, session_id=session_id)
    item.delete()
    return redirect('view_cart')


def edit_cart_item_view(request, item_id):
    session_id = request.session.session_key
    item = get_object_or_404(CartItems, id=item_id, session_id=session_id)

    if request.method == 'POST':
        new_qty = int(request.POST.get('quantity', 1))
        if new_qty > 0:
            item.quantity = new_qty
            item.save()
        return redirect('view_cart')

    return render(request, 'products/edit_cart_item.html', {'item': item})

# ordered_products_page
def ordered_products_page(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()
    t_func = lambda key, fallback = None: t(key, lang, translations, fallback)
    session_id = get_or_create_session_id(request)

    confirmed_orders = Orders.objects.filter(session_id=session_id).select_related('product')

    context = {
        'confirmed_orders': confirmed_orders,
        'translations': {
            'product_name': t_func('product_name', 'اسم المنتج'),
            'product_image': t_func('product_image', 'صورة المنتج'),
            'product_price': t_func('price', 'السعر'),
            'product_quantity': t_func('quantity', 'الكمية'),
            'color': t_func('color', 'اللون'),
            'size': t_func('size', 'المقاس'),
            'book_language': t_func('book_language', 'لغة الكتاب'),
            'no_image': t_func('no_image', 'لا توجد صورة'),
            'confirmed_orders': t_func('confirmed_orders', 'الطلبات المؤكدة')
        },
        'lang': lang
    }

    return render(request, 'products/confirmed_orders.html', context)

from django.shortcuts import render
from django.utils import timezone
def confirm_order_view(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()
    sid = get_or_create_session_id(request)

    # جلب عناصر السلة
    cart_items = CartItems.objects.filter(session_id=sid).select_related('product')
    products_in_cart = []
    book_languages_set = set()

    for item in cart_items:
        product = item.product
        product.quantity = item.quantity
        product.colors = [c.strip() for c in (product.colors or "").split(",") if c.strip()]
        product.sizes = [s.strip() for s in (product.sizes or "").split(",") if s.strip()]
        
        if product.category_code == "books_education" and product.book_language:
            for lang_code in product.book_language.split(","):
                book_languages_set.add(lang_code.strip())
        
        products_in_cart.append(product)

    language_map = {"ar": "العربية", "en": "English", "tr": "Türkçe"}
    available_book_langs = [(code, language_map.get(code, code)) for code in sorted(book_languages_set)]

    # حساب الأعمدة
    show_color = any(p.colors for p in products_in_cart)
    show_size = any(p.sizes for p in products_in_cart)
    show_lang = any(p.category_code == "books_education" and p.book_language for p in products_in_cart)

    success_message = None

    if request.method == "POST":
        buyer_name = request.POST.get("name")
        buyer_phone = request.POST.get("phone")
        buyer_email = request.POST.get("email")
        # total_price= 0 
        for idx, product in enumerate(products_in_cart):
            
            product.total_price = product.price * product.quantity

            Orders.objects.create(
                
                product=product,
                session_id=sid,
                quantity=product.quantity,
                total_price=sum(product.total_price for product in products_in_cart),
                
                # total_price=total_price,
                chosen_color=request.POST.get(f"color_{idx}"),
                chosen_size=request.POST.get(f"size_{idx}"),
                book_language=request.POST.get(f"book_language_{idx}"),
                name=buyer_name,
                phone=buyer_phone,
                email=buyer_email,
                status="processing",
                order_date=timezone.now(),
            )

        CartItems.objects.filter(session_id=sid).delete()
        success_message = translations.get(lang, translations['ar']).get(
            "order_confirmed_successfully", "تم تأكيد الطلب بنجاح!"
        )

    return render(request, "products/confirm_order.html", {
        "cart_items": products_in_cart,
        "translations": translations.get(lang, translations['ar']),
        "available_book_langs": available_book_langs,
        "success_message": success_message,
        "lang": lang,
        "show_color": show_color,
        "show_size": show_size,
        "show_lang": show_lang,
    })   


from django.shortcuts import render
from .models import CartItems, Products
from django.shortcuts import render
from .models import CartItems, Products

from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages
from .models import CartItems
from .utils import load_translations, t  # حسب مكان ترجمتك


def remove_from_cart_view(request, item_id):
    lang = request.GET.get("lang", "ar")
    translations = load_translations()

    try:
        cart_item = get_object_or_404(CartItems, id=item_id)
        cart_item.delete()
        messages.success(request, t('deleted_from_cart', lang, translations))
    except Exception as e:
        messages.error(request, f"{t('error_removing_from_cart', lang, translations)}: {e}")
    
    return redirect('view_cart')  # تأكدي أن اسم صفحة عرض السلة هو view_cart

from django.http import JsonResponse
from products.services.translations import store_list_translations


def store_list_api(request):
    lang = request.GET.get("lang", "en")

    return JsonResponse({
        "stores": get_all_stores_service(),
        "texts": store_list_translations(lang),
    })

from .utils import get_product_by_id, get_currency_symbol
# قبل الدمج

from django.db.models import Q, Value, CharField
from django.db.models.functions import Coalesce
from django.db.models.expressions import RawSQL
from .models import Products, ProductTranslations, CategoryTranslations  # تأكد من استيراد النماذج الصحيحة

from django.db.models import (
    OuterRef, Subquery, F, Value, Q, CharField, IntegerField
)
from django.db.models.functions import Coalesce
from django.db.models.expressions import RawSQL
from django.db.models import Func
from products.models import Products, ProductTranslations, CategoryTranslations


class FindInSet(Func):
    function = 'FIND_IN_SET'
    output_field = IntegerField()

from django.db.models import (
    Q, F, Value, OuterRef, Subquery, CharField, TextField
)
from django.db.models.functions import Coalesce
from .models import Products, ProductTranslations, CategoryTranslations, CartItems

from django.shortcuts import render, redirect
from django.db import transaction
from django.db.models import (
    Q, F, Value, OuterRef, Subquery, CharField, TextField
)
from django.db.models.functions import Coalesce
from django.contrib import messages

from .models import (
    Products, ProductTranslations, CategoryTranslations,
    ProductRequests, RequestTranslations
)

# from .db_functions import FindInSet
from .utils import detect_language, translate_text_to_all, save_base64_image_to_field

# -------------------------------------------------------------------
# 🟡 View عرض نتائج البحث
# -------------------------------------------------------------------
def search_view(request):
    search_term = request.GET.get('q', '').strip()
    category = request.GET.get('category', 'all')
    lang = request.GET.get('lang', 'ar')
    
    results = list(search_products_multi_lang_orm(
    search_term=search_term,
    selected_category=category,
    lang=lang
    ))
    print("🧩 TYPE OF RESULTS:", type(results))
    print("🧩 VALUE OF RESULTS:", results)

    if not results and search_term:
        print("REDIRECTING TO:", redirect_url)  # للتأكد في التيرمنال

        # print("🔗 REDIRECTING TO:", redirect_url)  # 🔍 للتأكد في التيرمنال
        # messages.info(request, f"المنتج '{search_term}' غير متوفر حاليًا. يمكنك طلبه الآن.")
        messages.info(request, f"المنتج '{search_term}' غير متوفر حاليًا. يمكنك طلبه الآن.")
        # return redirect(f"/products/request-product/?desc={search_term}&lang={lang}")

        # return redirect(f"/products/request_form/?desc={search_term}&lang={lang}")
        from django.urls import reverse
        # return render(request, 'products/buyer.html', {'results': results})

        return redirect(reverse('products:request_product') + f'?desc={search_term}&lang={lang}')


# -------------------------------------------------------------------
# 🔵 View طلب منتج جديد (نموذج)
# -------------------------------------------------------------------
def request_product(request):
    initial_desc = request.GET.get('desc', '')
    lang = request.GET.get('lang', 'ar')

    if request.method == 'POST':
        form = ProductRequestForm(request.POST, request.FILES)
        if form.is_valid():
            desc = form.cleaned_data.get('desc', '').strip()
            email = form.cleaned_data['email']
            category = form.cleaned_data.get('category', '') or 'other'
            lang = form.cleaned_data.get('lang', '') or lang

            try:
                with transaction.atomic():
                    pr = ProductRequests.objects.create(
                        description=desc,
                        category=category,
                        buyer_email=email,
                        language=lang
                    )

                    # حفظ الصورة
                    image_file = form.cleaned_data.get('image')
                    if image_file:
                        pr.image.save(image_file.name, image_file)
                    else:
                        base64_img = form.cleaned_data.get('image_base64', '').strip()
                        if base64_img:
                            save_base64_image_to_field(base64_img, pr)

                    # حفظ الترجمات التلقائية
                    if desc:
                        detected = detect_language(desc, fallback=lang)
                        translations = translate_text_to_all(desc, source_lang=detected)
                        for code, translated_text in translations.items():
                            RequestTranslations.objects.create(
                                request=pr,
                                language_code=code,
                                translated_description=translated_text
                            )

                messages.success(request, "✅ تم إرسال طلب المنتج بنجاح.")
                return redirect('requests:list_requests')
            except Exception as e:
                messages.error(request, f"❌ خطأ أثناء حفظ الطلب: {e}")
        else:
            print(form.errors)
    else:
        form = ProductRequestForm(initial={'desc': initial_desc, 'lang': lang})

    # عرض الفئات المترجمة
    category_map = {ct.category_code: ct.translation for ct in CategoryTranslations.objects.all()}
    return render(request, 'products/request_form.html', {
        'form': form,
        'category_map': category_map
    })

   
def display_products(lang, translations, products, add_to_cart=None, highlight_product_id=None):
    if not products:
        from django.urls import reverse
        redirect(reverse('products:request_product'))

        print("DEBUG: No products to display (products is empty or None)")
        return []  # إرجاع قائمة فارغة لتجنب الخطأ
    #  ... 
    # لا حاجة لـ BASE_DIR هنا، سنزيله.
    
    result = []
    # ✅ ملاحظة: 'products' هنا هو QuerySet من القواميس
    for product in products:
        # ✅ التعديل: استخدام .get() بدلاً من .
        product_id = product.get('id')
        
        # ✅ التعديل: استخدام الأسماء التي تم عمل Annotate لها في دالة ORM
        # translated_name و translated_description
        name = product.get('translated_name', product.get('name'))
        description = product.get('translated_description', product.get('describtion'))
        
        price = product.get('total_price')  # ✅ تم تغيير 'price' إلى 'total_price' كما في دالة ORM
        old_price = product.get('old_price')
        currency = product.get('currency')
        image_path = product.get('image_path')
        colors = product.get('colors')
        sizes = product.get('sizes')
        category_code = product.get('category_code')
        
        # ✅ تم تغيير translated_category_name إلى category_name كما في دالة ORM
        category_name = product.get('category_name', category_code) 
        
        books_language = product.get('books_language')
        symbol = get_currency_symbol(currency)  # يجب أن تكون دالة get_currency_symbol متاحة

        # image_url = image_path if image_path else ""
        image_url = f"/static/{image_path}" if image_path else ""
        
        # التأكد من أن القيم ليست None قبل التقسيم
        colors_str = colors or ''
        colors = [c.strip() for c in colors_str.split(',') if c.strip()]

        sizes_str = sizes or ''
        sizes = [s.strip().upper() for s in sizes_str.split(',') if s.strip()]
        
        books_language_str = books_language or ''
        lang_map = {"ar": "العربية", "en": "English", "tr": "Türkçe"}
        books_languages = [lang_map.get(code.strip(), code.strip()) for code in books_language_str.split(',')] if books_language_str else []

        result.append({
            'id': product_id,
            'name': name,
            'description': description,
            'price': float(price),
            'old_price': float(old_price) if old_price else None,
            'symbol': symbol,
            'image_url': image_url,
            'category_code': category_code,
            'colors': colors,
            'sizes': sizes,
            'books_languages': books_languages,
            'highlight': product_id == highlight_product_id
        })

    return result


from products.utils import load_category_translations, t
#****************

def show_products_for_buyer(request, lang, translations):
    from urllib.parse import urlparse, parse_qs

    category_translations = load_category_translations(lang)
    translated_all = t('all', lang, translations)
    category_display_map = {'all': translated_all} if translated_all else {}
    category_display_map.update(category_translations)

    clothing_colors = [
        ('🟥', '#FF0000'), ('🟦', '#0000FF'), ('⬛', '#000000'),
        ('⬜', '#FFFFFF'), ('🟩', '#008000'), ('🟨', '#FFFF00'),
        ('🟪', '#800080'), ('🟫', '#8B4513'), ('رمادي', '#808080')
    ]
    clothing_sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    # قراءة الفلاتر من request.GET
    search_term = request.GET.get("search_term", "")
    selected_category_display = request.GET.get("main_category_filter", translated_all)
    sort_option = request.GET.get("sort_option", "")
    selected_book_lang = request.GET.get("book_language_filter", "")
    filter_color = request.GET.get("filter_color", "")
    filter_size = request.GET.get("filter_size", "")

    # تحويل التصنيف المعروض إلى الكود الحقيقي
    selected_category = 'all'
    for code, name in category_display_map.items():
        if name == selected_category_display:
            selected_category = code
            break

    # استخراج product_id من الرابط إن وجد
    product_id_str = request.GET.get('product_id')
    highlight_product_id = int(product_id_str) if product_id_str and product_id_str.isdigit() else None

    # جلب المنتجات
    # جلب المنتجات بأمان
    products = search_products_multi_lang_orm(
        search_term,
        selected_category,
        lang,
        sort_option,
        selected_book_lang if selected_category == "books_education" else '',
        filter_color if selected_category == "clothing" else '',
        filter_size if selected_category == "clothing" else ''
    ) or []  # ✅ لو رجع None 

    # تحويل المنتجات إلى شكل مناسب للـ template
    products_data = display_products(lang, translations, products, highlight_product_id=highlight_product_id)

    context = {
        'products': products_data,
        'lang': lang,
        'translations': translations,
        'category_options': list(category_display_map.values()),
        'selected_category_display': selected_category_display,
        'search_term': search_term,
        'sort_option': sort_option,
        'filter_color': filter_color,
        'filter_size': filter_size,
        'book_language_filter': selected_book_lang,
        'clothing_colors': clothing_colors,
        'clothing_sizes': clothing_sizes,
    }

    return context 


from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .models import CartItems, Products
from .utils import load_translations, t
from django.shortcuts import render, redirect, get_object_or_404
from .models import Products  # أو CartItem حسب استخدامك
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from products.services.buyer.cart import add_to_cart_service, get_confirmed_orders_service #checkout_cart_service
from products.services.translations import cart_translations

#from django.views.decorators.csrf import csrf_exempt

#@csrf_exempt
@require_POST
def add_to_cart_api(request):
    lang = data.get("lang", "ar")
    
    print("AAA");
    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON data"
        }, status=400)

    lang = data.get("lang", "ar")
    texts= get_translations("cart", lang)
    try:
        product_id = int(data.get("product_id"))
        quantity = int(data.get("quantity", 1))

        # ❌ لا session
        result = add_to_cart_service(
            product_id=product_id,
            quantity=quantity,
            lang=lang
        )

        return JsonResponse({
            "success": True,
            # "message": result["message"],
            "message": texts["product_not_found"],
            "product": result.get("product"),
            "quantity": quantity
        })

    except Exception as e:
        # texts = cart_translations(lang)

        return JsonResponse({
            "success": False,
            "message": f"{texts.get('error_adding_to_cart', 'Error')}: {str(e)}"
        }, status=400)


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from django.http import JsonResponse

def cart_api(request):

    data = get_cart_data(

        buyer=request.user

    )


    return JsonResponse(data)






def remove_cart_api(request, cart_id):

    result = remove_from_cart(

        buyer=request.user,

        cart_id=cart_id

    )


    return JsonResponse(result)




import json
from django.http import JsonResponse


def orders_api(request):

    data = get_confirmed_orders(

        buyer=request.user

    )


    return JsonResponse({

        "orders":data

    })
from django.core.signing import TimestampSigner
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.signing import (
    TimestampSigner,
    BadSignature,
    SignatureExpired,
)
# تأكدي من استيراد الموديل Orders إذا لم يكن مستورداً أعلى الملف

@require_POST
def cancel_order_api(request, order_id):
    try:
        # جلب رقم الهاتف من الـ Query parameters أو الـ Body لإثبات الهوية
        phone = request.GET.get('phone') or request.POST.get('phone')
        
        # إذا كان المشتري زائراً ومعه رقم هاتف
        if phone:
            order = Orders.objects.filter(id=order_id, phone=phone).first()
            if not order:
                return JsonResponse({"success": False, "message": "الطلب غير موجود أو لا يخص هذا الهاتف"})
            
            if order.status != "processing":
                return JsonResponse({"success": False, "message": "لا يمكن إلغاء الطلب إلا إذا كان قيد المعالجة"})
            
            order.status = "cancelled"
            order.save()
            return JsonResponse({"success": True, "message": "تم إلغاء الطلب بنجاح ✅"})
            
        # المسار الافتراضي القديم للمستخدمين المسجلين بالموقع
        result = cancel_order(buyer=request.user, order_id=order_id)
        return JsonResponse(result)
        
    except Exception as e:
        return JsonResponse({"success": False, "message": f"حدث خطأ داخلي: {str(e)}"}, status=200)
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import os
import json


@csrf_exempt
@api_view(["GET", "POST"])
def instagram_webhook(request):

    # ==========================================
    # GET
    # Instagram يستخدم GET للتحقق من الـWebhook
    # ==========================================

    if request.method == "GET":

        mode = request.GET.get(
            "hub.mode"
        )

        verify_token = request.GET.get(
            "hub.verify_token"
        )

        challenge = request.GET.get(
            "hub.challenge"
        )

        # الـVerify Token الموجود في Environment Variables
        expected_token = os.getenv(
            "INSTAGRAM_WEBHOOK_VERIFY_TOKEN"
        )

        print("===== INSTAGRAM WEBHOOK VERIFY =====")
        print("MODE:", mode)
        print("VERIFY TOKEN RECEIVED:", bool(verify_token))
        print("CHALLENGE RECEIVED:", bool(challenge))

        # ==========================================
        # التحقق
        # ==========================================

        if (
            mode == "subscribe"
            and verify_token == expected_token
        ):
            print(
                "INSTAGRAM WEBHOOK VERIFIED: True"
            )

            # Instagram يتوقع challenge كنص
            return HttpResponse(
                challenge,
                status=200
            )

        print(
            "INSTAGRAM WEBHOOK VERIFIED: False"
        )

        return HttpResponse(
            "Verification failed",
            status=403
        )

    # ==========================================
    # POST
    # Instagram يرسل الأحداث هنا
    # ==========================================

    if request.method == "POST":

        try:

            data = json.loads(
                request.body
            )

            print(
                "===== INSTAGRAM WEBHOOK EVENT ====="
            )

            print(
                "WEBHOOK DATA:",
                data
            )

            # نرجع 200 بسرعة إلى Instagram
            # حتى يعرف أن الطلب وصل
            return HttpResponse(
                "EVENT_RECEIVED",
                status=200
            )

        except Exception as e:

            print(
                "🔥 INSTAGRAM WEBHOOK ERROR:",
                str(e)
            )

            return HttpResponse(
                "Invalid payload",
                status=400
            )
@require_POST
def return_order_api(request, order_id):
    try:
        phone = request.GET.get('phone') or request.POST.get('phone')

        if phone:
            order = Orders.objects.filter(id=order_id, phone=phone).first()

            if not order:
                return JsonResponse({"success": False, "message": "الطلب غير موجود"})

            if order.status != "delivered":
                return JsonResponse({"success": False, "message": "لا يمكن الإرجاع إلا بعد الاستلام"})

            if order.return_status:
                return JsonResponse({"success": False, "message": "تم طلب الاسترجاع مسبقاً"})

            # ⛔ تحقق المدة
            if order.delivered_date:
                deadline = order.delivered_date + timedelta(days=order.return_days or 0)
                if timezone.now() > deadline:
                    return JsonResponse({"success": False, "message": "انتهت فترة الاسترجاع"})

            # ✅ هنا أهم تعديل
            product = order.product

            with transaction.atomic():
                # 📈 إعادة المخزون
                product.stock += order.quantity
                product.save()

                # 📝 تحديث الطلب
                order.return_status = "requested"
                order.status = "Return Requested"
                order.save()

            return JsonResponse({
                "success": True,
                "message": "تم إرسال طلب الاسترجاع وإرجاع المخزون مؤقتاً 🔄"
            })

        # fallback
        result = request_return(buyer=request.user, order_id=order_id)
        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=200)

from django.http import JsonResponse
from django.views.decorators.http import require_GET

from django.http import JsonResponse
from django.views.decorators.http import require_GET
import traceback # 👈 مهم جداً لطباعة تفاصيل الخطأ بدقة

# تأكدي تماماً أن اسم الموديل هنا مطابق لاسم الكلاس في الـ models.py (Orders بالجمع)
from .models import Orders 

from django.http import JsonResponse
from django.views.decorators.http import require_GET
import traceback

from products.services.buyer.cart import (
    cancel_order_service,
    buyer_request_return_service,
    cancel_return_request_service,
    mark_order_as_delivered_service
)

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
@require_POST
def order_action_api(request):

    try:
        data = json.loads(request.body)

        order_id = data.get("order_id")
        action = data.get("action")

        if not order_id or not action:
            return JsonResponse({
                "success": False,
                "message": "order_id and action are required."
            })

        if action == "cancel":
            result = cancel_order_service(order_id)

        elif action == "return":
            result = buyer_request_return_service(order_id)

        elif action == "cancel_return":
            result = cancel_return_request_service(order_id)

        elif action == "delivered":
            result = mark_order_as_delivered_service(order_id)

        else:
            result = {
                "success": False,
                "message": "Unknown action."
            }

        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": str(e)
        })
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .services.buyer.cart import (
    #add_to_cart,
    update_cart_quantity,
    get_cart_data
)

import json

import json
from django.http import JsonResponse

from django.utils import timezone  # لاستخدام الوقت الحالي لـ created_at
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import BuyerInfo
from .services.buyer.cart import confirm_order

import json
import traceback
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_POST
def confirm_order_api(request):
    
    try:
        body = json.loads(request.body or "{}")
        lang = body.get("lang", "en")
        texts = get_translations(["orders", "buyer"], lang)
        # تنظيف رقم الهاتف القادم من الفرونت إند مباشرة عند الاستقبال
        raw_phone = body.get("phone", "")
        clean_phone = str(raw_phone).strip() if raw_phone else ""
        print(f"The phone is : {raw_phone} the secound is {clean_phone} ")
        
        # buyer_info_data = {
        #     "name": body.get("name", "").strip(),
        #     "address": body.get("address", "").strip(),
        #     "phone": clean_phone,
        #     "email": body.get("email", "").strip(),
        # }
        buyer_info_data = {
            "name": body.get("name", "").strip(),
            "address": body.get("address", "").strip(),
            "phone": clean_phone,
            "email": body.get("email", "").strip(),
            "lang": lang,
        }
        print(f"The info are {buyer_info_data}")

        cart_items_data = body.get("cart_items")
        product_data = body.get("product_data")
        
        # ✅ تصحيح: طباعة المتغيرات القادمة في الطلب بدلاً من استدعاء دالة الـ View
        print(f"Cart items data: {cart_items_data}")
        print(f"Product data: {product_data}")
        
        if not buyer_info_data["phone"] or not buyer_info_data["name"]:
            return JsonResponse({"success": False, "message": "الاسم ورقم الهاتف مطلوبان"}, status=400)

        # تحديث أو إنشاء حساب المشتري برقم الهاتف النظيف
        buyer_profile, created = BuyerInfo.objects.update_or_create(
            phone=buyer_info_data["phone"],
            defaults={
                "name": buyer_info_data["name"],
                "address": buyer_info_data["address"],
                "email": buyer_info_data["email"],
                "created_at": timezone.now()
            }
        )
        
        # استدعاء دالة الحفظ الذكية مع تأمين المتغيرات
        # result = confirm_order(
        #     buyer=buyer_profile, 
        #     buyer_info=buyer_info_data,
        #     product_data=product_data,
        #     cart_items_data=cart_items_data
        # )
        result = confirm_order(
            buyer=buyer_profile,
            buyer_info=buyer_info_data,
            product_data=product_data,
            cart_items_data=cart_items_data
        )
        
        # ✅ تصحيح: طباعة النتيجة المسترجعة (result) بدلاً من إعادة استدعاء الدالة
        print(f"The confirmed order result is : {result}")
        
        return JsonResponse(result)

    except Exception as e:
        print("❌ CONFIRM_ORDER API ERROR:", repr(e))
        traceback.print_exc()
        return JsonResponse({"success": False, "message": str(e)}, status=500)
@require_GET
def confirmed_orders_api(request):
    try:
        lang = request.GET.get("lang", "ar")
        phone = request.GET.get("phone", "")

        if phone:
            # تنظيف المسافات من رقم الهاتف لضمان دقة البحث في قاعدة البيانات
            clean_phone = str(phone).strip()
            
            # البحث باستخدام الفلتر المتقدم للتأكد من جلب الطلبات المطابقة
            orders_query = (
                Orders.objects
                .filter(phone__icontains=clean_phone)
                .select_related("product")
                .order_by("-order_date")
            )

            orders_list = []
            for order in orders_query:
                try:
                    product = order.product
                    product_name = product.name if lang == "en" else getattr(product, "name_ar", product.name) if product else order.name or "Unknown Product"
                    total_price = float(order.total_price) if order.total_price is not None else 0.0
                    current_status = (order.status or "processing").strip().lower()

                    # 🛡️ حل مشكلة الحماية وعرض رابط الصورة بشكل سليم متوافق مع مجلد static أو media
                    final_image_url = None
                    if product and getattr(product, "base_image", None) and product.base_image:
                        image_path = product.base_image.url
                        # حماية المسار من التداخل التلقائي لـ Django
                        if "static/" in image_path:
                            if not image_path.startswith('/'):
                                image_path = '/' + image_path
                            final_image_url = request.build_absolute_uri(image_path)
                        else:
                            final_image_url = request.build_absolute_uri(image_path)

                    orders_list.append({
                        "order_id": order.id,
                        "status": current_status,
                        "status_display": current_status,
                        "product_id": product.id if product else None,
                        "name": product_name,
                        "image_url": final_image_url,
                        "price": float(product.price) if product and product.price else 0,
                        "quantity": order.quantity or 1,
                        "total_price": total_price,
                        "receiver_name": order.name,
                        "phone": order.phone,
                        "order_date": order.order_date.isoformat() if order.order_date else None,
                        "attributes_snapshot": order.attributes_snapshot or {},
                    })
                except Exception as item_error:
                    print(f"⚠️ خطأ أثناء معالجة الطلب #{order.id}: {item_error}")
                    continue

            return JsonResponse({"success": True, "orders": orders_list})

        # مسار الخدمة الافتراضية في حال عدم إرسال الهاتف
        result = get_confirmed_orders_service(request=request, lang=lang)
        if isinstance(result, list):
            return JsonResponse({"success": True, "orders": result})
        elif isinstance(result, dict) and "orders" not in result:
            result["orders"] = []
        
        return JsonResponse(result if isinstance(result, dict) else {"success": False, "orders": []}, safe=False)

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"success": False, "orders": [], "message": str(e)}, status=200)
@require_POST
def add_cart_api(request):

    body = json.loads(
        request.body
    )


    result = add_to_cart(

        buyer=request.user,

        product_id=body.get("product_id"),

        quantity=body.get(
            "quantity",
            1
        )

    )


    return JsonResponse(result)

@require_POST
def update_cart_api(request):


    body=json.loads(
        request.body
    )



    result = update_cart_quantity(

        buyer=request.user,

        cart_id=body.get("cart_id"),

        quantity=body.get("quantity")

    )


    return JsonResponse(result)
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST
from .models import Categories, CategoryTranslations, Products,ProductVariants
from django.contrib.auth.decorators import login_required
import traceback
from products.services.merchant.show_products import get_merchant_products_service
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_seller_products_api(request):
    lang = request.GET.get("lang", "en")
    category = request.GET.get("category", "_all_")

    try:
        merchant = Merchants.objects.get(email=request.user.email)
        products = get_merchant_products_service(
            request,
            request.user.email,
            category
        )
        from django.db.models import Sum

        products_stock = Products.objects.filter(
            merchant=merchant
        ).aggregate(
            total=Sum("stock")
        )["total"] or 0

        variants_stock = ProductVariants.objects.filter(
            product__merchant=merchant
        ).aggregate(
            total=Sum("stock")
        )["total"] or 0

        total_stock = products_stock + variants_stock
        
        print("The merchantt is:", merchant)
        print("THEE PRODUCTS ARE :",products)

        return JsonResponse({
            "success": True,
            "products": products,
            "products_length":len(products),
            "total_stock":total_stock,
            "translations": get_translations(["seller","common"], lang),
        })
        # return JsonResponse({
        #     "success": True,
        #     "products": result["products"],
        #     "products_length": result["products_length"],
        #     "translations": get_translations(["seller", "common"], lang),
        # })
    
    except Exception as e:
        traceback.print_exc()
        print("ERROR :",e)
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)
        
        
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_seller_products_api(request):
#     lang = request.GET.get("lang", "en")
#     category = request.GET.get("category", "_all_")

#     try:
#         merchant = Merchants.objects.get(email=request.user.email)

#         result = get_merchant_products_service(
#             request,
#             request.user.email,
#             category
#         )

#         return JsonResponse({
#             "success": True,
#             "products": result["products"],
#             "products_length": result["products_length"],
#             "translations": get_translations(["seller", "common"], lang),
#         })

#     except Exception as e:
#         traceback.print_exc()
#         return JsonResponse({
#             "success": False,
#             "error": str(e)
#         }, status=500)
 
import re
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from products.services.merchant.show_products import update_product_service
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_product_api(request, pk):
    lang = request.GET.get("lang","en")
    try:
        # 1. جلب كافة بيانات النصوص القادمة من request.data
        product_data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        
        # 2. تعريف product_files بشكل آمن مبدئياً لتجنب UnboundLocalError
        product_files = request.FILES
        
        variants_dict = {}
        
        #3. تجميع الحقول النصية الخاصة بالـ Variants
        for key, value in request.data.items():
            print("DATA KEY",key)
            match = re.match(r'variants\[(\d+)\]\[(\w+)\]', key)
            if match:
                index = int(match.group(1))
                field_name = match.group(2)
                # if index not in variants_dict:
                # #     variants_dict[index] = {}
                # # variants_dict[index][field_name] = value
                #     variants_dict[index][field_name] = value

                #     if field_name == "attributes":
                #         import json
                #         try:
                #             variants_dict[index][field_name] = json.loads(value)
                #         except:
                #             variants_dict[index][field_name] = {}
                if index not in variants_dict:
                    variants_dict[index] = {}

                if field_name == "attributes":
                    import json

                    try:
                        variants_dict[index][field_name] = json.loads(value)
                    except (json.JSONDecodeError, TypeError):
                        variants_dict[index][field_name] = {}
                else:
                    variants_dict[index][field_name] = value
                print("VARIANT DIC",variants_dict)
        print(request.data)
        for key in request.FILES:
            print("FILE KEY",key)
            # الصورة الرئيسية
            match = re.match(r"variants\[(\d+)\]\[image\]", key)
            if match:
                index = int(match.group(1))

                if index not in variants_dict:
                    variants_dict[index] = {}

                variants_dict[index]["image"] = request.FILES[key]
                continue


            # الصور الإضافية
            match = re.match(r"variants\[(\d+)\]\[extra_images\]", key)
            if match:
                index = int(match.group(1))

                if index not in variants_dict:
                    variants_dict[index] = {}

                variants_dict[index]["extra_images"] = request.FILES.getlist(key)

        # 5. ترتيب الـ Variants وإضافتها داخل product_data
        sorted_indices = sorted(variants_dict.keys())
        product_data['variants'] = [variants_dict[i] for i in sorted_indices]

        print("بيانات المنتج المحفوظة:", product_data)
        print("pk =", pk)
        print("user =", request.user.email)
     
        # 6. تمرير البيانات للخدمة (Service)
        update_product_service(pk, request.user.email, product_data, product_files)
        
        return JsonResponse({"success": True,"translations":get_translations(["products","common"], lang), "message": "Product updated successfully"}, status=200)
        
    except Exception as err:
        print("ERROR IS :", err)
        import traceback
        print(traceback.format_exc())
        return JsonResponse({"success": False, "error": str(err)}, status=500)

import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Orders


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_order_status_api(request, pk):
    lang =request.GET.get("lang", "en")
    try:
        # تمرير المعرف وإيميل التاجر والبيانات المرسلة
        update_order_status_service(pk, request.user.email, request.data)
        
        return JsonResponse({"success": True, "message": "Order status updated successfully","translations":get_translations(["orders","common","products","returns"], lang)}, status=200)

    except Orders.DoesNotExist:
        return JsonResponse({"success": False, "error": "Order not found"}, status=404)
    except ValueError as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)    
from products.services.merchant.show_products import delete_product_service
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product_api(request, pk):
    try:
        delete_product_service(pk, request.user.email)
        return JsonResponse({"success": True, "message": "Product deleted"}, status=200)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def product_detail(request, product_id):
    try:
        lang = request.GET.get(
            "lang",
            "en"
        )
        product = get_object_or_404(
            Products,
            id=product_id
        )
        
        serializer = ProductDetailSerializer(
            product,
            context={"request": request,
                     "lang":lang
                     }
        )

        print(serializer.data)   # <-- سيطبع هنا إذا نجح

        return Response(serializer.data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.buyer.buyer_product import FavoriteService
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services.buyer.buyer_product import FavoriteServiceKeeper

@api_view(['POST'])
def ToggleFavoriteView(request):
    buyer_phone = request.data.get("buyer_phone")
    product_id = request.data.get("product_id")

    if not buyer_phone or not product_id:
        return Response(
            {"error": "buyer_phone و product_id مطلوبان"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    result = FavoriteService.toggle_favorite(buyer_phone, product_id)
    return Response(result, status=status.HTTP_200_OK)
import traceback
from products.models import Favorite
from django.http import JsonResponse
from rest_framework.decorators import api_view
from products.services.buyer.search_products_service import search_products_service
from products.serializers.product_serializer import SearchProductSerializer, CategorySerializer
@api_view(['GET'])
def get_buyer_favorites(request):
    try:
        buyer_phone = request.GET.get('buyer_phone', '')
        instagram_username=request.GET.get('instagram_username', '')
        if not buyer_phone:
            return JsonResponse({'favorites': []})

        fav_items = Favorite.objects.filter(buyer_phone=buyer_phone)
        if instagram_username:
            fav_items = fav_items.filter(
                product__merchant__instagram_username=instagram_username
            )
        data = []
        for item in fav_items:
            if hasattr(item, 'product') and item.product:
                p = item.product
                
                # 1. استخراج رابط الصورة بأمان
                image_url = ""
                img_field = getattr(p, 'base_image', None) or getattr(p, 'image', None)
                
                if img_field and hasattr(img_field, 'url') and img_field.name:
                    try:
                        image_url = request.build_absolute_uri(img_field.url)
                    except ValueError:
                        image_url = ""

                # 2. إرجاع جميع تسميات الصور المحتملة للـ Frontend
                data.append({
                    "id": p.id,
                    "name": getattr(p, 'name', getattr(p, 'title', '')),
                    "price": str(getattr(p, 'price', 0)),
                    "stock": getattr(p, 'stock', 0),
                    "image": image_url,
                    "image_url": image_url,
                    "base_image": image_url,
                    "is_favorite": True
                })

        return JsonResponse({'favorites': data})

    except Exception as e:
        print("====== ERROR IN GET_BUYER_FAVORITES ======")
        print(traceback.format_exc())
        return JsonResponse({
            'error': str(e),
            'details': traceback.format_exc()
        }, status=500)
@api_view(["GET"])
def search_products_api(request):
    
        
    lang = request.GET.get("lang", "en")
    search = request.GET.get("search", "")
    category = request.GET.get("category", "all")
    sort = request.GET.get("sort", "")
    color = request.GET.get("color", "")
    size = request.GET.get("size", "")
    book_language = request.GET.get("book_language", "")
    try:
        
        products = search_products_service(
            lang=lang,
            search=search,
            category=category,
            sort=sort,
            color=color,
            size=size,
            book_language=book_language,
        )

        serializer = SearchProductSerializer(
            products,
            many=True,
            context={"lang": lang}
        )
    except Exception as err:
        print("ERROR IS :", err)
    return Response({
        "success": True,
        "count": len(serializer.data),
        "products": serializer.data,
        "translations":get_translations("products", lang)
    })
@api_view(["GET"])
def categories_api(request):

    lang = request.GET.get(
        "lang",
        "en"
    )

    categories = Categories.objects.all()

    serializer = CategorySerializer(
        categories,
        many=True,
        context={
            "lang":lang
        }
    )

    return Response({
        "categories":serializer.data
    })
# views.py

def cart_translations_api(request):
    lang = request.GET.get("lang", "en")

    return JsonResponse(
        get_translations(["cart","common"], lang)
    )
@api_view(["GET", "POST"])
def login_translations_api(request):
    lang = request.GET.get("lang", "en")

    if request.method == "GET":
        return Response({
            "translations": get_translations("auth",lang)
        })
@api_view(["GET", "POST"])
def register_translations_api(request):
    lang = request.GET.get("lang", "en")

    if request.method == "GET":
        return Response({
            "translations": get_translations("auth",lang)
        })

@api_view(["GET", "POST"])
def buyer_translations_api(request):
    lang =request.GET.get("lang", "en")
    
    if request.method=="GET":
        return response({
            "translations":get_translations(["search", "common","products"], lang)
        })
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order_details_api(request, order_number):
    try:
        merchant = Merchants.objects.get(email=request.user.email)
        lang = request.GET.get(
            "lang",
            "en"
        )
        orders = (
            Orders.objects
            .filter(
                merchant=merchant,
                order_number=order_number
            )
            .select_related(
                "product",
                "buyer",
                "variant",
            )
            .order_by("id")
        )

        if not orders.exists():
            return Response({
                "success": False,
                "error": "Order not found"
            }, status=404)

        first_order = orders.first()

        items = []

        for order in orders:

            items.append({

                "id": order.id,

                "product_id": order.product.id if order.product else None,

                "product_name": order.product.name if order.product else "",

                "image": request.build_absolute_uri(order.product.base_image.url)
                if order.product and order.product.base_image else None,

                "quantity": order.quantity,

                "price": float(order.total_price),

                "status": order.status,

                "variant": {
                    "color": order.chosen_color,
                    "size": order.chosen_size,
                    "language": order.book_language,
                }
            })

        return Response({

            "success": True,

            "order": {

                "order_number": first_order.order_number,

                "customer_name": first_order.name,

                "phone": first_order.phone,

                "email": first_order.email,

                "address": first_order.address,

                "order_date": first_order.order_date,

                "status": first_order.status,

                "items": items,
            },
            "translations":get_translations(["orders","common","returns"], lang),

        })

    except Exception as e:
        traceback.print_exc()

        return Response({
            "success": False,
            "error": str(e)
        }, status=500)
from products.services.category.get_category_attributes_service import (
    get_category_attributes_service
)
from products.models import CategoryAttributeTranslation
from products.serializers.product_serializer import CategoryAttributeSerializer
@api_view(["GET"])
def get_category_attributes_api(request, category_code):

    lang = request.GET.get(
        "lang",
        "en"
    )

    attributes = get_category_attributes_service(
        category_code
    )

    serializer = CategoryAttributeSerializer(
        attributes,
        many=True,
        context={
            "lang": lang
        }
    )

    return Response({
        "success": True,
        "data": serializer.data
    })

from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404
import traceback

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_order_details_api(request, order_number):
    """
    جلب جميع المنتجات التابعة لطلب واحد للبائع.
    order_number يمثل الطلب الكامل،
    وكل Orders يمثل منتجاً داخل هذا الطلب.
    """
    print("🔥 SELLER ORDER DETAILS API CALLED 🔥")

    try:
        lang = request.GET.get("lang", "ar")

        token_user = request.user

        # --------------------------------------------------
        # التحقق من تسجيل الدخول
        # --------------------------------------------------

        if not token_user or not token_user.is_authenticated:
            return JsonResponse({
                "success": False,
                "message": "authentication_required"
            }, status=401)

        # --------------------------------------------------
        # جلب التاجر
        # --------------------------------------------------

        merchant = Merchants.objects.filter(
            email=token_user.email
        ).first()

        if not merchant:
            return JsonResponse({
                "success": False,
                "message": "merchant_not_found"
            }, status=404)

        # --------------------------------------------------
        # جلب جميع المنتجات داخل الطلب
        # --------------------------------------------------

        orders = (
            Orders.objects
            .select_related(
                "product",
                "variant",
                "buyer",
                "merchant"
            )
            .filter(
                order_number=order_number,
                merchant=merchant
            )
            .order_by("id")
        )

        if not orders.exists():
            return JsonResponse({
                "success": False,
                "message": "order_not_found"
            }, status=404)

        # --------------------------------------------------
        # بيانات المنتجات
        # --------------------------------------------------

        items = []

        for order in orders:

            product = order.product
            variant = order.variant

            # ----------------------------------------------
            # الصورة
            # ----------------------------------------------

            image_url = None

            if product and getattr(product, "base_image", None):
                try:
                    image_url = request.build_absolute_uri(
                        product.base_image.url
                    )
                except Exception:
                    image_url = None

            if variant:
                try:
                    if variant.image:
                        image_url = request.build_absolute_uri(
                            variant.image.url
                        )
                    elif variant.image_url:
                        image_url = variant.image_url
                except Exception:
                    pass

            # ----------------------------------------------
            # Snapshot
            # ----------------------------------------------

            snapshot = (
                order.attributes_snapshot
                if isinstance(order.attributes_snapshot, dict)
                else {}
            )
            product_attributes = []

            for attr in snapshot.get("product_attributes", []):

                attribute_id = attr.get("attribute_id")

                attribute_name = attr.get("attribute_name")

                if attribute_id:

                    translation = (
                        CategoryAttributeTranslation.objects
                        .filter(
                            attribute_id=attribute_id,
                            language=lang
                        )
                        .first()
                    )

                    if translation:
                        attribute_name = translation.translation

                product_attributes.append({
                    "attribute_id": attribute_id,
                    "attribute_name": attribute_name,
                    "attribute_type": attr.get("attribute_type"),
                    "value": attr.get("value"),
                })
            print("CURRENT ORDER IS :",snapshot)
            # ----------------------------------------------
            # Variant
            # ----------------------------------------------

            variant_data = None

            if variant:

                variant_snapshot = (
                    snapshot.get("variant") or {}
                )

                variant_data = {
                    "id": variant_snapshot.get(
                        "id",
                        variant.id
                    ),

                    "title": variant_snapshot.get(
                        "title",
                        variant.title
                    ),

                    "sku": variant_snapshot.get(
                        "sku",
                        variant.sku
                    ),

                    "barcode": variant_snapshot.get(
                        "barcode",
                        variant.barcode
                    ),

                    "price": variant_snapshot.get(
                        "price",
                        str(variant.price)
                        if variant.price is not None
                        else None
                    ),

                    "old_price": variant_snapshot.get(
                        "old_price"
                    ),

                    "currency": variant_snapshot.get(
                        "currency",
                        variant.currency
                    ),

                    "weight": variant_snapshot.get(
                        "weight"
                    ),

                    "image_url": image_url,
                }

            # ----------------------------------------------
            # السعر
            # ----------------------------------------------

            unit_price = (
                float(order.total_price / order.quantity)
                if order.total_price is not None
                and order.quantity
                else 0
            )

            # ----------------------------------------------
            # المنتج
            # ----------------------------------------------

            items.append({

                # مهم جداً:
                # هذا id خاص بهذا المنتج داخل الطلب
                # ونستخدمه عند تغيير الحالة
                "id": order.id,

                "product_id": (
                    product.id
                    if product
                    else None
                ),

                "name": (
                    product.name
                    if product
                    else None
                ),

                "image_url": image_url,

                "quantity": order.quantity or 1,

                "price": unit_price,

                "total_price": (
                    float(order.total_price)
                    if order.total_price is not None
                    else 0
                ),

                # حالة هذا المنتج تحديداً
                "status": (
                    order.status or "processing"
                ).strip().lower(),

                "status_display": (
                    order.status or "processing"
                ).strip().lower(),

                "delivered_date": (
                    order.delivered_date.isoformat()
                    if order.delivered_date
                    else None
                ),

                "return_status": order.return_status,
                "return_days": order.return_days,

                "return_expiry_date": (
                    order.delivered_date
                    + timezone.timedelta(
                        days=order.return_days or 0
                    )
                ).isoformat()
                if order.delivered_date else None,

                "return_days_remaining": max(
                    0,
                    (
                        (
                            order.delivered_date
                            + timezone.timedelta(
                                days=order.return_days or 0
                            )
                        ) - timezone.now()
                    ).days
                )
                if order.delivered_date and order.return_days is not None
                else None,

                "is_archived": order.is_archived,

                # Snapshot الخاص بهذا المنتج
                # "product_attributes": snapshot.get(
                #     "product_attributes",
                #     []
                # ),
                "product_attributes": product_attributes,


                "variant_attributes": snapshot.get(
                    "variant_attributes",
                    []
                ),

                "variant": variant_data,
            })

        # --------------------------------------------------
        # بيانات العميل مشتركة بين منتجات الطلب
        # --------------------------------------------------

        first_order = orders.first()

        buyer_data = {
            "name": first_order.name,
            "phone": first_order.phone,
            "email": first_order.email,
            "address": first_order.address,
            "city": first_order.city,
            "region": first_order.region,
            "building": first_order.building,
            "apartment": first_order.apartment,
            "street": first_order.street,
            "country": first_order.country,
        }

        # --------------------------------------------------
        # إجمالي الطلب
        # --------------------------------------------------

        total_order_price = sum(
            float(order.total_price or 0)
            for order in orders
        )

        total_quantity = sum(
            order.quantity or 0
            for order in orders
        )

        # --------------------------------------------------
        # الاستجابة
        # --------------------------------------------------

        return JsonResponse({
            "success": True,

            "order": {
                "order_number": order_number,

                "order_date": (
                    first_order.order_date.isoformat()
                    if first_order.order_date
                    else None
                ),

                "buyer": buyer_data,

                "items": items,

                "products_count": len(items),

                "total_quantity": total_quantity,

                "total_price": total_order_price,
                
            },
            "translations":get_translations(["common","orders","returns"], lang),
        })

    except Exception as e:

        traceback.print_exc()

        return JsonResponse({
            "success": False,
            "message": str(e),
        }, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_archived_orders_api(request):

    user = request.user
    lang = request.GET.get("lang", "en")

    print("--- SELLER ARCHIVED ORDERS API CALLED ---")

    try:
        merchant = Merchants.objects.get(
            email=user.email
        )

    except Merchants.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Merchant profile not found"
            },
            status=404
        )

    try:

        archived_orders = (
            Orders.objects
            .filter(
                merchant=merchant,
                is_archived=True
            )
            .order_by("-order_date")
        )

        # سنجمع المنتجات التي لها نفس order_number
        grouped_orders = {}

        for order in archived_orders:

            order_number = order.order_number

            if order_number not in grouped_orders:

                grouped_orders[order_number] = {
                    "order_number": order_number,
                    "order_date": (
                        order.order_date.isoformat()
                        if order.order_date
                        else None
                    ),
                    "status": "completed",
                    "total_price": 0,
                    "products_count": 0,
                }

            grouped_orders[order_number]["total_price"] += (
                float(order.total_price or 0)
            )

            grouped_orders[order_number]["products_count"] += 1

        orders_list = list(
            grouped_orders.values()
        )

        return Response({
            "success": True,
            "orders": orders_list,
            "translations": get_translations(
                ["orders", "common"],
                lang
            )
        })

    except Exception as e:

        traceback.print_exc()

        return Response(
            {
                "success": False,
                "message": f"Server Error: {str(e)}",
            },
            status=500
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from products.services.notification_services import get_merchant_notifications
from products.models import Notifications
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_notifications_api(request):

    print("🔔 SELLER NOTIFICATIONS API CALLED 🔔")

    try:

        # ==================================================
        # التحقق من المستخدم
        # ==================================================

        token_user = request.user

        if not token_user or not token_user.is_authenticated:
            return JsonResponse({
                "success": False,
                "message": "authentication_required"
            }, status=401)

        # ==================================================
        # جلب التاجر
        # ==================================================

        merchant = Merchants.objects.filter(
            email=token_user.email
        ).first()

        if not merchant:
            return JsonResponse({
                "success": False,
                "message": "merchant_not_found"
            }, status=404)

        # ==================================================
        # لغة التاجر
        # ==================================================

        lang = merchant.merchant_lang or "en"

        # ==================================================
        # الإشعارات
        # ==================================================

        # notifications = (
        #     Notifications.objects
        #     .filter(
        #         merchant=merchant
        #     )
        #     .select_related("order")
        #     .order_by("-created_at")
        # )
        notifications = (
            Notifications.objects
            .filter(
                merchant=merchant,
                is_read=False
            )
            .select_related("order")
            .order_by("-created_at")
        )
        # ==================================================
        # الترجمات
        # ==================================================

        translations = get_translations(
            ["seller"],
            lang
        )

        # ==================================================
        # تجهيز الإشعارات
        # ==================================================

        notifications_data = []

        for notification in notifications:

            text_key = (
                "notification_"
                + notification.notification_type
            )

            notifications_data.append({

                "id": notification.id,

                "type": notification.notification_type,

                "text_key": text_key,

                "message": translations.get(
                    text_key,
                    text_key
                ),

                "is_read": notification.is_read,

                "created_at": (
                    notification.created_at.isoformat()
                    if notification.created_at
                    else None
                ),

                "order_id": notification.order_id,

                "order_number": (
                    notification.order.order_number
                    if notification.order
                    else None
                ),
            })

        # ==================================================
        # عدد الإشعارات غير المقروءة
        # ==================================================

        unread_count = (
            Notifications.objects
            .filter(
                merchant=merchant,
                is_read=False
            )
            .count()
        )

        # ==================================================
        # Response
        # ==================================================

        return JsonResponse({

            "success": True,

            "unread_count": unread_count,

            "notifications": notifications_data,

        })

    except Exception as e:

        traceback.print_exc()

        return JsonResponse({
            "success": False,
            "message": str(e),
        }, status=500)
        
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def mark_seller_notification_as_read_api(request, notification_id):

#     try:
#         token_user = request.user

#         # جلب البائع
#         merchant = Merchants.objects.filter(
#             email=token_user.email
#         ).first()

#         if not merchant:
#             return JsonResponse({
#                 "success": False,
#                 "message": "merchant_not_found"
#             }, status=404)

#         # جلب الإشعار الخاص بهذا البائع
#         notification = Notifications.objects.filter(
#             id=notification_id,
#             merchant=merchant
#         ).first()

#         if not notification:
#             return JsonResponse({
#                 "success": False,
#                 "message": "notification_not_found"
#             }, status=404)

#         # جعله مقروءًا
#         notification.is_read = True
#         notification.save(
#             update_fields=["is_read"]
#         )

#         return JsonResponse({
#             "success": True,
#             "message": "notification_marked_as_read"
#         })

#     except Exception as e:

#         traceback.print_exc()

#         return JsonResponse({
#             "success": False,
#             "message": str(e)
#         }, status=500)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_seller_notification_read_api(request, notification_id):

    try:

        # ==================================================
        # المستخدم
        # ==================================================

        token_user = request.user

        if not token_user or not token_user.is_authenticated:
            return JsonResponse({
                "success": False,
                "message": "authentication_required"
            }, status=401)

        # ==================================================
        # التاجر
        # ==================================================

        merchant = Merchants.objects.filter(
            email=token_user.email
        ).first()

        if not merchant:
            return JsonResponse({
                "success": False,
                "message": "merchant_not_found"
            }, status=404)

        # ==================================================
        # الإشعار
        # مهم جدًا: نبحث عن إشعار هذا التاجر فقط
        # ==================================================

        notification = Notifications.objects.filter(
            id=notification_id,
            merchant=merchant
        ).first()

        if not notification:
            return JsonResponse({
                "success": False,
                "message": "notification_not_found"
            }, status=404)

        # ==================================================
        # تحديد الإشعار كمقروء
        # ==================================================

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        # ==================================================
        # Response
        # ==================================================

        return JsonResponse({
            "success": True,
            "message": "notification_marked_as_read",
            "notification_id": notification.id,
        })

    except Exception as e:

        traceback.print_exc()

        return JsonResponse({
            "success": False,
            "message": str(e),
        }, status=500)

# @api_view(["PATCH"])
# @permission_classes([IsAuthenticated])
# def mark_seller_notification_as_read_api(request, notification_id):

#     try:

#         # ==================================================
#         # المستخدم الحالي
#         # ==================================================

#         token_user = request.user

#         if not token_user or not token_user.is_authenticated:
#             return JsonResponse({
#                 "success": False,
#                 "message": "authentication_required"
#             }, status=401)


#         # ==================================================
#         # جلب التاجر
#         # ==================================================

#         merchant = Merchants.objects.filter(
#             email=token_user.email
#         ).first()

#         if not merchant:
#             return JsonResponse({
#                 "success": False,
#                 "message": "merchant_not_found"
#             }, status=404)


#         # ==================================================
#         # جلب الإشعار
#         # مهم جداً: يجب أن يكون الإشعار تابعاً لهذا التاجر
#         # ==================================================

#         notification = Notifications.objects.filter(
#             id=notification_id,
#             merchant=merchant
#         ).first()

#         if not notification:
#             return JsonResponse({
#                 "success": False,
#                 "message": "notification_not_found"
#             }, status=404)


#         # ==================================================
#         # تحديده كمقروء
#         # ==================================================

#         notification.is_read = True
#         notification.save(update_fields=["is_read"])


#         # ==================================================
#         # Response
#         # ==================================================

#         return JsonResponse({
#             "success": True,
#             "message": "notification_marked_as_read",
#             "notification_id": notification.id,
#         })


#     except Exception as e:

#         import traceback
#         traceback.print_exc()

#         return JsonResponse({
#             "success": False,
#             "message": str(e),
#         }, status=500)