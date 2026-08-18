import traceback
from products.models import Products
from products.services.translations import buyer_products_translations
'''
def get_buyer_products_data(*, lang="en", cart_count=0):
    """
    Service:
    - تجهيز بيانات منتجات المشتري عبر الـ ORM
    - عزل كامل للترجمات وتجهيز النصوص لـ React بنفس هيكلية الخدمات السابقة
    - بدون request أو JsonResponse مباشر
    """
    # 1. جلب قاموس الترجمات الأصلي الخاص بالمشروع
    translations = buyer_products_translations()  
    
    # 2. بناء قاموس النصوص (txt/texts) بنفس الأسلوب الموحد في الخدمات الأخرى
    txt = {
        "title": ("buyer_products_title", lang, translations),
        "add_to_cart": ("add_to_cart", lang, translations),
        "added_to_cart": ("added_to_cart", lang, translations),
        "cart": ("cart", lang, translations),
        "no_products": ("no_products", lang, translations),
        "colors_label": ("colors_label", lang, translations),
        "sizes_label": ("sizes_label", lang, translations),
        "languages_label": ("languages_label", lang, translations),
        "price_symbol": ("price_symbol", lang, translations),
    }

    # 3. جلب المنتجات من قاعدة البيانات مع تحديد الحقول المطلوبة
    products_queryset = Products.objects.all().values(
        "id",
        "name",
        "describtion",
        "price",
        "old_price",
        "image_url",
        "category_code",
        "colors",
        "sizes",
        "books_language",
    )
    
    # تحويل الـ QuerySet إلى قائمة بايثون عادية (List) ليتمكن جيسون من قراءتها
    products_list = list(products_queryset)

    # 4. الخرائط الرمزية والرموز التعبيرية (Emojis) إذا كنتِ تحتاجينها لتنسيق الخصائص في React
    color_emoji_map = {...}
    book_language_map = {...}

    # 5. إرجاع النتيجة النهائية المتوافقة تماماً مع واجهة الـ React الخاصة بكِ
    return {
        "success": True,
        "products": products_list,
        "cart_count": cart_count,
        "texts": txt,  # تم استبدال الدالة القديمة بالقاموس الموحد المترجم عبر t()
        "color_emoji_map": color_emoji_map,
        "book_language_map": book_language_map
    }
'''
'''
# داخل ملف services.py (أو الملف الذي يحتوي على دالة جلب المنتجات)

import traceback  # لطباعة شجرة الخطأ والأسطر المتسببة بالمشكلة

def get_buyer_products_data(*, lang="en", cart_count=0):
    """
    Service:
    - تجهيز بيانات منتجات المشتري عبر الـ ORM
    - عزل كامل للترجمات وتجهيز النصوص لـ React بنفس هيكلية الخدمات السابقة
    - حماية الدالة وصيد أخطاء الجداول المفقودة (مثل صور المنتجات) عبر الـ breakpoint
    """
    try:
        # 1. جلب قاموس الترجمات الأصلي الخاص بالمشروع
        translations = buyer_products_translations(lang)  
        
        # 2. بناء قاموس النصوص (txt/texts) المترجمة للـ React
        txt = {
            "title": ("buyer_products_title", lang, translations),
            "add_to_cart": ("add_to_cart", lang, translations),
            "added_to_cart": ("added_to_cart", lang, translations),
            "cart": ("cart", lang, translations),
            "no_products": ("no_products", lang, translations),
            "colors_label": ("colors_label", lang, translations),
            "sizes_label": ("sizes_label", lang, translations),
            "languages_label": ("languages_label", lang, translations),
            "price_symbol": ("price_symbol", lang, translations),
            "server_error": ("server_error", lang, translations), # نص احتياطي لحالة الخطأ
        }

        # 3. جلب المنتجات من قاعدة البيانات مع تحديد الحقول المطلوبة عبر الـ ORM
        # ملاحظة: إذا كان الخطأ (Table doesn't exist) بسبب حقل معين أو جدول مرتبط، السيرفر سيقف هنا فوراً
        products_queryset = Products.objects.all().values(
            "id",
            "name",
            "describtion",
            "price",
            "old_price",
            "image_url",
            "category_code",
            "colors",
            "sizes",
            "books_language",
        )
        
        # تحويل الـ QuerySet إلى قائمة بايثون عادية (List) ليتمكن جيسون من قراءتها
        products_list = list(products_queryset)

        # 4. الخرائط الرمزية والرموز التعبيرية (Emojis) لتنسيق الخصائص في React
        color_emoji_map = {...}
        book_language_map = {...}

        # 5. إرجاع النتيجة النهائية الناجحة المتوافقة تماماً مع واجهة الـ React
        return {
            "success": True,
            "products": products_list,
            "cart_count": cart_count,
            "texts": txt,
            "color_emoji_map": color_emoji_map,
            "book_language_map": book_language_map
        }

    except Exception as e:
        # 🎯 نظام كشف الأخطاء المخفية في الترمينال:
        print("\n" + "="*50)
        print("🔴 تم رصد خطأ داخل خدمة المنتجات (get_buyer_products_data):")
        print("="*50)
        
        # طباعة شجرة الخطأ كاملة لتعرفي بأي ملف وأي سطر حدثت المشكلة بالظبط
        traceback.print_exc() 
        
        print("="*50)
        print("⚠️ تم إيقاف السيرفر مؤقتاً. افحصي المتغيرات في السطر التالي عبر الـ Pdb...")
        print("="*50 + "\n")
        
        breakpoint()  # <--- السيرفر سيتجمد هنا في الـ Terminal الخاص بكِ لتعرفي تفاصيل المشكلة
        
        # إرجاع رد آمن للـ React لكي لا ينهار الموقع كاملاً أمام المستخدم
        return {
            "success": False,
            "products": [],
            "cart_count": cart_count,
            "message": f"Server Error: {str(e)}",
            "texts": txt if 'txt' in locals() else {}
        }
'''
'''
def get_buyer_products_data(*, lang="en", cart_count=0):
    """
    Service:
    - تجهيز بيانات منتجات المشتري
    - بدون request
    - بدون JsonResponse
    - مناسب لـ API + React
    """

    products = Products.objects.all().values(
        "id",
        "name",
        "describtion",
        "price",
        "old_price",
        "image_url",
        "category_code",
        "colors",
        "sizes",
        "books_language",
        "stock",
    )

    return {
        "products": list(products),
        "cart_count": cart_count,

        # ✅ النصوص حسب اللغة
        "texts": buyer_products_translations(lang),
    }
'''
#التي استبدلناها ب get_product
'''
def get_buyer_products_data(*, request, lang="en", cart_count=0):

    products_qs = Products.objects.all().order_by("-id")

    products = []

    for p in products_qs:
        products.append({
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "old_price": str(p.old_price) if p.old_price else None,
            "stock": p.stock,
            "category_code": p.category_code,
            "colors": p.colors,
            "sizes": p.sizes,
            "books_language": p.books_language,

            # 🔥 هنا المهم
            "image_url": request.build_absolute_uri(p.base_image.url) if p.base_image else None,
        })

    return {
        "products": products,
        "cart_count": cart_count,
        "texts": buyer_products_translations(lang),
    }
'''
from products.models import Products
from products.serializers.product_serializer import ProductSerializer, ProductDetailSerializer
'''
def get_products(request):

    print("========== GET PRODUCTS ==========")

    products = Products.objects.all().order_by("-id")
    print("Products count:", products.count())

    try:
        serializer = ProductSerializer(
            products,
            many=True,
            context={"request": request}
        )
        serializer = ProductDetailSerializer(
            products,
            many=True,
            context={"request": request}
        )
        print("Serializer created successfully")
        print(serializer.data)

        return {
            "products": serializer.data
        }

    except Exception as e:
        import traceback
        print("ERROR IN SERIALIZER")
        print(str(e))
        print(traceback.format_exc())
        raise
'''
from django.db.models import Prefetch
from products.models import (
    Products,
    ProductVariants,
    Favorite,
)


