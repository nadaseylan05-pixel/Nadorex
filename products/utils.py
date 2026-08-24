
from .models import Translations
from django.db import transaction
def load_translations():
    langs = ['ar', 'en', 'tr', 'de', 'fr', 'es', 'zh', 'ja', 'ko', 'sv', 'it']
    field_map = {
        'ar': 'arabic',
        'en': 'english',
        'tr': 'turkish',
        'de': 'german',
        'fr': 'french',
        'es': 'spanish',
        'zh': 'chinese',
        'ja': 'japanese',
        'ko': 'korean',
        'sv': 'swedish',
        'it': 'italian',
    }

    translations = {lang: {} for lang in langs}
    all_translations = Translations.objects.all()

    for item in all_translations:
        for lang in langs:
            translations[lang][item.text_key] = getattr(item, field_map[lang])
    
    return translations
import uuid

def t(key_name, lang, translations, fallback=None):
    """
    ترجع الترجمة للنص حسب اللغة، أو fallback إذا لم توجد.
    """
    return translations.get(lang, {}).get(key_name, fallback or key_name)


def generate_session_id():
    """
    توليد UUID جديد كمعرّف فريد للجلسة.
    """
    return str(uuid.uuid4())


def get_or_create_session_id(request):
    """
    يحصل على session_id من الجلسة، أو ينشئ واحداً جديداً إذا لم يكن موجوداً.
    """
    session_key = "nadorex_session_id"
    if session_key not in request.session:
        request.session[session_key] = generate_session_id()
    return request.session[session_key]

def get_currency_symbol(currency):
    """
    إرجاع رمز العملة بناءً على رمز العملة النصي (مثل 'USD', 'EUR', 'SAR'...).
    إذا لم تكن العملة موجودة في القاموس، يتم إرجاع نفس الإدخال.
    """
    symbols = {
        'USD': '$',      # الدولار الأمريكي
        'EUR': '€',      # اليورو
        'GBP': '£',      # الجنيه الإسترليني
        'JPY': '¥',      # الين الياباني
        'CNY': '¥',      # اليوان الصيني
        'TRY': '₺',      # الليرة التركية
        'SAR': '﷼',      # الريال السعودي
        'AED': 'د.إ',     # الدرهم الإماراتي
        'KWD': 'ك.د',     # الدينار الكويتي
        'QAR': 'ر.ق',     # الريال القطري
        'OMR': 'ر.ع',     # الريال العماني
        'BHD': 'د.ب',     # الدينار البحريني
        'EGP': 'ج.م',     # الجنيه المصري
        'INR': '₹',      # الروبية الهندية
        'PKR': '₨',      # الروبية الباكستانية
        'RUB': '₽',      # الروبل الروسي
        'AUD': 'A$',     # الدولار الأسترالي
        'CAD': 'C$',     # الدولار الكندي
        'CHF': 'CHF',    # الفرنك السويسري
        'ZAR': 'R',      # الراند الجنوب أفريقي
        'IDR': 'Rp',     # الروبية الإندونيسية
        'MYR': 'RM',     # الرينغيت الماليزي
        'THB': '฿',      # البات التايلندي
        'KRW': '₩',      # الوون الكوري الجنوبي
        'SGD': 'S$',     # الدولار السنغافوري
        'NGN': '₦',      # النيرة النيجيرية
    }

    cleaned = currency.strip().upper()
    symbol = symbols.get(cleaned, currency)
    print(f"Currency: '{currency}' -> Cleaned: '{cleaned}' -> Symbol: '{symbol}'")
    return symbol
from .models import Products
def get_product_by_id(product_id):
    try:
        product = Products.objects.values(
            'id', 'name', 'describtion', 'price', 'old_price', 'currency',
            'image_url', 'colors', 'sizes', 'category_code', 'books_language'
        ).get(id=product_id)
        return product
    except Products.DoesNotExist:
        return None
from .models import Categories, CategoryTranslations

