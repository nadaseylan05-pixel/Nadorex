from django.db.models import Sum
from products.models import Products, CartItems, OrderItems,Orders, ProductAttribute, CategoryAttributeTranslation, ProductVariantAttributes
from products.utils import get_or_create_session_id
from products.services.translations import cart_translations, confirmed_orders


def add_to_cart_service(*, request, product_id, quantity, lang):
    """
    Service:
    - منطق إضافة منتج للسلة
    - بدون JsonResponse
    - بدون request.POST
    """

    texts = cart_translations(lang)

    # 🛒 session
    session_id = get_or_create_session_id(request)

    # 📦 المنتج
    product = Products.objects.filter(id=product_id).first()
    if not product:
        return {
            "success": False,
            "message": texts["product_not_found"]
        }

    # ➕ إضافة / تحديث
    cart_item, created = CartItems.objects.get_or_create(
        product=product,
        session_id=session_id,
        defaults={"quantity": quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    # 🔢 عداد السلة
    total_count = (
        CartItems.objects
        .filter(session_id=session_id)
        .aggregate(total=Sum("quantity"))
        .get("total") or 0
    )

    return {
        "success": True,
        "message": texts["added_to_cart"],
        "cart_count": total_count
    }

from django.db.models import Sum
from products.models import Products, CartItems
from products.utils import get_or_create_session_id
from products.services.translations import cart_translations

'''
def add_to_cart_service(*, request, product_id, quantity=1, lang="en"):
    """
    Service:
    - منطق إضافة منتج إلى السلة
    - يعتمد على session
    - لا يحتوي JsonResponse
    - مناسب لـ API + React
    """

    texts = cart_translations(lang)

    # 🛒 session
    session_id = get_or_create_session_id(request)

    # 📦 جلب المنتج
    product = Products.objects.filter(id=product_id).first()
    if not product:
        return {
            "success": False,
            "message": texts["product_not_found"],
        }

    # ➕ إضافة / تحديث السلة
    cart_item, created = CartItems.objects.get_or_create(
        product=product,
        session_id=session_id,
        defaults={"quantity": quantity},
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    # 🔢 عدد عناصر السلة
    cart_count = (
        CartItems.objects
        .filter(session_id=session_id)
        .aggregate(total=Sum("quantity"))
        .get("total") or 0
    )

    return {
        "success": True,
        "message": texts["added_to_cart"],
        "cart_count": cart_count,
    }

from django.db import connection
from django.utils import timezone
#from .models import Products  # تأكدي من مسار الاستيراد الصحيح في مشروعك
# استيراد دوال الترجمة الأصلية الخاصة بمشروعكِ من الـ utils
# from .utils import get_translations, buyer_products_translations 
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
    )

    return {
        "products": list(products),
        "cart_count": cart_count,

        # ✅ النصوص حسب اللغة الأصلية الخاصة بكِ
        "texts": buyer_products_translations(lang),
    }

'''
from django.db import transaction
from django import utils  # أو استدعاء timezone مباشرة حسب مشروعك
from django.utils import timezone
import traceback
'''
def checkout_cart_service(*, cart_items, lang="ar"):
    """
    Service:
    - تفكيك مصفوفة الـ LocalStorage القادمة من React.
    - إنشاء الفاتورة النهائية وعناصرها داخل قاعدة البيانات بشكل آمن عبر الـ ORM.
    - عزل كامل للترجمات وتجهيز النصوص لـ React بنفس هيكلية الخدمات السابقة.
    - بدون request أو JsonResponse مباشر أو استخدام connection.cursor.
    """
    # 1. جلب قاموس الترجمات الأصلي الخاص بعملية الدفع/الطلب
    # (تأكدي من إنشاء هذه الدالة في ملف الترجمات لديكِ أو استبدالها بالقاموس المناسب)
    
    translations = checkout_translations()  

    # 2. بناء قاموس النصوص (txt/texts) المترجمة للرد على الواجهة الأمامية
    txt = {
        "cart_empty": t("cart_empty", lang, translations),
        "checkout_success": t("checkout_success", lang, translations),
        "server_error": t("server_error", lang, translations),
    }
    
    
    # التحقق من أن السلة ليست فارغة
    if not cart_items:
        return {
            "success": False, 
            "message": txt["cart_empty"],
            "texts": txt
        }

    try:
        # 3. استخدام المعاملات الذرية (Atomic Transaction) لضمان سلامة البيانات عبر الـ ORM
        with transaction.atomic():
            
            # أ. إنشاء رأس الطلب الرئيسي باستخدام الـ ORM
            # (تأكدي من مطابقة أسماء الحقول والموديل Order مع مشروعك)
            order = Orders.objects.create(
                status='confirmed'
                # حقول created_at و updated_at يتم إضافتها تلقائياً لو تم تعيين auto_now_add في الموديل
            )

            # ب. حلقة التكرار لحفظ العناصر بالتفصيل عبر الـ ORM
            for item in cart_items:
                product_id = int(item.get("id"))
                quantity = int(item.get("quantity", 1))
                price = float(item.get("price", 0))
                color = item.get("color", None)
                size = item.get("size", None)

                # إنشاء عنصر الطلب وربطه بالطلب الرئيسي
                OrderItems.objects.create(
                    order=order, # أو order_id=order.id
                    product_id=product_id,
                    quantity=quantity,
                    price=price,
                    color=color,
                    size=size
                )

        # 4. إرجاع النتيجة النهائية المتوافقة تماماً مع واجهة الـ React الخاصة بكِ
        return {
            "success": True,
            "order_id": order.id,
            "message": txt["checkout_success"],
            "texts": txt
        }

    except Exception as e:
        # طباعة الخطأ في الـ Terminal للمطور فقط
        print(f"🔴 Checkout Service Error: {str(e)}")
        print("🔴 تم ضبط خطأ في السيرفر! تفاصيل شجرة الخطأ:")
        traceback.print_exc()
        return {
            "success": False,
            "message": f"{txt['server_error']}: {str(e)}",
            "texts": txt
        }
'''
from django.db import transaction # تأكد من وجود هذا الاستيراد في أعلى الملف
import traceback # تأكد من وجود هذا الاستيراد أيضاً
'''
def checkout_cart_service(*, cart_items, lang="ar"):
    """
    Service:
    - تفكيك مصفوفة الـ LocalStorage القادمة من React.
    - إنشاء الفاتورة النهائية وعناصرها داخل قاعدة البيانات بشكل آمن عبر الـ ORM.
    """
    
    # الحل هنا: قمنا بتعريف txt بشكل مباشر لكي لا يعترض الكود
    # لاحقاً يمكنك ربطها بدالة الترجمة الخاصة بك t()
    txt = {
        "cart_empty": "عذراً، السلة فارغة." if lang == "ar" else "Cart is empty.",
        "checkout_success": "تم إنشاء الطلب بنجاح!" if lang == "ar" else "Checkout successful!",
        "server_error": "حدث خطأ في الخادم" if lang == "ar" else "Server error",
    }
    
    # التحقق من أن السلة ليست فارغة
    if not cart_items:
        return {
            "success": False, 
            "message": txt["cart_empty"],
            "texts": txt
        }

    try:
        # استخدام المعاملات الذرية (Atomic Transaction) لضمان سلامة البيانات
        with transaction.atomic():
            
            # أ. إنشاء رأس الطلب الرئيسي
            order = Orders.objects.create(
                status='confirmed'
            )

            # ب. حلقة التكرار لحفظ العناصر بالتفصيل
            for item in cart_items:
                product_id = int(item.get("id"))
                quantity = int(item.get("quantity", 1))
                price = float(item.get("price", 0))
                color = item.get("color", None)
                size = item.get("size", None)

                # إنشاء عنصر الطلب وربطه بالطلب الرئيسي
                OrderItems.objects.create(
                    order=order,
                    product_id=product_id,
                    quantity=quantity,
                    price=price,
                    color=color,
                    size=size
                )

        # إرجاع النتيجة النهائية
        return {
            "success": True,
            "order_id": order.id,
            "message": txt["checkout_success"],
            "texts": txt
        }

    except Exception as e:
        # طباعة الخطأ في الـ Terminal للمطور فقط
        print(f"🔴 Checkout Service Error: {str(e)}")
        print("🔴 تم ضبط خطأ في السيرفر! تفاصيل شجرة الخطأ:")
        traceback.print_exc()
        return {
            "success": False,
            "message": f"{txt['server_error']}: {str(e)}",
            "texts": txt
        }
'''
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from products.models import CartItems
from products.models import Orders


AUTO_DELIVER_DAYS = 7



def get_cart_data(*, buyer, lang="en"):
    """
    Service:
    - جلب بيانات السلة
    - بدون request
    - بدون JsonResponse
    - جاهز للـ API + React
    """

    items = CartItems.objects.filter(
        buyer=buyer
    ).select_related(
        "product"
    ).values(
        "id",
        "product__id",
        "product__name",
        "product__price",
        "product__currency",
        "quantity",
        "product__image_url",
    )


    return {
        "items": list(items),
        "count": len(items),
    }




def remove_from_cart(*, buyer, cart_id):
    """
    حذف عنصر من السلة
    """

    deleted, _ = CartItems.objects.filter(
        id=cart_id,
        buyer=buyer
    ).delete()


    return {
        "success": deleted > 0,
        "message":
            "deleted_from_cart"
            if deleted
            else "cart_item_not_found"
    }




'''
@transaction.atomic
def confirm_order(*, buyer, buyer_info):
    """
    تحويل السلة إلى طلبات
    """

    cart_items = CartItems.objects.filter(
        buyer=buyer
    ).select_related(
        "product"
    )


    if not cart_items.exists():

        return {
            "success": False,
            "message": "empty_cart"
        }



    created_orders = []


    for item in cart_items:

        product = item.product


        order = Orders.objects.create(

            buyer=buyer,

            product=product,

            quantity=item.quantity,

            name=buyer_info["name"],

            address=buyer_info["address"],

            phone=buyer_info["phone"],

            email=buyer_info["email"],


            total_price=
            product.price * item.quantity,


            status="processing",

            order_date=timezone.now()
        )


        created_orders.append(order.id)



    # تفريغ السلة بعد الطلب
    cart_items.delete()



    return {

        "success": True,

        "orders": created_orders,

        "message":
        "order_confirmed_successfully"
    }


'''
def decrease_stock(product, quantity):

    if product.stock is None:
        product.stock = 0

    if product.stock < quantity:
        raise Exception("Not enough stock")

    product.stock -= quantity
    product.save()
#قبل تعديل stock
'''
@transaction.atomic
def confirm_order(*, buyer, buyer_info, product_data=None):
    """
    تحويل المنتج القادم من localStorage أو السلة إلى طلب مؤكد
    """
    # إذا كان المنتج مرسلاً مباشرة من الـ React (في حالة الـ localStorage)
    if product_data:
        try:
            from products.models import Products # تأكد من اسم كلاس المودل للمنتجات عندك
            product = Products.objects.get(id=product_data["id"])
            decrease_stock(
                product,
                int(product_data.get("quantity", 1))
            )
            order = Orders.objects.create(
                buyer=buyer,
                product=product,
                quantity=int(product_data.get("quantity", 1)),
                name=buyer_info["name"],
                address=buyer_info["address"],
                phone=buyer_info["phone"],
                email=buyer_info["email"],
                total_price=product.price * int(product_data.get("quantity", 1)),
                status="processing",
                order_date=timezone.now()
            )
            return {
                "success": True,
                "orders": [order.id],
                "message": "order_confirmed_successfully"
            }
        except Exception as e:
            return {"success": False, "message": str(e)}

    # المنطق القديم كخيار احتياطي إذا كانت السلة في قاعدة البيانات
    cart_items = CartItems.objects.filter(buyer=buyer).select_related("product")
    if not cart_items.exists():
        return {
            "success": False,
            "message": "empty_cart"
        }

    created_orders = []
    for item in cart_items:
        product = item.product
        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            quantity=item.quantity,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=product.price * item.quantity,
            status="processing",
            order_date=timezone.now()
        )
        created_orders.append(order.id)

    cart_items.delete()
    return {
        "success": True,
        "orders": created_orders,
        "message": "order_confirmed_successfully"
    }
'''
from django.db import transaction
from django.utils import timezone
from products.models import Products
from products.models import Orders, ProductVariants
#from .stock import decrease_stock, increase_stock  # (لو عندك helper functions)
'''
@transaction.atomic
def confirm_order(*, buyer, buyer_info, product_data=None):

    if product_data:
        product = Products.objects.select_for_update().get(id=product_data["id"])
        qty = int(product_data.get("quantity", 1))

        # 🚨 تحقق من المخزون قبل أي شيء
        if product.stock < qty:
            return {
                "success": False,
                "message": "out_of_stock"
            }

        # 📉 خصم المخزون
        product.stock -= qty
        product.save()

        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            quantity=qty,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=product.price * qty,
            status="Processing",
            order_date=timezone.now()
        )

        return {
            "success": True,
            "orders": [order.id],
            "message": "order_confirmed_successfully"
        }

    # 🧺 cart flow
    cart_items = CartItems.objects.select_related("product").filter(buyer=buyer)

    if not cart_items.exists():
        return {"success": False, "message": "empty_cart"}

    created_orders = []

    for item in cart_items.select_for_update():
        product = item.product

        if product.stock < item.quantity:
            return {
                "success": False,
                "message": f"out_of_stock: {product.name}"
            }

        product.stock -= item.quantity
        product.save()

        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            quantity=item.quantity,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=product.price * item.quantity,
            status="Processing",
            order_date=timezone.now()
        )

        created_orders.append(order.id)

    cart_items.delete()

    return {
        "success": True,
        "orders": created_orders,
        "message": "order_confirmed_successfully"
    }
'''
'''
@transaction.atomic
def confirm_order(*, buyer, buyer_info, product_data=None):
    if product_data:
        **
        product = Products.objects.select_for_update().get(id=product_data["id"])
        qty = int(product_data.get("quantity", 1))
        **
        product = Products.objects.select_for_update().get(id=product_data["id"])

        variant = None

        if product_data.get("variant_id"):
            variant = ProductVariants.objects.select_for_update().get(
                id=product_data["variant_id"],
                product=product
            )

        qty = int(product_data.get("quantity", 1))

        price = variant.price if (
            variant and variant.price is not None
        ) else product.price
        
        #########
        if product.stock < qty:
            return {"success": False, "message": "out_of_stock"}

        product.stock -= qty
        product.save()

        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            quantity=qty,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=product.price * qty,
            status="processing",  # ✅ تم تصحيحها إلى حروف صغيرة
            order_date=timezone.now()
        )

        return {
            "success": True,
            "orders": [order.id],
            "message": "order_confirmed_successfully"
        }

    # 🧺 Cart flow
    cart_items = CartItems.objects.select_related("product").filter(buyer=buyer)

    if not cart_items.exists():
        return {"success": False, "message": "empty_cart"}

    created_orders = []

    for item in cart_items.select_for_update():
        product = item.product

        if product.stock < item.quantity:
            return {"success": False, "message": f"out_of_stock: {product.name}"}

        product.stock -= item.quantity
        product.save()
        ***
        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            quantity=item.quantity,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=product.price * item.quantity,
            status="processing",  # ✅ تم تصحيحها إلى حروف صغيرة
            order_date=timezone.now()
        )
        ***
        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            variant=variant,
            quantity=qty,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=price * qty,
            status="processing",
            order_date=timezone.now()
        )
        created_orders.append(order.id)

    cart_items.delete()

    return {
        "success": True,
        "orders": created_orders,
        "message": "order_confirmed_successfully"
    }
'''
from django.db import transaction
from django.utils import timezone
'''
@transaction.atomic
def confirm_order(*, buyer, buyer_info, product_data=None):
    
    # 🎯 1. مسار الشراء المباشر لمنتج واحد (Single Product Flow)
    if product_data:
        product = Products.objects.select_for_update().get(id=product_data["id"])
        variant = None

        # التحقق من وجود المتغير (Variant) للمنتج
        if product_data.get("variant_id"):
            variant = ProductVariants.objects.select_for_update().get(
                id=product_data["variant_id"],
                product=product
            )

        qty = int(product_data.get("quantity", 1))

        # تحديد السعر: سعر المتغير إذا وجد، وإلا سعر المنتج الأصلي
        price = variant.price if (variant and variant.price is not None) else product.price
        
        # التحقق من المخزون
        if product.stock < qty:
            return {"success": False, "message": "out_of_stock"}

        # تخصيم المخزون وحفظ المنتج
        product.stock -= qty
        product.save()

        # إنشاء الطلب
        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            variant=variant,  # تم إضافته هنا ليتم تخزينه بشكل صحيح
            quantity=qty,
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=price * qty,  # حساب السعر بناءً على السعر الفعلي المستخرج
            status="processing",
            order_date=timezone.now()
        )

        return {
            "success": True,
            "orders": [order.id],
            "message": "order_confirmed_successfully"
        }

    # 🧺 2. مسار الشراء عبر السلة (Cart Flow)
    # جلب عناصر السلة مع عمل select_related للـ product و variant (إذا كان موجوداً في الـ Model لديك)
    cart_items = CartItems.objects.select_related("product").filter(buyer=buyer)

    if not cart_items.exists():
        return {"success": False, "message": "empty_cart"}

    created_orders = []

    # استخدام select_for_update لقفل العناصر أثناء المعالجة لمنع الـ Race Conditions
    for item in cart_items.select_for_update():
        product = item.product
        
        # ملاحظة: إذا كان موديل الـ CartItems يحتوي على حقل variant، قم بفك التعليق عن السطر التالي:
        # item_variant = getattr(item, 'variant', None)
        item_variant = None  # مؤقتاً إذا كانت السلة لا تخزن الـ variant حالياً

        # التحقق من مخزون المنتج لكل عنصر في السلة
        if product.stock < item.quantity:
            return {"success": False, "message": f"out_of_stock: {product.name}"}

        # حساب سعر العنصر الحالي في السلة
        item_price = item_variant.price if (item_variant and item_variant.price is not None) else product.price

        # تخصيم المخزون
        product.stock -= item.quantity
        product.save()

        # إنشاء الطلب لكل عنصر في السلة بشكل منفصل وببياناته الخاصة
        order = Orders.objects.create(
            buyer=buyer,
            product=product,
            variant=item_variant,
            quantity=item.quantity,  # نستخدم الكمية الخاصة بالعنصر الحالي في السلة وليس qty العامة
            name=buyer_info["name"],
            address=buyer_info["address"],
            phone=buyer_info["phone"],
            email=buyer_info["email"],
            total_price=item_price * item.quantity,  # السعر الصحيح للعنصر الحالي مضروباً في كميته
            status="processing",
            order_date=timezone.now()
        )
        created_orders.append(order.id)

    # تفريغ السلة بعد نجاح العملية بالكامل
    cart_items.delete()

    return {
        "success": True,
        "orders": created_orders,
        "message": "order_confirmed_successfully"
    }
'''
import logging
from django.db import transaction
from django.utils import timezone
'''
@transaction.atomic
def confirm_order(*, buyer, buyer_info, product_data=None, cart_items_data=None):
    print("\n" + "="*50)
    print(f"🚀 [CONFIRM ORDER START] Buyer ID: {buyer.id if buyer else 'Anonymous'}")
    print(f"📦 [BUYER INFO]: {buyer_info}")
    print("="*50)

    # 🎯 1. مسار الشراء المباشر لمنتج واحد (Single Product Flow)
    if product_data:
        # ... (كود المنتج الواحد سليم كما هو بدون تغيير) ...
        pass

    # 🧺 2. مسار الشراء عبر السلة (Cart Flow)
    print("📥 [FLOW] Cart Checkout detected.")
    created_orders = []

    # 🚀 التعديل الجوهري هنا:
    # إذا أرسل الفرونت إند قائمة المنتجات مباشرة، نعتمد عليها فوراً لحل مشكلة السلات المفقودة
    if cart_items_data and isinstance(cart_items_data, list):
        print(f"🛒 [FRONTEND CART]: Processing {len(cart_items_data)} items sent directly from React.")
        
        for index, item_data in enumerate(cart_items_data, start=1):
            try:
                product = Products.objects.select_for_update().get(id=item_data["id"])
            except Products.DoesNotExist:
                return {"success": False, "message": f"product_not_found_id_{item_data.get('id')}"}
            
            qty = int(item_data.get("quantity", 1))
            
            if product.stock < qty:
                return {"success": False, "message": f"out_of_stock: {product.name}"}
            
            # خصم المخزون
            product.stock -= qty
            product.save()

            # إنشاء الطلب برقم الهاتف والاسم النظيفين القادمين من استمارة الشحن الحالية
            order = Orders.objects.create(
                buyer=buyer,
                product=product,
                quantity=qty,
                name=buyer_info["name"].strip(),
                address=buyer_info["address"].strip(),
                phone=buyer_info["phone"].strip(), # 👈 الحفظ الصريح والنظيف لمنع اختلاط البيانات
                email=buyer_info["email"].strip(),
                total_price=float(product.price) * qty,
                status="processing",
                order_date=timezone.now()
            )
            created_orders.append(order.id)

        # نقوم بتنظيف السلة في قاعدة البيانات أيضاً إن وجدت كخطوة احتياطية
        CartItems.objects.filter(buyer=buyer).delete()
        
    else:
        # المسار الاحتياطي: الاعتماد على قاعدة البيانات في حال لم يرسل الفرونت إند مصفوفة
        cart_items = CartItems.objects.select_related("product").filter(buyer=buyer)
        if not cart_items.exists():
            print("⚠️ [CART ALERT]: Empty cart in database and no frontend items provided.")
            return {"success": False, "message": "empty_cart"}

        for item in cart_items.select_for_update():
            product = item.product
            if product.stock < item.quantity:
                return {"success": False, "message": f"out_of_stock: {product.name}"}

            product.stock -= item.quantity
            product.save()

            order = Orders.objects.create(
                buyer=buyer,
                product=product,
                quantity=item.quantity,
                name=buyer_info["name"].strip(),
                address=buyer_info["address"].strip(),
                phone=buyer_info["phone"].strip(),
                email=buyer_info["email"].strip(),
                total_price=float(product.price) * item.quantity,
                status="processing",
                order_date=timezone.now()
            )
            created_orders.append(order.id)
        
        cart_items.delete()

    print(f"✅ [SUCCESS] All Cart Orders Created! Order IDs: {created_orders}")
    print("="*50 + "\n")

    return {
        "success": True,
        "orders": created_orders,
        "message": "order_confirmed_successfully"
    }
'''
# @transaction.atomic
# def confirm_order(*, buyer, buyer_info, product_data=None, cart_items_data=None):
#     print("\n" + "="*50)
#     print(f"🚀 [CONFIRM ORDER START] Buyer ID: {buyer.id if buyer else 'Anonymous'}")
#     print(f"📦 [BUYER INFO]: {buyer_info}")
#     print("="*50)

#     # 🎯 1. مسار الشراء المباشر لمنتج واحد (Single Product Flow)
#     if product_data:
#         # ... كود المنتج الواحد الخاص بكِ ...
#         pass

#     # 🧺 2. مسار الشراء عبر السلة (Cart Flow)
#     print("📥 [FLOW] Cart Checkout detected.")
#     created_orders = []

#     if cart_items_data and isinstance(cart_items_data, list):
#         print(f"🛒 [FRONTEND CART]: Processing {len(cart_items_data)} items sent directly from React.")
        
#         # مصفوفة لتجميع معرفات المنتجات لحذفها من السلة لاحقاً
#         product_ids_to_delete = []
        
#         for index, item_data in enumerate(cart_items_data, start=1):
#             try:
#                 product = Products.objects.select_for_update().get(id=item_data["id"])
#             except Products.DoesNotExist:
#                 return {"success": False, "message": f"product_not_found_id_{item_data.get('id')}"}
            
#             qty = int(item_data.get("quantity", 1))
            
#             if product.stock < qty:
#                 return {"success": False, "message": f"out_of_stock: {product.name}"}
            
#             # خصم المخزون
#             product.stock -= qty
#             product.save()

#             # إنشاء الطلب برقم الهاتف والاسم النظيفين
#             order = Orders.objects.create(
#                 buyer=buyer,
#                 product=product,
#                 #merchant=product.merchant,
#                 quantity=qty,
#                 name=buyer_info["name"].strip(),
#                 address=buyer_info["address"].strip(),
#                 phone=buyer_info["phone"].strip(),
#                 email=buyer_info["email"].strip(),
#                 total_price=float(product.price) * qty,
#                 status="processing",
#                 order_date=timezone.now()
#             )
#             created_orders.append(order.id)
#             product_ids_to_delete.append(product.id)

#         # ✨ [التعديل الصحيح]: حذف المنتجات التي تم شراؤها فقط من جدول CartItems لتجنب خطأ الحقل المفقود
#         # بما أننا لا نملك حقل buyer، نقوم بحذف حقول هذه المنتجات مباشرةً لتنظيف السلة
#         if product_ids_to_delete:
#             CartItems.objects.filter(product_id__in=product_ids_to_delete).delete()
        
#     else:
#         # المسار الاحتياطي: إذا لم ترسل الـ React مصفوفة، نعتمد على المنتجات المتاحة في جدول السلة
#         # بما أنه لا يوجد حقل 'buyer'، سنقوم بجلب السلة دون فلتر الـ buyer لتجنب الانهيار، أو بالاعتماد على الـ session إن وُجدت
#         cart_items = CartItems.objects.select_related("product").all() # أو فلترة بـ session_id إذا كان متاحاً لديكِ
        
#         if not cart_items.exists():
#             print("⚠️ [CART ALERT]: Empty cart in database and no frontend items provided.")
#             return {"success": False, "message": "empty_cart"}

#         for item in cart_items.select_for_update():
#             product = item.product
#             if product.stock < item.quantity:
#                 return {"success": False, "message": f"out_of_stock: {product.name}"}

#             product.stock -= item.quantity
#             product.save()
            
#             print("Merchant PK:", product.merchant.pk)
#             print("Merchant ID:", product.merchant_id)
            
#             order = Orders.objects.create(
#                 buyer=buyer,
#                 product=product,
#                 merchant=product.merchant,
#                 quantity=item.quantity,
#                 name=buyer_info["name"].strip(),
#                 address=buyer_info["address"].strip(),
#                 phone=buyer_info["phone"].strip(),
#                 email=buyer_info["email"].strip(),
#                 total_price=float(product.price) * item.quantity,
#                 status="processing",
#                 order_date=timezone.now()
#             )
#             created_orders.append(order.id)
#             print("Saved Merchant:", order.merchant_id)
#         # تفريغ السلة بالكامل
#         cart_items.delete()

#     print(f"✅ [SUCCESS] All Cart Orders Created! Order IDs: {created_orders}")
#     print("="*50 + "\n")
#     print(
#         "Product:", product.id,
#         "Merchant:", product.merchant_id,
#         "Merchant obj:", product.merchant
#     )
#     return {
#         "success": True,
#         "orders": created_orders,
#         "message": "order_confirmed_successfully"
#     }

from django.db import transaction
from django.utils import timezone

# @transaction.atomic
# def confirm_order(*, buyer, buyer_info, product_data=None, cart_items_data=None):
#     print("\n" + "=" * 50)
#     print(f"🚀 [CONFIRM ORDER START] Buyer ID: {buyer.id if buyer else 'Anonymous'}")
#     print(f"📦 [BUYER INFO]: {buyer_info}")
#     print("=" * 50)

#     # شراء منتج واحد (يمكنك إضافة الكود لاحقاً)
#     if product_data:
#         pass

#     print("📥 [FLOW] Cart Checkout detected.")
#     created_orders = []
#     import uuid

#     order_number = uuid.uuid4().hex[:12].upper()
#     # ======================================================
#     # المسار الأساسي: الطلبات القادمة من React
#     # ======================================================
#     if cart_items_data and isinstance(cart_items_data, list):

#         print(f"🛒 [FRONTEND CART]: Processing {len(cart_items_data)} items.")

#         product_ids_to_delete = []

#         for index, item_data in enumerate(cart_items_data, start=1):

#             try:
#                 product = Products.objects.select_for_update().get(
#                     id=item_data["id"]
#                 )
#             except Products.DoesNotExist:
#                 return {
#                     "success": False,
#                     "message": f"product_not_found_id_{item_data.get('id')}"
#                 }

#             qty = int(item_data.get("quantity", 1))

#             if product.stock < qty:
#                 return {
#                     "success": False,
#                     "message": f"out_of_stock: {product.name}"
#                 }

#             # خصم المخزون
#             product.stock -= qty
#             product.save(update_fields=["stock"])

#             print("=" * 40)
#             print("Product:", product.id)
#             print("Merchant:", product.merchant_id)

#             order = Orders.objects.create(
#                 buyer=buyer,
#                 product=product,
#                 merchant=product.merchant,   # ✅ الحل
#                 quantity=qty,
#                 order_number=order_number,
#                 name=buyer_info["name"].strip(),
#                 address=buyer_info["address"].strip(),
#                 phone=buyer_info["phone"].strip(),
#                 email=buyer_info["email"].strip(),
#                 total_price=float(product.price) * qty,
#                 status="processing",
#                 order_date=timezone.now()
#             )

#             print("Saved Merchant:", order.merchant_id)

#             created_orders.append(order.id)
#             product_ids_to_delete.append(product.id)

#         if product_ids_to_delete:
#             CartItems.objects.filter(
#                 product_id__in=product_ids_to_delete
#             ).delete()

#     # ======================================================
#     # المسار الاحتياطي
#     # ======================================================
#     else:

#         cart_items = (
#             CartItems.objects
#             .select_related("product")
#             .select_for_update()
#             .all()
#         )

#         if not cart_items.exists():
#             return {
#                 "success": False,
#                 "message": "empty_cart"
#             }

#         for item in cart_items:

#             product = item.product

#             if product.stock < item.quantity:
#                 return {
#                     "success": False,
#                     "message": f"out_of_stock: {product.name}"
#                 }

#             product.stock -= item.quantity
#             product.save(update_fields=["stock"])

#             print("=" * 40)
#             print("Product:", product.id)
#             print("Merchant:", product.merchant_id)

#             order = Orders.objects.create(
#                 buyer=buyer,
#                 product=product,
#                 merchant=product.merchant,   # ✅ الحل
#                 quantity=item.quantity,
#                 order_number=order_number,
#                 name=buyer_info["name"].strip(),
#                 address=buyer_info["address"].strip(),

#                 phone=buyer_info["phone"].strip(),
#                 email=buyer_info["email"].strip(),
#                 total_price=float(product.price) * item.quantity,
#                 status="processing",
#                 order_date=timezone.now()
#             )

#             print("Saved Merchant:", order.merchant_id)

#             created_orders.append(order.id)

#         cart_items.delete()

#     print("=" * 50)
#     print("✅ Orders Created:", created_orders)
#     print("=" * 50)

#     return {
#         "success": True,
#         "order_number":order_number,
#         "orders": created_orders,
#         "message": "order_confirmed_successfully"
#     }
from django.db import transaction
from django.utils import timezone


def build_order_snapshot(product, variant=None, lang="en"):
    """
    يحفظ نسخة ثابتة من بيانات المنتج والـ Variant وقت الشراء.
    """

    snapshot = {
        "variant": None,
        "product_attributes": [],
        "variant_attributes": [],
    }

    # =====================================================
    # بيانات الـ Variant وقت الشراء
    # =====================================================

    if variant:
        snapshot["variant"] = {
            "id": variant.id,
            "title": variant.title,
            "sku": variant.sku,
            "barcode": variant.barcode,
            "price": str(variant.price) if variant.price is not None else None,
            "old_price": (
                str(variant.old_price)
                if variant.old_price is not None
                else None
            ),
            "currency": variant.currency,
            "color": variant.color,
            "color_hex": variant.color_hex,
            "size": variant.size,
            "book_language": variant.book_language,
            "weight": (
                str(variant.weight)
                if variant.weight is not None
                else None
            ),
        }

    # =====================================================
    # خصائص المنتج الرئيسي
    # =====================================================

    product_attributes = (
        ProductAttribute.objects
        .select_related("attribute")
        .filter(product=product)
    )

    for item in product_attributes:

        attribute = item.attribute

        translation = (
            CategoryAttributeTranslation.objects
            .filter(
                attribute=attribute,
                language=lang
            )
            .first()
        )

        attribute_name = (
            translation.translation
            if translation
            else attribute.name
        )

        if item.value in [None, ""]:
            continue

        snapshot["product_attributes"].append({
            "attribute_id": attribute.id,
            "attribute_name": attribute_name,
            "attribute_type": attribute.attribute_type,
            "value": item.value,
        })

    # =====================================================
    # خصائص الـ Variant
    # =====================================================

    if variant:

        variant_attributes = (
            ProductVariantAttributes.objects
            .select_related(
                "attribute",
                "option"
            )
            .filter(variant=variant)
        )

        for item in variant_attributes:

            attribute = item.attribute

            translation = (
                CategoryAttributeTranslation.objects
                .filter(
                    attribute=attribute,
                    language=lang
                )
                .first()
            )

            attribute_name = (
                translation.translation
                if translation
                else attribute.name
            )

            option_name = None

            if item.option:

                option_name = (
                    getattr(item.option, "name", None)
                    or getattr(item.option, "value", None)
                )

            if (
                item.value in [None, ""]
                and not option_name
            ):
                continue

            snapshot["variant_attributes"].append({
                "attribute_id": attribute.id,
                "attribute_name": attribute_name,
                "attribute_type": attribute.attribute_type,
                "value": item.value,
                "option_name": option_name,
            })

    return snapshot
from products.models import Notifications
from products.services.notification_services import create_new_order_notifications
@transaction.atomic
def confirm_order(
    *,
    buyer,
    buyer_info,
    product_data=None,
    cart_items_data=None
):

    print("\n" + "=" * 60)
    print(
        f"🚀 [CONFIRM ORDER START] "
        f"Buyer ID: {buyer.id if buyer else 'Anonymous'}"
    )
    print(f"📦 BUYER INFO: {buyer_info}")
    print("=" * 60)

    # =====================================================
    # حماية البيانات
    # =====================================================

    lang = buyer_info.get("lang", "en")

    created_orders = []

    import uuid

    order_number = uuid.uuid4().hex[:12].upper()

    # =====================================================
    # CART FROM REACT
    # =====================================================

    if cart_items_data and isinstance(
        cart_items_data,
        list,
        # ####ما اضفته مؤحرا
        # order = Orders.objects.create(

        #     buyer=buyer,

        #     product=product,

        #     merchant=product.merchant,

        #     variant=None,

        #     quantity=qty,

        #     order_number=order_number,

        #     name=buyer_info[
        #         "name"
        #     ].strip(),

        #     address=buyer_info[
        #         "address"
        #     ].strip(),

        #     phone=buyer_info[
        #         "phone"
        #     ].strip(),

        #     email=buyer_info[
        #         "email"
        #     ].strip(),

        #     city=buyer_info.get("city"),
        #     region=buyer_info.get("region"),
        #     building=buyer_info.get("building"),
        #     apartment=buyer_info.get("apartment"),
        #     street=buyer_info.get("street"),
        #     country=buyer_info.get("country"),

        #     total_price=(
        #         product.price * qty
        #     ),

        #     status="processing",

        #     order_date=timezone.now(),

           
        # )
        ##################
    ):

        print(
            f"🛒 [FRONTEND CART] "
            f"Processing {len(cart_items_data)} items."
        )

        product_ids_to_delete = []

        for index, item_data in enumerate(
            cart_items_data,
            start=1
        ):

            print("\n" + "-" * 50)
            print(f"🛍️ ITEM #{index}")
            print(item_data)

            # =================================================
            # المنتج
            # =================================================

            try:

                product = (
                    Products.objects
                    .select_for_update()
                    .select_related("merchant")
                    .get(
                        id=item_data["id"]
                    )
                )

            except Products.DoesNotExist:

                return {
                    "success": False,
                    "message": (
                        "product_not_found_"
                        f"{item_data.get('id')}"
                    )
                }

            # =================================================
            # الكمية
            # =================================================

            try:

                qty = int(
                    item_data.get(
                        "quantity",
                        1
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                return {
                    "success": False,
                    "message": "invalid_quantity"
                }

            if qty <= 0:

                return {
                    "success": False,
                    "message": "invalid_quantity"
                }

            # =================================================
            # Variant
            # =================================================

            variant = None

            variant_id = item_data.get(
                "variant_id"
            )

            if variant_id:

                try:

                    variant = (
                        ProductVariants.objects
                        .select_for_update()
                        .get(
                            id=variant_id,
                            product=product,
                            is_active=True
                        )
                    )

                except ProductVariants.DoesNotExist:

                    return {
                        "success": False,
                        "message": (
                            f"variant_not_found_"
                            f"{variant_id}"
                        )
                    }

            # =================================================
            # المخزون والسعر
            # =================================================

            if variant:

                print(
                    f"Variant: {variant.id}"
                )

                print(
                    f"Variant stock: "
                    f"{variant.stock}"
                )

                if variant.stock < qty:

                    return {
                        "success": False,
                        "message": (
                            f"variant_out_of_stock: "
                            f"{product.name}"
                        )
                    }

                # خصم مخزون النسخة
                variant.stock -= qty

                variant.save(
                    update_fields=[
                        "stock"
                    ]
                )

                # السعر
                unit_price = (
                    variant.price
                    if variant.price is not None
                    else product.price
                )

            else:

                print(
                    "No variant selected"
                )

                print(
                    f"Product stock: "
                    f"{product.stock}"
                )

                if product.stock < qty:

                    return {
                        "success": False,
                        "message": (
                            f"out_of_stock: "
                            f"{product.name}"
                        )
                    }

                # خصم مخزون المنتج
                product.stock -= qty

                product.save(
                    update_fields=[
                        "stock"
                    ]
                )

                unit_price = product.price

            # =================================================
            # Snapshot
            # =================================================

            snapshot = build_order_snapshot(
                product=product,
                variant=variant,
                lang=lang
            )

            print(
                "📸 ORDER SNAPSHOT:"
            )

            print(snapshot)

            # =================================================
            # بيانات إضافية سريعة للطلب
            # =================================================

            chosen_color = None
            chosen_size = None
            book_language = None

            if variant:

                chosen_color = (
                    variant.color_hex
                    or variant.color
                )

                chosen_size = (
                    variant.size
                )

                book_language = (
                    variant.book_language
                )

            # =================================================
            # إنشاء الطلب
            # =================================================

            order = Orders.objects.create(

                buyer=buyer,

                product=product,

                merchant=product.merchant,

                variant=variant,

                quantity=qty,

                order_number=order_number,

                name=buyer_info[
                    "name"
                ].strip(),

                address=buyer_info[
                    "address"
                ].strip(),

                phone=buyer_info[
                    "phone"
                ].strip(),

                email=buyer_info[
                    "email"
                ].strip(),

                city=buyer_info.get("city"),
                region=buyer_info.get("region"),
                building=buyer_info.get("building"),
                apartment=buyer_info.get("apartment"),
                street=buyer_info.get("street"),
                country=buyer_info.get("country"),
                
                total_price=(
                    unit_price * qty
                ),

                status="processing",

                order_date=timezone.now(),

                chosen_color=chosen_color,

                chosen_size=chosen_size,

                book_language=book_language,

                attributes_snapshot=snapshot,
            )

            print(
                f"✅ ORDER CREATED: {order.id}"
            )

            print(
                f"Merchant: "
                f"{order.merchant_id}"
            )

            print(
                f"Variant: "
                f"{order.variant_id}"
            )
            Notifications.objects.create(
            merchant=product.merchant,
            order=order,
            notification_type="new_order"
)

            created_orders.append(
                order.id
            )

            product_ids_to_delete.append(
                product.id
            )

        # =====================================================
        # حذف المنتجات من السلة
        # =====================================================

        if product_ids_to_delete:

            CartItems.objects.filter(
                product_id__in=
                product_ids_to_delete
            ).delete()

    # =====================================================
    # FALLBACK CART
    # =====================================================

    else:

        cart_items = (
            CartItems.objects
            .select_related(
                "product"
            )
            .select_for_update()
            .all()
        )

        if not cart_items.exists():

            return {
                "success": False,
                "message": "empty_cart"
            }

        for item in cart_items:

            product = item.product

            qty = item.quantity

            if product.stock < qty:

                return {
                    "success": False,
                    "message": (
                        f"out_of_stock: "
                        f"{product.name}"
                    )
                }

            product.stock -= qty

            product.save(
                update_fields=[
                    "stock"
                ]
            )

            snapshot = build_order_snapshot(
                product=product,
                variant=None,
                lang=lang
            )

            order = Orders.objects.create(

                buyer=buyer,

                product=product,

                merchant=product.merchant,

                variant=None,

                quantity=qty,

                order_number=order_number,

                name=buyer_info[
                    "name"
                ].strip(),

                address=buyer_info[
                    "address"
                ].strip(),

                phone=buyer_info[
                    "phone"
                ].strip(),

                email=buyer_info[
                    "email"
                ].strip(),

                total_price=(
                    product.price * qty
                ),

                status="processing",

                order_date=timezone.now(),

                attributes_snapshot=snapshot,
            )

            created_orders.append(
                order.id
            )

        cart_items.delete()

    # =====================================================
    # SUCCESS
    # =====================================================

    print("\n" + "=" * 60)
    print(
        f"✅ ORDERS CREATED: "
        f"{created_orders}"
    )
    print(
        f"🧾 ORDER NUMBER: "
        f"{order_number}"
    )
    print("=" * 60)
    # =====================================================
    # إشعارات البائعين
    # =====================================================

    created_order_objects = (
        Orders.objects
        .select_related("merchant", "buyer")
        .filter(id__in=created_orders)
    )

    notifications = create_new_order_notifications(
        created_order_objects
    )
    # =====================================================
    # PUSH NOTIFICATIONS
    # =====================================================

    from products.services.firebase_service import send_push_notification

    for order in created_order_objects:

        merchant = order.merchant
        print("🔔 PUSH DEBUG")
        print("Order:", order.id)
        print("Merchant:", merchant)
        print("Merchant ID:", order.merchant_id)
        print("FCM TOKEN:", merchant.fcm_token if merchant else None)
        if merchant and merchant.fcm_token:

            try:
                send_push_notification(
                    merchant.fcm_token,
                    "طلب جديد 🛍️",
                    f"لديك طلب جديد رقم {order.order_number}"
                )

                print(
                    f"📲 PUSH SENT TO MERCHANT: {merchant.email}"
                )

            except Exception as e:

                print(
                    f"❌ PUSH NOTIFICATION ERROR "
                    f"FOR {merchant.email}: {repr(e)}"
                )
    print(
        f"🔔 NEW ORDER NOTIFICATIONS CREATED: "
        f"{len(notifications)}"
    )
    return {
        "success": True,
        "order_number": order_number,
        "orders": created_orders,
        "message": "order_confirmed_successfully"
    }
'''
def auto_deliver_orders(*, buyer=None):
    """
    تحويل الطلبات المشحونة تلقائياً إلى delivered
    بعد 7 أيام
    """

    limit_date = (
        timezone.now()
        -
        timedelta(days=AUTO_DELIVER_DAYS)
    )


    filters = {

        "status": "shipped",

        "delivered_date__isnull": True,

        "order_date__lte": limit_date
    }



    if buyer:
        filters["buyer"] = buyer



    updated = Orders.objects.filter(
        **filters
    ).update(

        status="delivered",

        delivered_date=timezone.now()

    )


    return {

        "updated_orders": updated

    }
'''
from datetime import timedelta
from django.utils import timezone

AUTO_DELIVER_DAYS = 7


def auto_deliver_orders(*, buyer=None):
    """
    تحويل الطلبات المشحونة تلقائياً إلى delivered
    بعد مرور AUTO_DELIVER_DAYS من تاريخ الشحن.
    """

    limit_date = timezone.now() - timedelta(days=AUTO_DELIVER_DAYS)

    filters = {
        "status": "shipped",
        "shipped_date__isnull": False,
        "delivered_date__isnull": True,
        "shipped_date__lte": limit_date,
    }

    if buyer:
        filters["buyer"] = buyer

    orders = Orders.objects.filter(**filters)

    updated = orders.update(
        status="delivered",
        delivered_date=timezone.now(),
    )

    return {
        "updated_orders": updated
    }





def get_confirmed_orders(*, buyer):
    """
    جلب طلبات المشتري
    """


    auto_deliver_orders(
        buyer=buyer
    )



    orders = Orders.objects.filter(
        buyer=buyer
    ).select_related(
        "product"
    ).values(

        "id",

        "product__name",

        "product__id",

        "quantity",

        "total_price",

        "status",

        "order_date",

        "return_status",

        "delivered_date",

        "return_days"

    ).order_by(
        "-order_date"
    )


    return list(orders)

import logging

logger = logging.getLogger(__name__)

# جعلنا المتغيرات الاختيارية تستقبل **kwargs لأمان أعلى وتفادي أي تعارض بالـ arguments
from django.http import JsonResponse
from django.views.decorators.http import require_GET
import traceback
def get_confirmed_orders_service(request, lang='ar', phone='', **kwargs):
    # 1️⃣ التقاط الهاتف القادم من الـ View أو من الـ GET parameter لضمان وجوده
    if not phone:
        phone = request.GET.get('phone', '')

    print(f"🔍 الـ Service تبحث الآن عن طلبات الهاتف: '{phone}'")

    # 2️⃣ تعديل منطق الحماية (السماح بالبحث بالهاتف للمشتري الزائر)
    if request.user and request.user.is_authenticated:
        # إذا كان المستخدم مسجلاً (كالمشرف أو التاجر) نأتي بطلباته عبر حسابه
        orders = Orders.objects.filter(user=request.user)
    elif phone:
        # 🎯 الحل السحري: إذا كان زائراً ومعه رقم هاتف، نأتي بطلباته بالهاتف مباشرة وتخطي حماية الـ Session
        orders = Orders.objects.filter(phone=phone)
    else:
        # إذا لم يكن مسجلاً ولم يرسل رقم هاتف من الـ React، هنا فقط نخرج برسالة الخطأ
        return {
            "success": False, 
            "orders": [], 
            "message": "لم يتم توفير رقم هاتف أو حساب مستخدم صالح."
        }

    # 3️⃣ تحويل البيانات بأمان كامل (الكود الذي قمتِ بتطويره وحمايته سابقاً)
    orders_list = []
    for order in orders:
        try:
            if hasattr(order, 'product') and order.product:
                product_name = order.product.name
            else:
                product_name = getattr(order, 'name', '') or "منتج غير معروف"

            raw_price = getattr(order, 'total_price', 0)
            total_price = float(raw_price) if raw_price is not None else 0.0

            order_date_raw = getattr(order, 'order_date', None)
            if order_date_raw and hasattr(order_date_raw, 'strftime'):
                created_at_str = order_date_raw.strftime('%Y-%m-%d %H:%M')
            else:
                created_at_str = 'مؤخراً'

            status_str = getattr(order, 'status', '') or 'مؤكد'

            orders_list.append({
                "order_id": order.id,
                "name": product_name,
                "quantity": getattr(order, 'quantity', 1) or 1,
                "total_price": total_price,
                "status_display": status_str,
                "created_at": created_at_str
            })
            
        except Exception as e:
            print(f"⚠️ خطأ أثناء تحويل الطلب: {str(e)}")
            continue

    return {"success": True, "orders": list(reversed(orders_list))}
def cancel_order(*, buyer, order_id):
    """
    إلغاء الطلب
    فقط processing
    """

    order = Orders.objects.filter(

        id=order_id,

        buyer=buyer

    ).first()



    if not order:

        return {
            "success": False,
            "message": "order_not_found"
        }



    if order.status != "processing":

        return {

            "success": False,

            "message":
            "cannot_cancel_order"

        }




    order.status="cancelled"

    order.save()



    return {

        "success": True,

        "message":
        "order_cancelled_success"

    }







def request_return(*, buyer, order_id):
    """
    طلب إرجاع
    """
    print("request_return called")
    order = Orders.objects.filter(

        id=order_id,

        buyer=buyer

    ).first()



    if not order:

        return {

            "success":False,

            "message":
            "order_not_found"

        }



    if order.status != "delivered":

        return {

            "success":False,

            "message":
            "cannot_return_order"

        }



    if order.return_status:

        return {

            "success":False,

            "message":
            "already_requested_return"

        }



    deadline = (
        order.delivered_date
        +
        timedelta(days=order.return_days or 0)
    )


    if timezone.now() > deadline:

        return {

            "success":False,

            "message":
            "return_period_expired"

        }



    order.return_status="requested"

    order.save()



    return {

        "success":True,

        "message":
        "return_requested_success"

    }

from django.db import transaction

from products.models import CartItems
from products.models import Products


'''
def add_to_cart(*, buyer, product_id, quantity=1):
    """
    إضافة منتج للسلة
    إذا موجود يزيد الكمية
    """

    product = Products.objects.filter(
        id=product_id
    ).first()


    if not product:
        return {
            "success": False,
            "message": "product_not_found"
        }



    cart_item, created = CartItems.objects.get_or_create(

        buyer=buyer,

        product=product,

        defaults={
            "quantity": quantity
        }

    )


    if not created:

        cart_item.quantity += quantity

        cart_item.save()



    return {

        "success": True,

        "message": "added_to_cart"

    }

'''





def update_cart_quantity(*, buyer, cart_id, quantity):
    """
    تعديل كمية المنتج
    """

    item = CartItems.objects.filter(

        id=cart_id,

        buyer=buyer

    ).first()



    if not item:

        return {

            "success":False,

            "message":"cart_item_not_found"

        }



    if quantity <= 0:

        item.delete()

        return {

            "success":True,

            "message":"item_removed"

        }



    item.quantity = quantity

    item.save()



    return {

        "success":True,

        "message":"quantity_updated"

    }




#الزياده

'''
def get_cart_data(*, buyer):

    """
    بيانات السلة للـ React
    """

    items = CartItems.objects.filter(

        buyer=buyer

    ).select_related(

        "product"

    ).values(

        "id",

        "product__id",

        "product__name",

        "product__price",

        "product__currency",

        "product__image_url",

        "quantity"

    )



    cart_count = sum(
        item["quantity"]
        for item in items
    )



    total = sum(

        item["product__price"] *
        item["quantity"]

        for item in items

    )



    return {

        "items": list(items),

        "cart_count": cart_count,

        "cart_total": total

    }
'''

from django.db.models import F
# تأكدي من استيراد الموديلات الخاصة بكِ هنا، مثلاً:
# from apps.orders.models import OrderItems, Orders 
'''
def get_confirmed_orders_service(*, request, lang="ar"):
    """
    Service:
    - جلب الطلبات المؤكدة للمشتري عبر Django ORM (بدون connection.cursor)
    - عزل كامل للترجمات والرموز التعبيرية وتجهيزها لـ React
    - حماية الـ Session وإرجاع JSON آمن
    """
    # 1. فحص الـ Session والأمان أولاً لمنع تحويل الـ React إلى صفحة HTML تسجيل الدخول
    if not request.user.is_authenticated:
        return {
            "success": False,
            "orders": [],
            "message": "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً." if lang == "ar" else "Session expired. Please log in again."
        }

    # 2. تجهيز النصوص والترجمات
    #translations = get_translations()  # الدالة الأصلية الخاصة بكِ لجلب الترجمات
    "texts": confirmed_orders(lang)
    

    try:
        # 3. جلب البيانات باستخدام Django ORM بدلاً من الـ Raw SQL
        # نقوم بجلب تفاصيل عناصر الطلب (OrderItems) المرتبطة بالطلبات المؤكدة (confirmed) للمستخدم الحالي
        # نستخدم F لمشابهة الـ JOIN وجلب الحقول من الجداول المرتبطة مباشرة
        
        confirmed_items_queryset = OrderItems.objects.filter(
            order__user=request.user,  # ربط الطلب بالمستخدم الحالي صاحب الـ Session
            order__status='confirmed'  # تصفية الحالات المؤكدة فقط
        ).annotate(
            order_id=F('order__id'),
            product_name=F('product__name'),
            status=F('order__status'),
            created_at=F('order__created_at')
        ).order_by('-created_at').values(
            'order_id',
            'product_name',
            'quantity',
            'price',
            'status',
            'created_at',
            'color',
            'size'
        )

        orders_list = []
        for item in confirmed_items_queryset:
            orders_list.append({
                'id': item['order_id'],
                'product_name': item['product_name'],
                'quantity': item['quantity'],
                'price': float(item['price']) if item['price'] else 0.0,
                'status': item['status'],
                # تنسيق التاريخ تماماً كما كان في كودك الأصلي
                'order_date': item['created_at'].strftime("%Y-%m-%d %H:%M") if item['created_at'] else "",
                'color': item['color'],
                'size': item['size']
            })

        # الخرائط الرمزية كما وردت في كودكِ الأصلي تماماً
        color_emoji_map = {...}
        book_language_map = {...}

        return {
            "success": True,
            "orders": orders_list,
            #"txt": texts,
            "color_emoji_map": color_emoji_map,
            "book_language_map": book_language_map
        }

    except Exception as e:
        # حماية السيرفر من الانهيار وإرجاع خطأ نظيف بصيغة ديكشنري ليتحول لـ JSON
        return {
            "success": False,
            "orders": [],
            "message": f"Database or Server Error: {str(e)}",
            #"txt": txt,
            "color_emoji_map": {},
            "book_language_map": {}
        }
'''
from django.db.models import F
# تأكدي من استيراد الموديلات الصحيحة (مثلاً الموديل الخاص بـ OrderItems)
'''
def get_confirmed_orders_service(*, request, lang="ar"):
    """
    Service:
    - جلب الطلبات المؤكدة للمشتري عبر Django ORM (بدون connection.cursor)
    - عزل كامل للترجمات والرموز التعبيرية وتجهيزها لـ React
    - حماية الـ Session وإرجاع JSON آمن
    """
    # 1. فحص الـ Session والأمان أولاً لمنع تحويل الـ React إلى صفحة HTML تسجيل الدخول
    if not request.user.is_authenticated:
        return {
            "success": False,
            "orders": [],
            "message": "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً." if lang == "ar" else "Session expired. Please log in again."
        }

    # 2. تجهيز النصوص وجلبها حسب لغة المشتري بالطريقة الصحيحة وإسنادها لمتغير
    orders_texts = confirmed_orders(lang)
    
    try:
        # 3. جلب البيانات باستخدام Django ORM بدلاً من الـ Raw SQL
        confirmed_items_queryset = OrderItems.objects.filter(
            order__user=request.user,  # ربط الطلب بالمستخدم الحالي صاحب الـ Session
            order__status='confirmed'  # تصفية الحالات المؤكدة فقط
        ).annotate(
            order_id=F('order__id'),
            product_name=F('product__name'),
            status=F('order__status'),
            created_at=F('order__created_at')
        ).order_by('-created_at').values(
            'order_id',
            'product_name',
            'quantity',
            'price',
            'status',
            'created_at',
            'color',
            'size'
        )

        orders_list = []
        for item in confirmed_items_queryset:
            orders_list.append({
                'id': item['order_id'],
                'product_name': item['product_name'],
                'quantity': item['quantity'],
                'price': float(item['price']) if item['price'] else 0.0,
                'status': item['status'],
                # تنسيق التاريخ تماماً كما كان في كودك الأصلي
                'order_date': item['created_at'].strftime("%Y-%m-%d %H:%M") if item['created_at'] else "",
                'color': item['color'],
                'size': item['size']
            })

        # الخرائط الرمزية كما وردت في كودكِ الأصلي تماماً
        color_emoji_map = {...}
        book_language_map = {...}

        return {
            "success": True,
            "orders": orders_list,
            "texts": orders_texts,  # ✅ إرسال النصوص إلى React بنجاح
            "color_emoji_map": color_emoji_map,
            "book_language_map": book_language_map
        }

    except Exception as e:
        # حماية السيرفر من الانهيار وإرجاع خطأ نظيف بصيغة ديكشنري ليتحول لـ JSON
        return {
            "success": False,
            "orders": [],
            "message": f"Database or Server Error: {str(e)}",
            "texts": orders_texts,  # إرسال النصوص حتى في حالة الخطأ لكي لا تنهار الواجهة
            "color_emoji_map": {},
            "book_language_map": {}
        }
'''
from django.db import connection
# لا داعي لاستيراد موديلات أو استخدام ORM معقد هنا، سنعود للـ SQL الذي تفضلينه
'''
def get_confirmed_orders_service(*, request, lang="ar"):
    """
    Service:
    - جلب الطلبات المؤكدة للمشتري عبر الـ Raw SQL مع حماية الـ Session
    """
    
    # 1. فحص الـ Session والأمان (الحل الجذري لمنع خطأ الـ HTML)
    if not request.user.is_authenticated:
        return {
            "success": False,
            "orders": [],
            "message": "Session expired or user not logged in."
        }

    # 2. جلب النصوص والترجمات الخاصة بكِ
    orders_texts = confirmed_orders(lang)

    try:
        orders = []
        
        # 3. الاستعلام المباشر من قاعدة البيانات باستخدام معرف المستخدم request.user.id
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT o.id, p.name, oi.quantity, oi.price, o.status, o.created_at, oi.color, oi.size
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE o.status = 'confirmed' AND o.user_id = %s
                ORDER BY o.created_at DESC
            """, [request.user.id])  # 👈 جلب طلبات المستخدم الحالي فقط بناءً على جلسته
            
            cart_orders = cursor.fetchall()

        for row in cart_orders:
            orders.append({
                'id': row[0],
                'product_name': row[1],
                'quantity': row[2],
                'price': float(row[3]) if row[3] else 0.0,
                'status': row[4],
                'order_date': row[5].strftime("%Y-%m-%d %H:%M") if row[5] else "",
                'color': row[6],
                'size': row[7]
            })

        # الخرائط الرمزية الخاصة بكِ
        color_emoji_map = {...}
        book_language_map = {...}

        return {
            "success": True,
            "orders": orders,
            "texts": orders_texts,
            "color_emoji_map": color_emoji_map,
            "book_language_map": book_language_map
        }

    except Exception as e:
        # إذا حدث أي خطأ برمي داخلي، سيطبع في الـ Terminal وتعود رسالة JSON آمنة بدلاً من الـ 500
        print("❌ الخطأ الحقيقي في السيرفر هو:", str(e))
        return {
            "success": False,
            "orders": [],
            "message": f"Server SQL Error: {str(e)}",
            "texts": orders_texts,
            "color_emoji_map": {},
            "book_language_map": {}
        }
'''
'''
def checkout_cart_service(*, request, cart_items, lang="ar"):
    """
    Service:
    - تفكيك مصفوفة الـ LocalStorage القادمة من React
    - إنشاء الفاتورة النهائية وعناصرها داخل قاعدة البيانات بشكل آمن
    """
    if not cart_items:
        return {
            "success": False, 
            "message": "Cart is empty"
        }

    try:
        from django.db import transaction
        
        with transaction.atomic():
            with connection.cursor() as cursor:
                now = timezone.now()
                
                # 1. إنشاء رأس الطلب الرئيسي
                cursor.execute("""
                    INSERT INTO orders (status, created_at, updated_at)
                    VALUES ('confirmed', %s, %s)
                    RETURNING id;
                """, [now, now])
                order_id = cursor.fetchone()[0]

                # 2. حلقة التكرار لحفظ العناصر بالتفصيل
                for item in cart_items:
                    product_id = int(item.get("id"))
                    quantity = int(item.get("quantity", 1))
                    price = float(item.get("price", 0))
                    color = item.get("color", None)
                    size = item.get("size", None)

                    cursor.execute("""
                        INSERT INTO order_items (order_id, product_id, quantity, price, color, size)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, [order_id, product_id, quantity, price, color, size])

        return {
            "success": True,
            "order_id": order_id
        }

    except Exception as e:
        print(f"🔴 Checkout Service Error: {str(e)}")
        return {
            "success": False,
            "message": f"Server Error: {str(e)}"
        }
'''
'''

from django.db import connection
from django.utils import timezone
# تأكدي من مسار الاستيراد الصحيح في مشروعك
# استيراد دوال الترجمة الأصلية الخاصة بمشروعكِ من الـ utils
from .utils import get_translations, buyer_products_translations 

def get_confirmed_orders_service(*, request, lang="ar"):
    """
    Service:
    - جلب الطلبات المؤكدة للمشتري عبر الـ Raw SQL
    - عزل كامل للترجمات والرموز التعبيرية وتجهيزها لـ React
    """
    translations = get_translations()  # الدالة الأصلية الخاصة بكِ لجلب الترجمات
    
    txt = {
        "title": t("confirmed_orders", lang, translations),
        "product": t("product", lang, translations),
        "quantity": t("quantity", lang, translations),
        "price": t("price", lang, translations),
        "status": t("status", lang, translations),
        "return_status": t("return_status", lang, translations),
        "order_date": t("order_date", lang, translations),
        "action": t("action", lang, translations),
        "cancel_order": t("cancel_order", lang, translations),
        "mark_as_delivered": t("mark_as_delivered", lang, translations),
        "request_return": t("request_return", lang, translations),
        "cancel_return": t("cancel_return", lang, translations),
        "no_orders": t("no_confirmed_orders", lang, translations),
        "color_key": t("color_key", lang, translations),
        "size_key": t("size_key", lang, translations),
        "book_language_key": t("book_language_key", lang, translations),
    }

    orders = []
    
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT o.id, p.name, oi.quantity, oi.price, o.status, o.created_at, oi.color, oi.size
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.status = 'confirmed'
            ORDER BY o.created_at DESC
        """)
        cart_orders = cursor.fetchall()

    for row in cart_orders:
        orders.append({
            'id': row[0],
            'product_name': row[1],
            'quantity': row[2],
            'price': float(row[3]),
            'status': row[4],
            'order_date': row[5].strftime("%Y-%m-%d %H:%M") if row[5] else "",
            'color': row[6],
            'size': row[7]
        })

    # الخرائط الرمزية كما وردت في كودكِ الأصلي تماماً
    color_emoji_map = {...}
    book_language_map = {...}

    return {
        "success": True,
        "orders": orders,
        "txt": txt,
        "color_emoji_map": color_emoji_map,
        "book_language_map": book_language_map
    }


def checkout_cart_service(*, request, cart_items, lang="ar"):
    """
    Service:
    - تفكيك مصفوفة الـ LocalStorage القادمة من React
    - إنشاء الفاتورة النهائية وعناصرها داخل قاعدة البيانات بشكل آمن
    """
    if not cart_items:
        return {
            "success": False, 
            "message": "Cart is empty"
        }

    try:
        from django.db import transaction
        
        with transaction.atomic():
            with connection.cursor() as cursor:
                now = timezone.now()
                
                # 1. إنشاء رأس الطلب الرئيسي
                cursor.execute("""
                    INSERT INTO orders (status, created_at, updated_at)
                    VALUES ('confirmed', %s, %s)
                    RETURNING id;
                """, [now, now])
                order_id = cursor.fetchone()[0]

                # 2. حلقة التكرار لحفظ العناصر بالتفصيل
                for item in cart_items:
                    product_id = int(item.get("id"))
                    quantity = int(item.get("quantity", 1))
                    price = float(item.get("price", 0))
                    color = item.get("color", None)
                    size = item.get("size", None)

                    cursor.execute("""
                        INSERT INTO order_items (order_id, product_id, quantity, price, color, size)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, [order_id, product_id, quantity, price, color, size])

        return {
            "success": True,
            "order_id": order_id
        }

    except Exception as e:
        print(f"🔴 Checkout Service Error: {str(e)}")
        return {
            "success": False,
            "message": f"Server Error: {str(e)}"
        }
'''
from products.models import Orders, OrderLogs
from django.utils import timezone
'''
def cancel_order_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        if (order.status or "").lower() != "processing":
            return {
                "success": False,
                "message": "Cannot cancel order at this stage."
            }

        order.status = "cancelled"
        order.save(update_fields=["status"])

        OrderLogs.objects.create(
            order=order,
            action="cancelled",
            reason=None,
            log_date=timezone.now()
        )

        return {
            "success": True,
            "message": "Order cancelled successfully."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
'''
'''
def cancel_order_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        # 🛑 التعديل هنا: السماح بالإلغاء إذا كانت الحالة pending أو processing
        current_status = (order.status or "").lower()
        if current_status not in ["pending", "processing"]:
            return {
                "success": False,
                # قمنا بإضافة المتغير لكي يخبرك المتصفح بالحالة الفعلية للطلب
                "message": f"Cannot cancel order at this stage. (Current Status is: '{order.status}')"
            }

        # تغيير حالة الطلب إلى ملغي
        order.status = "cancelled"
        order.save(update_fields=["status"])

        # تسجيل العملية في السجلات
        OrderLogs.objects.create(
            order=order,
            action="cancelled",
            reason=None,
            log_date=timezone.now()
        )
        
        return {
            "success": True,
            "message": "Order cancelled successfully."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
'''
from django.utils import timezone

def cancel_order_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        # التحقق من الحالة قبل الحذف لضمان عدم حذف طلب مشحون بالخطأ
        current_status = (order.status or "").strip().lower()
        if current_status not in ["pending", "processing"]:
            return {
                "success": False,
                "message": f"لا يمكن إلغاء أو حذف الطلب في هذه المرحلة. (الحالة الحالية هي: '{order.status}')"
            }

        # 🛑 التعديل الجديد: حذف الطلب نهائياً من قاعدة البيانات
        order.delete()
        
        return {
            "success": True,
            "message": "تم إلغاء وحذف الطلب بنجاح من النظام. 🗑️"
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "الطلب غير موجود بالفعل."
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
from datetime import timedelta
from django.utils import timezone
'''
def buyer_request_return_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        if (order.status or "").lower() != "delivered":
            return {
                "success": False,
                "message": "Only delivered orders can be returned."
            }

        if order.return_status:
            return {
                "success": False,
                "message": "Return already requested."
            }

        if not order.delivered_date:
            return {
                "success": False,
                "message": "Delivered date not set."
            }

        deadline = order.delivered_date + timedelta(days=order.return_days or 0)

        if timezone.now() > deadline:
            return {
                "success": False,
                "message": "Return period expired."
            }

        order.return_status = "requested"
        order.save(update_fields=["return_status"])
        
        return {
            "success": True,
            "message": "Return requested successfully."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
'''
from django.utils import timezone
from datetime import timedelta

def buyer_request_return_service(order_id):
    print("buyer_request_return_service called")
    try:
        order = Orders.objects.get(id=order_id)

        # 1. يجب أن تكون الحالة delivered تماماً
        if (order.status or "").strip().lower() != "delivered":
            return {"success": False, "message": "يمكن فقط إرجاع الطلبات المستلمة."}

        # 2. التحقق من أيام السماح الممنوحة من التاجر (إذا كانت 0 أو أقل لا يسمح بالمرور)
        return_days = order.return_days or 0
        if return_days <= 0:
            return {"success": False, "message": "هذا المنتج غير قابل للإرجاع بناءً على سياسة التاجر."}

        # 3. التحقق من تاريخ التسليم ومرور المهلة
        if not order.delivered_date:
            return {"success": False, "message": "لم يتم تسجيل تاريخ استلام الطلب."}

        deadline = order.delivered_date + timedelta(days=return_days)
        if timezone.now() > deadline:
            return {"success": False, "message": "انتهت فترة الإرجاع المسموح بها للطلب."}

        # تفعيل طلب الإرجاع وتحديث الحالة العامة للطلب
        order.return_status = "requested"
        order.status = "return_requested" 
        order.save(update_fields=["return_status", "status"])

        return {"success": True, "message": "تم تقديم طلب الإرجاع بنجاح."}

    except Orders.DoesNotExist:
        return {"success": False, "message": "الطلب غير موجود."}
    except Exception as e:
        return {"success": False, "message": str(e)}
'''
def cancel_return_request_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        if (order.return_status or "").lower() != "requested":
            return {
                "success": False,
                "message": "No return request found."
            }

        order.return_status = None
        order.save(update_fields=["return_status"])
      
        return {
            "success": True,
            "message": "Return request cancelled successfully."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
'''
from products.models import Orders


def cancel_return_request_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        # يسمح بالإلغاء فقط إذا كان الطلب ما زال معلقاً
        if (
            (order.status or "").lower() != "return_requested"
            or
            (order.return_status or "").lower() != "requested"
        ):
            return {
                "success": False,
                "message": "No pending return request found."
            }

        order.return_status = None
        order.status = "delivered"

        order.save(update_fields=[
            "return_status",
            "status"
        ])

        '''
        notify_merchant_about_order(
            order_id,
            "return_cancelled",
            translations=None
        )
        '''

        return {
            "success": True,
            "message": "Return request cancelled successfully."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
from django.utils import timezone
'''
def mark_order_as_delivered_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        order.status = "delivered"
        order.delivered_date = timezone.now()

        order.save(update_fields=[
            "status",
            "delivered_date"
        ])
        ***
        notify_merchant_about_order(
            order_id,
            "delivered_by_buyer",
            translations=None
        )
        ***
        return {
            "success": True,
            "message": "Order marked as delivered."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
'''
from django.utils import timezone
from products.models import Orders


def mark_order_as_delivered_service(order_id):
    try:
        order = Orders.objects.get(id=order_id)

        # لا يسمح بالتأكيد إلا إذا كان الطلب مشحوناً
        if order.status != "shipped":
            return {
                "success": False,
                "message": "Only shipped orders can be marked as delivered."
            }

        order.status = "delivered"
        order.delivered_date = timezone.now()

        order.save(update_fields=[
            "status",
            "delivered_date"
        ])

        '''
        notify_merchant_about_order(
            order_id,
            "delivered_by_buyer",
            translations=None
        )
        '''

        return {
            "success": True,
            "message": "Order marked as delivered."
        }

    except Orders.DoesNotExist:
        return {
            "success": False,
            "message": "Order not found."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }        
def get_product_details(order):
    """
    إرجاع تفاصيل المنتج المناسبة حسب نوع المنتج.
    """

    product = order.product

    if not product:
        return {}

    category = (product.category_code or "").lower()

    details = {}

    # الملابس - الأحذية - الحقائب
    if category in [
        "fashion",
        "clothes",
        "shoes",
        "bags",
    ]:
        if order.chosen_color:
            details["color"] = order.chosen_color

        if order.chosen_size:
            details["size"] = order.chosen_size

    # الكتب
    elif category == "books_education":
        if order.book_language:
            details["book_language"] = order.book_language

    # الإلكترونيات
    elif category == "electronics":
        if order.chosen_color:
            details["color"] = order.chosen_color

    return details