from products.models import Merchants
def get_products(request):

    print("========== GET PRODUCTS ==========")
    buyer_phone = request.GET.get("buyer_phone", "")
    instagram_username = request.GET.get("instagram_username", "")

    favorite_product_ids = set()
    
    
        
    if buyer_phone:
        favorite_product_ids = set(
            Favorite.objects.filter(buyer_phone=buyer_phone)
            .values_list("product_id", flat=True)
        )
    
    products = (
        Products.objects
        .prefetch_related(
            Prefetch(
                "variants",
                queryset=ProductVariants.objects.filter(is_active=True)
                .prefetch_related("images")
                .order_by("sort_order", "id"),
            ),
            "images",
        )
        .order_by("-id")
    )
    
    if instagram_username:
        merchant = Merchants.objects.filter(
            instagram_username=instagram_username
        ).first()

        if not merchant:
            return {
                "products": [],
                "merchant_not_found": True
            }

        products = products.filter(merchant=merchant)
    print("Products count:", products.count())

    try:
        # serializer = ProductDetailSerializer(
        #     products,
        #     many=True,
        #     context={"request": request},
        # )

        # print("Serializer created successfully")
        # print(serializer.data)
        # products_data = serializer.data
        # for product in products_data:
        #     product["is_favorite"] = product["id"] in favorite_product_ids

        # print("Serializer updated successfully")
        
        # return {
        #     "products": serializer.data
        # }
        serializer = ProductDetailSerializer(
            products,
            many=True,
            context={"request": request},
        )

        products_data = serializer.data

        for product in products_data:
            product["is_favorite"] = product["id"] in favorite_product_ids

        available_categories = list(
            products
            .exclude(category_code__isnull=True)
            .exclude(category_code="")
            .values_list("category_code", flat=True)
            .distinct()
        )

        return {
            "products": products_data,
            "available_categories": available_categories,
        }

    except Exception as e:
        import traceback

        print("ERROR IN SERIALIZER")
        print(str(e))
        print(traceback.format_exc())
        raise