def load_category_translations(lang):
    """
    تحميل ترجمات التصنيفات من قاعدة البيانات حسب اللغة المحددة.
    """
    category_translations = {}

    translations = CategoryTranslations.objects.filter(
        language=lang,
        translation__isnull=False,
        category_code__isnull=False  # فقط التصنيفات المرتبطة بكود صالح
    ).select_related('category_code')

    for trans in translations:
        category_translations[trans.category_code.code] = trans.translation

    return category_translations    

import os
import base64
import time
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
#from langdetect import detect
#from deep_translator import GoogleTranslator

from .models import RequestTranslations

SUPPORTED_LANGUAGES = ['ar', 'en', 'tr', 'de', 'fr', 'es', 'zh-CN', 'ja', 'ko', 'sv', 'it']

def detect_language(text, fallback='en'):
    try:
        return detect(text)
    except Exception:
        return fallback

def translate_text_to_all(desc, source_lang):
    translations = {}
    for target in [l for l in SUPPORTED_LANGUAGES if l != source_lang]:
        try:
            translated = GoogleTranslator(source=source_lang, target=target).translate(desc)
            translations[target] = translated
        except Exception as e:
            # سجّلي الخطأ ولكن تابعي
            print(f"Translation error {source_lang}->{target}: {e}")
    return translations

def save_base64_image_to_field(base64_string, model_instance, field_name='image'):
    # data:image/png;base64,AAAA...
    if not base64_string:
        return None
    header, data = (base64_string.split(',', 1) + [None])[:2]
    if data is None:
        data = header
    decoded = base64.b64decode(data)
    filename = f"requested_{int(time.time())}.png"
    content = ContentFile(decoded, name=filename)
    getattr(model_instance, field_name).save(filename, content)
    model_instance.save()
    return getattr(model_instance, field_name).url if hasattr(getattr(model_instance, field_name), 'url') else None

def send_product_match_email(to_email, product_name, product_description, product_category, product_url, lang, translations_texts=None):
    # translations_texts: dict of translation keys if you use t()
    subject = "منتج مطابق"  # عدّلي حسب ترجمة t(...)
    body = f"""
    مرحبًا،
    وجدنا منتجًا مطابقًا لطلبك:
    الاسم: {product_name}
    الوصف: {product_description}
    التصنيف: {product_category}
    رابط المنتج: {product_url}
    """
    try:
        email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [to_email])
        email.send(fail_silently=False)
        return True
    except Exception as e:
        print("Email send error:", e)
        return False

import uuid
import hashlib
import base64
import json
#import requests
import random
import string
#import bcrypt
from django.core.mail import send_mail
from django.conf import settings

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

# def send_verification_email(email, code):
#     try:
#         send_mail(
#             subject="Verify your account",
#             message=f"Your verification code is: {code}",
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=[email],
#         )
#         return True
#     except:
#         return False
# def send_verification_email(email, code):
#     try:
#         send_mail(
#             subject="Verify your account",
#             message=f"Your verification code is: {code}",
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=[email],
#             fail_silently=False,
#         )
#         return True

#     except Exception as e:
#         print("EMAIL ERROR:", e)
#         return False
import traceback
# def send_verification_email(email, code):
#     try:
#         print("EMAIL HOST:", settings.EMAIL_HOST)
#         print("EMAIL PORT:", settings.EMAIL_PORT)
#         print("EMAIL USER:", settings.EMAIL_HOST_USER)
#         print("FROM EMAIL:", settings.DEFAULT_FROM_EMAIL)
#         print("TO EMAIL:", email)
#         # sent = send_mail(
#         #     subject="Verify your account",
#         #     message=f"Your verification code is: {code}",
#         #     from_email=settings.DEFAULT_FROM_EMAIL,
#         #     recipient_list=[email],
#         #     fail_silently=False,
#         # )
        
#         sent = send_mail(
#             subject="TEST - NadoRex Verification Code",
#             message=f"""
#         Hello,