'''
import json
from products.models import Products
from products.services.translations import buyer_products_translations

def get_buyer_products_data(*, lang="en", cart_count=0):
    """
    Service:
    - تجهيز بيانات منتجات المشتري
    - متوافق تماماً مع الجداول الخارجية (managed=False)
    - جلب الصور والألوان الفرعية بدون التسبب في اختفاء البيانات
    """
    
    # 1. جلب البيانات الأساسية للمنتجات باستخدام القيم (نفس كودك القديم الناجح)
    products_queryset = Products.objects.all().values(
        "id",
        "name",
        "describtion",
        "price",
        "old_price",
        "image_url",
        "category_code",
        "colors",
        "sizes",
        "books_language",
    )
    
    products_list = []
    
    # 2. تحويل QuerySet إلى مصفوفة قواميس للمرور عليها وتطعيمها بالبيانات الإضافية
    for prod_dict in products_queryset:
        product_id = prod_dict["id"]
        
        # --- معالجة المقاسات والألوان النصية ---
        sizes_parsed = []
        if prod_dict["sizes"]:
            try:
                sizes_parsed = json.loads(prod_dict["sizes"])
            except Exception:
                sizes_parsed = [s.strip() for s in prod_dict["sizes"].split(',')] if prod_dict["sizes"] else []

        # --- جلب الألوان التابعة للمنتج يدوياً عن طريق الـ id ---
        dynamic_colors = []
        try:
            # نصل للموديل المرتبط من خلال الفلترة المباشرة بالـ id بدلاً من prefetch
            from products.models import ProductColor
            colors_qs = ProductColor.objects.filter(product_id=product_id)
            for col in colors_qs:
                color_img = None
                try:
                    if col.image:
                        color_img = col.image.url
                except Exception:
                    color_img = None
                
                dynamic_colors.append({
                    "id": col.id,
                    "name": col.name,
                    "hex_code": col.hex_code,
                    "image": color_img,
                    "is_available": col.is_available
                })
        except Exception:
            dynamic_colors = []

        # --- جلب الصور الفرعية (المعرض) يدوياً عن طريق الـ id ---
        gallery_images = []
        try:
            from products.models import ProductImages
            images_qs = ProductImages.objects.filter(product_id=product_id)
            for img in images_qs:
                img_url = None
                try:
                    if img.image:
                        img_url = img.image.url
                except Exception:
                    img_url = None
                
                gallery_images.append({
                    "id": img.id,
                    "image_url": img_url,
                    "color": img.color,
                    "alt_text": img.alt_text
                })
        except Exception:
            gallery_images = []

        # --- تحويل الأسعار لـ float لمنع مشاكل الـ JSON Serialization في الـ API ---
        try:
            price_val = float(prod_dict["price"]) if prod_dict["price"] is not None else None
        except Exception:
            price_val = None

        try:
            old_price_val = float(prod_dict["old_price"]) if prod_dict["old_price"] is not None else None
        except Exception:
            old_price_val = None

        # 3. دمج البيانات كلها في قاموس المنتج النهائي بنفس هيكلة الـ React المتوقعة
        products_list.append({
            "id": product_id,
            "name": prod_dict["name"],
            "description": prod_dict["describtion"],
            "price": price_val,
            "old_price": old_price_val,
            "main_image_url": prod_dict["image_url"], # الصورة التي كانت تظهر بنجاح
            "category_code": prod_dict["category_code"],
            "books_language": prod_dict["books_language"],
            "sizes": sizes_parsed,
            "static_colors_text": prod_dict["colors"], 
            "dynamic_colors": dynamic_colors,        
            "gallery": gallery_images            
        })

    # 4. جلب النصوص والترجمات
    try:
        translations = buyer_products_translations(lang)
    except Exception:
        translations = {}

    return {
        "products": products_list,
        "cart_count": cart_count,
        "texts": translations,
    }
'''
from django.shortcuts import get_object_or_404
from products.models import Favorite, Products

from products.models import Favorite
from django.core.exceptions import ObjectDoesNotExist

class FavoriteService:
    @staticmethod
    def toggle_favorite(buyer_phone: str, product_id: int):
        """
        تبديل حالة المفضلة:
        إذا كان المنتج في المفضلة يتم حذفه، وإذا لم يكن موجوداً يتم إضافته.
        """
        favorite, created = Favorite.objects.get_or_create(
            buyer_phone=buyer_phone,
            product_id=product_id
        )

        if not created:
            favorite.delete()
            return {"is_favorite": False, "message": "تم إزالة المنتج من المفضلة"}
        
        return {"is_favorite": True, "message": "تم إضافة المنتج للمفضلة"}

    @staticmethod
    def is_favorite(buyer_phone: str, product_id: int) -> bool:
        """فحص ما إذا كان المنتج مفضلاً لبرقم هذا المشترِي"""
        if not buyer_phone:
            return False
        return Favorite.objects.filter(buyer_phone=buyer_phone, product_id=product_id).exists()


class FavoriteServiceKeeper:
    # ... (دالة toggle_favorite السابقة)

    @staticmethod
    def get_user_favorites(buyer_phone: str):
        """جلب جميع المنتجات التي أضافها المشتري للمفضلة"""
        favorites = Favorite.objects.filter(buyer_phone=buyer_phone).select_related('product')
        return [fav.product for fav in favorites]