#         Your verification code is:

#         {code}

#         This is a test email from NadoRex.
#         """,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=[email],
#             fail_silently=False,
#         )
#         print("SEND_EMAIL RESULT", sent)
#         print("FROM:", settings.DEFAULT_FROM_EMAIL)
#         print("TO:", email)
#         print("SEND_MAIL RESULT:", sent)
#         return sent > 0
        
#     except Exception as e:
#         print("EMAIL ERROR:", type(e).__name__)
#         print("MESSAGE:", str(e))
#         traceback.print_exc()
#         return False
from products.services.translations import merchant_verify_translations
def send_verification_email(email, code, lang="en"):
    try:
        email_translations = merchant_verify_translations(lang)

        subject = email_translations["verification_email_subject"]

        message = email_translations["verification_email_body"].format(
            code=code
        )

        sent = send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        print("SEND_MAIL RESULT:", sent)

        return sent > 0

    except Exception as e:
        print("EMAIL ERROR:", type(e).__name__)
        print("MESSAGE:", str(e))
        traceback.print_exc()
        return False
def register_merchant_in_iyzico(data):
    api_url = "https://sandbox-api.iyzipay.com/onboarding/submerchant"
    api_key = "sandbox-q85BSeIRNpseeE8Z37wmRoNRqZlCoCXW"
    api_secret = "sandbox-spa9Boh2m8GC3YRR7EvYitcDdBIAPU6R"

    rnd = str(uuid.uuid4())
    conversation_id = str(uuid.uuid4())

    body = {
        "locale": "tr",
        "conversationId": conversation_id,
        "subMerchantExternalId": data.get("email"),
        "subMerchantType": data.get("subMerchantType"),
        "address": data.get("address"),
        "contactName": data.get("name"),
        "contactSurname": "Merchant",
        "email": data.get("email"),
        "gsmNumber": data.get("gsmNumber"),
        "iban": data.get("iban"),
        "identityNumber": data.get("identityNumber"),
        "name": data.get("name"),
        "currency": "TRY"
    }

    json_body = json.dumps(body, separators=(',', ':'))

    raw_data = api_key + rnd + json_body + api_secret
    hashed = hashlib.sha1(raw_data.encode()).digest()
    signature = base64.b64encode(hashed).decode()

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"IYZWS {api_key}:{signature}",
        "x-iyzi-rnd": rnd
    }

    try:
        response = requests.post(api_url, headers=headers, data=json_body)
        result = response.json()

        if result.get("status") == "success":
            return {
                "success": True,
                "merchant_key": result.get("subMerchantKey"),
                "sub_merchant_key": result.get("subMerchantExternalId"),
            }

        return {"success": False, "error": result.get("errorMessage")}

    except Exception as e:
        return {"success": False, "error": str(e)}
         
# utils.py

def get_available_colors():
    """
    تُرجع قائمة بالألوان مع كل تدرجاتها.
    كل لون يمثل tuple: (اسم العرض، كود HEX)
    """
    # مثال تدرجات الألوان الأساسية
    colors = [
        ("Red", "#FF0000"), ("Light Red", "#FF6666"), ("Dark Red", "#990000"),
        ("Blue", "#0000FF"), ("Light Blue", "#6699FF"), ("Dark Blue", "#000099"),
        ("Green", "#008000"), ("Light Green", "#66FF66"), ("Dark Green", "#004400"),
        ("Black", "#000000"), ("White", "#FFFFFF"), ("Gray", "#808080"),
        ("Yellow", "#FFFF00"), ("Orange", "#FFA500"), ("Purple", "#800080")
    ]
    return colors

def get_available_sizes():
    """إرجاع أحجام قياسية للملابس"""
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL']

def calculate_commission(price, currency, commission_rates):
    """حساب العمولة والسعر النهائي"""
    rate = commission_rates.get(currency, 0.1)
    commission = price * rate
    total_price = price + commission
    return commission, total_price
