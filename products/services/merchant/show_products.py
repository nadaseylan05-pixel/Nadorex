from products.models import Products, Categories
from products.utils import load_translations, t
from products.models import (
    ProductVariants,
    ProductVariantAttributes,
    ProductVariantTranslation,
    
)
from products.services.product_translation import (
    translate_variant,
    save_variant_translations,
    translate_product,
    save_product_translations
    
)
'''
#خااااااااااااااااااااااااص بالمشتري  
def load_category_translations(lang):
    """
    تحميل جميع الفئات مع الترجمة حسب اللغة المطلوبة
    { 'cat_code': 'اسم الفئة المترجم' }
    """
    categories = Categories.objects.all()
    return {cat.code: cat.translated_name(lang) for cat in categories}


def show_products_service(merchant_email, lang='en', selected_category=None):
    """
    ترجع قائمة المنتجات مع بياناتها ومعلومات الفئات المترجمة.
    هذه دالة للخدمة، لا تعرض HTML مباشرة.
    """
    category_translations = load_category_translations(lang)

    # تجهيز خيارات الفئات مع "الكل"
    category_display_map = {'all': t('all', lang)}
    category_display_map.update(category_translations)

    # إذا لم يتم اختيار فئة مسبقاً
    if not selected_category:
        # هنا سيتم تمرير الخيار من form في view
        selected_category = 'all'

    # تحويل الاسم المترجم إلى كود إذا جاء من form
    if selected_category == t('all', lang):
        selected_category = 'all'

    # استعلام المنتجات حسب الفئة
    if selected_category == 'all':
        products = Products.objects.filter(merchant_email=merchant_email)
    else:
        if selected_category not in category_translations:
            return {'error': t('error_category_not_found', lang)}
        products = Products.objects.filter(merchant_email=merchant_email, category__code=selected_category)

    # تجهيز البيانات للعرض في template
    product_list = []
    for p in products:
        product_list.append({
            'id': p.id,
            'name': p.name,
            'description': p.describtion,
            'total_price': float(p.total_price),
            'old_price': float(p.old_price) if p.old_price else None,
            'currency': p.currency,
            'image_url': p.image_path.url if p.image_path else '',
        })

    return {
        'products': product_list,
        'categories': category_display_map
    }
'''
from products.models import Products, ProductTranslations, ProductVariants
'''
def get_merchant_products_service(merchant_email, category="_all_"):
    products = Products.objects.filter(merchant_email=merchant_email)
    if category != '_all_':
        products = products.filter(category_code=category)
    return list(products.values('id', 'name', 'price', 'stock','image'))
'''
from products.serializers.product_serializer import ProductSerializer

from products.models import Merchants, ProductVariantImages

def get_merchant_products_service(request, merchant_email, category="_all_"):
    merchant = Merchants.objects.get(email=merchant_email)

    products = Products.objects.filter(merchant=merchant)

    if category != "_all_":
        products = products.filter(category_code=category)
    lang = request.GET.get("lang", "en")
    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request,
                 "lang":lang
                }
    )

    return serializer.data
    # products = Products.objects.filter(merchant=merchant)

    # if category != "_all_":
    #     products = products.filter(category_code=category)

    # products_length = products.count()

    # serializer = ProductSerializer(
    #     products,
    #     many=True,
    #     context={"request": request}
    # )

    # return {
    #     "products": serializer.data,
    #     "products_length": products_length,
    # }
'''
def update_product_service(product_id, merchant_email, data):
    product = Products.objects.get(id=product_id, merchant_email=merchant_email)
    product.name = data.get('name', product.name)
    product.describtion = data.get('describtion', product.describtion)
    product.price = data.get('price', product.price)
    product.currency = data.get('currency', product.currency)
    product.category_code = data.get('category', product.category_code)
    product.save()
    return product
# '''
from products.services.product.add_product import update_product_total_stock
# def update_product_service(product_id, merchant_email, data, files):
#     print("ID", product_id)
#     print("MERCHANT",merchant_email)
    
#     print(
#         Products.objects.filter(id=product_id).values(
#             "id",
#             "merchant_id",
#             "merchant_email"
#         )
#     )
#     product = Products.objects.get(id=product_id, merchant__email=merchant_email)
#     # تحديث الحقول الأساسية (فقط إذا أُرسلت في الطلب)
#     if 'name' in data: product.name = data['name']
#     if 'describtion' in data: product.describtion = data['describtion']
#     if 'price' in data: product.price = data['price']
#     if 'old_price' in data: product.old_price = data['old_price'] if data['old_price'] else None
#     if 'currency' in data: product.currency = data['currency']
#     if 'category_code' in data: product.category_code = data['category_code']
#     if 'category' in data and 'category_code' not in data: product.category_code = data['category']
    
#     # تحديث الصور الأساسية للمنتج إذا أُرسلت
#     if 'base_image' in files:
#         product.base_image = files['base_image']
#     elif 'image' in files:
#         product.base_image = files['image']
        
#     if 'image_url' in data: 
#         product.image_url = data['image_url']
        
#     product.save()

#     # معالجة تحديث الـ Variants إذا أُرسلت في الطلب
#     if 'variants' in data:
#         incoming_variants = data['variants']
#         keep_variant_ids = []

#         for v_data in incoming_variants:
#             v_id = v_data.get('id')
            
#             v_fields = {
#                 "title": v_data.get('title', 'نسخة محدثة'),
#                 "color": v_data.get('color'),
#                 "size": v_data.get('size'),
#                 "book_language": v_data.get('book_language'),
#                 "stock": int(v_data.get('stock', 0)),
#                 "image_url": v_data.get('image_url', ''),
#                 "sort_order": int(v_data.get('sort_order', 0)),
#                 "is_active": str(v_data.get('is_active', 'true')).lower() in ['true', '1']
#             }
            
#             # إذا أرسل الـ React ملف صورة جديد للـ Variant
#             # if 'image' in v_data and not isinstance(v_data['image'], str):
#             #     v_fields['image'] = v_data['image']
#             # التعامل مع ملفات الصور للنسخة
#             if 'images' in v_data and v_data['images']:
#                 # إذا كانت لديك علاقة متعدد لواحد (ProductVariantImage Model)
#                 for img_file in v_data['images']:
#                     if not isinstance(img_file, str): # التأكد أنه ملف وليس رابط قديم
#                         # قم بحفظ الصورة في مودل الصور الإضافية للـ Variant
#                         ProductVariantImages.objects.create(variant=variant_instance, image=img_file)

#             if v_id:
#                 # 1. نسخة موجودة مسبقاً -> نقوم بتحديثها
#                 ProductVariants.objects.filter(id=v_id, product=product).update(**v_fields)
#                 keep_variant_ids.append(int(v_id))
#             else:
#                 # 2. نسخة جديدة -> نقوم بإنشائها
#                 new_variant = ProductVariants.objects.create(product=product, **v_fields)
#                 keep_variant_ids.append(new_variant.id)

#         # 3. حذف الـ Variants المحذوفة من جانب React
#         # أي نسخة تابعة للمنتج وليست ضمن القائمة المرسلة يتم حذفها
#         ProductVariants.objects.filter(product=product).exclude(id__in=keep_variant_ids).delete()

#     # إعادة حساب إجمالي المخزون تلقائيًا للمنتج بناءً على مخزون النسخ الحالي
#     # current_variants = ProductVariants.objects.filter(product=product)
#     # if current_variants.exists():
#     #     product.stock = sum(v.stock for v in current_variants)
#     # elif 'stock' in data:
#     #     product.stock = int(data['stock'])
#     # تحديث مخزون المنتج الرئيسي إذا تم إرساله
#     if 'stock' in data:
#         product.stock = int(data['stock'])
#         product.save(update_fields=["stock"])

#     # إعادة حساب إجمالي المخزون
#     update_product_total_stock(product)

        
#     return product
# معالجة تحديث الـ Variants إذا أُرسلت في الطلب
# def update_product_service(product_id, merchant_email, data, files):
#     # ... الأكواد السابقة الخاصة بتحديث حقول المنتج الرئيسية ...
    
#     product = Products.objects.get(id=product_id, merchant__email=merchant_email)
    
#     # 👈 تأكد أن الشرط ومحتواه يقعان تحت الدالة (4 مسافات أو Tab داخل الدالة)
#     if 'variants' in data:
#         incoming_variants = data['variants']
#         keep_variant_ids = []

#         for v_data in incoming_variants:
#             v_id = v_data.get('id')
            
#             v_fields = {
#                 "title": v_data.get('title', 'نسخة محدثة'),
#                 "color": v_data.get('color'),
#                 "size": v_data.get('size'),
#                 "book_language": v_data.get('book_language'),
#                 "stock": int(v_data.get('stock', 0)),
#                 "image_url": v_data.get('image_url', ''),
#                 "sort_order": int(v_data.get('sort_order', 0)),
#                 "is_active": str(v_data.get('is_active', 'true')).lower() in ['true', '1']
#             }

#             if v_id:
#                 ProductVariants.objects.filter(id=v_id, product=product).update(**v_fields)
#                 variant_instance = ProductVariants.objects.get(id=v_id, product=product)
#                 keep_variant_ids.append(int(v_id))
#             else:
#                 variant_instance = ProductVariants.objects.create(product=product, **v_fields)
#                 keep_variant_ids.append(variant_instance.id)

#             # if 'images' in v_data and v_data['images']:
#             #     for img_file in v_data['images']:
#             #         if not isinstance(img_file, str):
#             #             ProductVariantImages.objects.create(
#             #                 variant=variant_instance, 
#             #                 image=img_file
#             #             )
#             # if v_data.get("image"):
#             #     variant_instance.image = v_data["image"]
#             #     variant_instance.save(update_fields=["image"])
#             if v_data.get("image"):
#                 variant_instance.image = v_data["image"]
#                 variant_instance.save(update_fields=["image"])


#             # ===============================
#             # تحديث خصائص النسخة Variant Attributes
#             # ===============================

#             from products.models import ProductVariantAttributes

#             # حذف الخصائص القديمة للنسخة
#             ProductVariantAttributes.objects.filter(
#                 variant=variant_instance
#             ).delete()


#             variant_attributes = v_data.get("attributes", {})

#             # التأكد أنها dict وليست نص
#             if isinstance(variant_attributes, dict):

#                 for attribute_id, attr_value in variant_attributes.items():

#                     # إذا كانت قيمة من الخيارات Select
#                     if str(attr_value).isdigit():

#                         ProductVariantAttributes.objects.create(
#                             variant=variant_instance,
#                             attribute_id=int(attribute_id),
#                             option_id=int(attr_value)
#                         )

#                     else:
#                         # Text / Number / Color
#                         ProductVariantAttributes.objects.create(
#                             variant=variant_instance,
#                             attribute_id=int(attribute_id),
#                             value=attr_value
#                         )


#             # الصور الإضافية
#             if "extra_images" in v_data:
#                 for img_file in v_data["extra_images"]:
#                     ProductVariantImages.objects.create(
#                         variant=variant_instance,
#                         image=img_file
#                     )

#             if "extra_images" in v_data:
#                 for img_file in v_data["extra_images"]:
#                     ProductVariantImages.objects.create(
#                         variant=variant_instance,
#                         image=img_file
#                     )
            
#         # حذف الـ Variants المزالة
#         ProductVariants.objects.filter(product=product).exclude(id__in=keep_variant_ids).delete()

#     # باقي التحديثات وإرجاع المنتج
#     if 'stock' in data:
#         product.stock = int(data['stock'])
#         product.save(update_fields=["stock"])

#     update_product_total_stock(product)
    
#     return product
# def delete_product_service(product_id, merchant_email):
#     # حذف الترجمات ثم المنتج
#     ProductTranslations.objects.filter(product_id=product_id).delete()
#     return Products.objects.filter(id=product_id, merchant_email=merchant_email).delete()
def update_product_service(product_id, merchant_email, data, files):

    product = Products.objects.get(
        id=product_id,
        merchant__email=merchant_email
    )

    merchant = product.merchant
    if "image" in files:
        product.base_image = files["image"]
        product.save(update_fields=["base_image"])
    # لغة البائع التي اختارها عند التسجيل
    source_language = merchant.merchant_lang or "en"
    # ==========================================
    # تحديث بيانات المنتج الرئيسية
    # ==========================================
    # # if "image" in files:
    # #     product.image = files["image"]
    # #     product.save(
    # #         update_fields=["image"]
    # #     )
    # if "image" in files:
    #     product.image_url = files["image"]
    #     product.base_image = files["image"]

    #     product.save(
    #         update_fields=[
    #             "image_url",
    #             "base_image"
    #         ]
    #     )

    product_text_changed = False

    old_name = product.name
    old_description = product.describtion
    

    if "name" in data:
        product.name = data.get("name")

    if "describtion" in data:
        product.describtion = data.get("describtion", "")

    # التحقق هل تغير الاسم أو الوصف
    if (
        old_name != product.name
        or old_description != product.describtion
    ):
        product_text_changed = True

        product.save(
            update_fields=[
                "name",
                "describtion"
            ]
        )

    # ==========================================
    # تحديث ترجمات المنتج إذا تغير الاسم أو الوصف
    # ==========================================

    if product_text_changed:

        try:

            product_translations = translate_product(
                name=product.name,
                description=product.describtion,
                source_language=source_language
            )

            save_product_translations(
                product=product,
                translations=product_translations
            )

            print(
                "PRODUCT TRANSLATIONS UPDATED:",
                product.id
            )

        except Exception as e:

            print(
                "PRODUCT TRANSLATION ERROR:",
                product.id,
                e
            )
    # ==========================================
    # تحديث Variants
    # ==========================================

    if 'variants' in data:

        incoming_variants = data['variants']
        keep_variant_ids = []

        for v_data in incoming_variants:

            v_id = v_data.get('id')

            v_fields = {
                "title": v_data.get(
                    'title',
                    'نسخة محدثة'
                ),
                "color": v_data.get('color'),
                "size": v_data.get('size'),
                "book_language": v_data.get(
                    'book_language'
                ),
                "stock": int(
                    v_data.get('stock', 0)
                ),
                "image_url": v_data.get(
                    'image_url',
                    ''
                ),
                "sort_order": int(
                    v_data.get('sort_order', 0)
                ),
                "is_active": str(
                    v_data.get(
                        'is_active',
                        'true'
                    )
                ).lower() in [
                    'true',
                    '1'
                ]
            }

            # ==========================================
            # إنشاء أو تحديث الـ Variant
            # ==========================================

            if v_id:

                # جلب الـ Variant القديم أولاً
                variant_instance = ProductVariants.objects.get(
                    id=v_id,
                    product=product
                )

                old_title = variant_instance.title

                # تحديث البيانات
                ProductVariants.objects.filter(
                    id=v_id,
                    product=product
                ).update(**v_fields)

                # تحديث الـ instance
                variant_instance.refresh_from_db()

                keep_variant_ids.append(
                    int(v_id)
                )

                # ==========================================
                # ترجمة فقط إذا تغير Title
                # ==========================================

                if old_title != variant_instance.title:

                    try:

                        variant_translations = translate_variant(
                            title=variant_instance.title,
                            source_language=source_language
                        )

                        save_variant_translations(
                            variant=variant_instance,
                            translations=variant_translations
                        )

                        print(
                            "VARIANT TITLE CHANGED - TRANSLATIONS UPDATED:",
                            variant_instance.id
                        )

                    except Exception as e:

                        print(
                            "VARIANT TRANSLATION ERROR:",
                            variant_instance.id,
                            e
                        )

            else:

                # ==========================================
                # إنشاء Variant جديد
                # ==========================================

                variant_instance = ProductVariants.objects.create(
                    product=product,
                    **v_fields
                )

                keep_variant_ids.append(
                    variant_instance.id
                )

                # ==========================================
                # ترجمة الـ Variant الجديد
                # ==========================================

                try:

                    variant_translations = translate_variant(
                        title=variant_instance.title,
                        source_language=source_language
                    )

                    save_variant_translations(
                        variant=variant_instance,
                        translations=variant_translations
                    )

                    print(
                        "NEW VARIANT TRANSLATIONS SAVED:",
                        variant_instance.id
                    )

                except Exception as e:

                    print(
                        "VARIANT TRANSLATION ERROR:",
                        variant_instance.id,
                        e
                    )

            # ==========================================
            # تحديث صورة الـ Variant الأساسية
            # ==========================================

            if v_data.get("image"):

                variant_instance.image = v_data["image"]

                variant_instance.save(
                    update_fields=["image"]
                )

            # ==========================================
            # تحديث خصائص الـ Variant
            # ==========================================

            ProductVariantAttributes.objects.filter(
                variant=variant_instance
            ).delete()

            variant_attributes = v_data.get(
                "attributes",
                {}
            )

            if isinstance(
                variant_attributes,
                dict
            ):

                for attribute_id, attr_value in (
                    variant_attributes.items()
                ):

                    # Select → option_id
                    if str(attr_value).isdigit():

                        ProductVariantAttributes.objects.create(
                            variant=variant_instance,
                            attribute_id=int(
                                attribute_id
                            ),
                            option_id=int(
                                attr_value
                            )
                        )

                    # Text / Number / Color
                    else:

                        ProductVariantAttributes.objects.create(
                            variant=variant_instance,
                            attribute_id=int(
                                attribute_id
                            ),
                            value=attr_value
                        )

            # ==========================================
            # الصور الإضافية
            # ==========================================

            if "extra_images" in v_data:

                for img_file in v_data["extra_images"]:

                    ProductVariantImages.objects.create(
                        variant=variant_instance,
                        image=img_file
                    )

        # ==========================================
        # حذف الـ Variants التي أزيلت
        # ==========================================

        ProductVariants.objects.filter(
            product=product
        ).exclude(
            id__in=keep_variant_ids
        ).delete()

    # ==========================================
    # تحديث Stock الأساسي للمنتج
    # ==========================================

    if 'stock' in data:

        product.stock = int(
            data['stock']
        )

        product.save(
            update_fields=["stock"]
        )

    # ==========================================
    # تحديث إجمالي المخزون
    # ==========================================

    update_product_total_stock(product)

    return product
def delete_product_service(product_id, merchant_email):
    merchant = Merchants.objects.get(email=merchant_email)

    ProductTranslations.objects.filter(product_id=product_id).delete()

    deleted, _ = Products.objects.filter(
        id=product_id,
        merchant=merchant
    ).delete()

    if deleted == 0:
        raise ValueError("Product not found or you don't own this product")

    return deleted

'''
from django.utils import timezone
from products.models import Orders # افترضي اسم الموديل الخاص بكِ
def update_order_status_service(order_id, merchant_email, data, translations=None):
    # التأكد من أن الطلب يخص هذا التاجر (عبر ربطه بالمنتج مثلاً إذا كان الـ merchant_email في جدول المنتجات)
    # أو إذا كان في جدول الطلبات مباشرة:
    order = Orders.objects.get(id=order_id, product__merchant_email=merchant_email)
    
    new_status = data.get('status')
    if not new_status:
        raise ValueError("Status is required")

    if new_status == 'shipped':
        order.status = new_status
        order.delivered_date = timezone.now()
        order.return_days = data.get('return_days', 0)
    else:
        order.status = new_status

    order.save()

    # إرسال الإيميل بلغة المشتري
    buyer_lang = order.language or "en"
    ***
    # استدعاء دالة إرسال الإيميل الخاصة بكِ
    send_order_status_email(
        to_email=order.email,
        buyer_name=order.name,
        order_id=order.id,
        product_name=order.product.name, # علاقة ForeignKey مع المنتجات
        new_status=new_status,
        return_days=order.return_days,
        lang=buyer_lang,
        translations=translations
    )
    ***
    return order
'''
from django.utils import timezone
from products.models import Orders


# def update_order_status_service(order_id, merchant_email, data, translations=None):

#     order = Orders.objects.get(
#         id=order_id,
#         product__merchant_email=merchant_email
#     )

#     new_status = data.get("status")

#     if not new_status:
#         raise ValueError("Status is required")

#     if new_status == "shipped":
#         order.status = "shipped"
#         order.shipped_date = timezone.now()
#         order.return_days = int(data.get("return_days", 0))

#     else:
#         order.status = new_status

#     order.save()

#     buyer_lang = order.language or "en"

#     return order

from django.utils import timezone


def update_order_status_service(
    order_id,
    merchant_email,
    data,
    translations=None
):

    order = Orders.objects.get(
        id=order_id,
        product__merchant_email=merchant_email
    )

    new_status = data.get("status")

    if not new_status:
        raise ValueError("Status is required")

    new_status = new_status.strip().lower()

    # ==================================================
    # تحديث حالة الطلب
    # ==================================================

    # if new_status == "shipped":

    #     order.status = "shipped"

    #     order.shipped_date = timezone.now()

    #     order.return_days = int(
    #         data.get("return_days", 0)
    #     )
    if new_status == "shipped":

        return_days = data.get("return_days")

        if return_days is None or return_days == "":
            raise ValueError("Return days are required when shipping the order")

        try:
            return_days = int(return_days)
        except (TypeError, ValueError):
            raise ValueError("Return days must be a valid number")

        if return_days < 0:
            raise ValueError("Return days cannot be negative")

        order.status = "shipped"
        order.shipped_date = timezone.now()
        order.return_days = return_days
    elif new_status == "delivered":

        order.status = "delivered"

        order.delivered_date = timezone.now()

    elif new_status in [
        "processing",
        "pending",
        "cancelled",
        "return_requested",
        "return_processing",
        "returned",
        "completed",
    ]:

        order.status = new_status

    else:

        order.status = new_status

    order.save()

    # ==================================================
    # ملاحظة مهمة:
    #
    # delivered لا يعني completed
    #
    # لذلك لا نقوم بالأرشفة هنا.
    #
    # الأرشفة ستحدث لاحقًا بعد انتهاء
    # فترة الإرجاع وعدم وجود إرجاع أو إلغاء.
    # ==================================================

    buyer_lang = order.language or "en"

    return order

from django.utils import timezone
from django.db import transaction


# @transaction.atomic
# def complete_expired_orders_service():

#     now = timezone.now()

#     # ==============================================
#     # الطلبات التي تم تسليمها ولم تؤرشف
#     # ==============================================

#     delivered_orders = Orders.objects.filter(
#         status__iexact="delivered",
#         delivered_date__isnull=False,
#         is_archived=False,
#     )

#     completed_order_numbers = []

#     for order in delivered_orders:

#         # ==========================================
#         # عدد أيام الإرجاع
#         # ==========================================

#         return_days = order.return_days or 0

#         # ==========================================
#         # تاريخ انتهاء فترة الإرجاع
#         # ==========================================

#         return_expiry_date = (
#             order.delivered_date
#             + timezone.timedelta(days=return_days)
#         )

#         # ==========================================
#         # لم تنتهِ فترة الإرجاع بعد
#         # ==========================================

#         if now < return_expiry_date:
#             continue

#         # ==========================================
#         # جلب جميع المنتجات التابعة لنفس الطلب
#         # ==========================================

#         order_items = Orders.objects.filter(
#             merchant=order.merchant,
#             order_number=order.order_number,
#         )

#         # ==========================================
#         # التأكد من عدم وجود إلغاء
#         # ==========================================

#         has_cancelled = order_items.filter(
#             status__iexact="cancelled"
#         ).exists()

#         if has_cancelled:
#             continue

#         # ==========================================
#         # التأكد من عدم وجود إرجاع
#         # ==========================================

#         has_return = order_items.filter(
#             return_status__in=[
#                 "requested",
#                 "processing",
#                 "approved",
#                 "returned",
#             ]
#         ).exists()

#         if has_return:
#             continue

#         # ==========================================
#         # التأكد أن كل منتجات الطلب تم تسليمها
#         # ==========================================

#         all_delivered = not order_items.exclude(
#             status__iexact="delivered"
#         ).exists()

#         if not all_delivered:
#             continue
#         delivered_orders = Orders.objects.filter(
#             status__iexact="delivered",
#             delivered_date__isnull=False,
#             is_archived=False,
#         )

#         print("DELIVERED ORDERS COUNT:", delivered_orders.count())

#         for order in delivered_orders:

#             print(
#                 "ORDER:",
#                 order.order_number,
#                 "| STATUS:", order.status,
#                 "| DELIVERED:", order.delivered_date,
#                 "| RETURN DAYS:", order.return_days,
#                 "| ARCHIVED:", order.is_archived,
#             )
#         # ==========================================
#         # الطلب انتهى بالكامل
#         # ==========================================

#         order_items.update(
#             status="completed",
#             is_archived=True,
#         )

#         completed_order_numbers.append(
#             order.order_number
#         )

#     return completed_order_numbers
from django.utils import timezone
from django.db import transaction


@transaction.atomic
def complete_expired_orders_service():

    now = timezone.now()

    delivered_orders = Orders.objects.filter(
        status__iexact="delivered",
        delivered_date__isnull=False,
        is_archived=False,
    )

    print("========================================")
    print("DELIVERED ORDERS COUNT:", delivered_orders.count())
    print("========================================")

    completed_order_numbers = []

    for order in delivered_orders:

        print("\n----------------------------------------")
        print("CHECKING ORDER:", order.order_number)
        print("STATUS:", order.status)
        print("DELIVERED DATE:", order.delivered_date)
        print("RETURN DAYS:", order.return_days)
        print("ARCHIVED:", order.is_archived)

        return_days = order.return_days or 0

        return_expiry_date = (
            order.delivered_date
            + timezone.timedelta(days=return_days)
        )

        print("RETURN EXPIRY:", return_expiry_date)
        print("NOW:", now)

        # فترة الإرجاع لم تنتهِ
        if now < return_expiry_date:
            print("❌ RETURN PERIOD NOT EXPIRED")
            continue

        print("✅ RETURN PERIOD EXPIRED")

        order_items = Orders.objects.filter(
            merchant=order.merchant,
            order_number=order.order_number,
        )

        print("ORDER ITEMS:", order_items.count())

        has_cancelled = order_items.filter(
            status__iexact="cancelled"
        ).exists()

        print("HAS CANCELLED:", has_cancelled)

        if has_cancelled:
            print("❌ ORDER HAS CANCELLED ITEM")
            continue

        has_return = order_items.filter(
            return_status__in=[
                "requested",
                "processing",
                "approved",
                "returned",
            ]
        ).exists()

        print("HAS RETURN:", has_return)

        if has_return:
            print("❌ ORDER HAS RETURN")
            continue

        all_delivered = not order_items.exclude(
            status__iexact="delivered"
        ).exists()

        print("ALL DELIVERED:", all_delivered)

        if not all_delivered:
            print("❌ NOT ALL ITEMS DELIVERED")
            continue

        # ==========================================
        # الطلب انتهى بالكامل
        # ==========================================

        order_items.update(
            status="completed",
            is_archived=True,
        )

        completed_order_numbers.append(
            order.order_number
        )

        print("✅ ORDER COMPLETED AND ARCHIVED")

    print("\n========================================")
    print("COMPLETED ORDERS:", completed_order_numbers)
    print("========================================")

    return completed_order_numbers
from django.utils import timezone

'''
def update_order_status_service(order_id, merchant_email, data):
    # جلب الطلب والتأكد من تبعيته للمنتج الخاص بالتاجر
    order = Orders.objects.get(id=order_id, product__merchant_email=merchant_email)
    
    new_status = data.get('status')
    if not new_status:
        raise ValueError("Status is required")

    # تحديث الحقول بناءً على الحالة الجديدة
    order.status = new_status
    if new_status == 'shipped':
        order.delivered_date = timezone.now()
        order.return_days = int(data.get('return_days', 0))
    
    # حفظ التعديلات نهائياً في قاعدة البيانات
    order.save()

    # 🖥️ طباعة التحديثات في الترمينال (Terminal) بدلاً من الإيميل
    print("\n" + "🔄"*20)
    print("=== 🔔 تحديث حالة الطلب في الترمينال ===")
    print(f"📦 رقم الطلب: {order.id}")
    print(f"👤 اسم المشتري: {order.name}")
    print(f"📱 هاتف المشتري: {order.phone}")
    print(f"🛍️ المنتج: {order.product.name if order.product else 'غير معروف'}")
    print(f"🟢 الحالة الجديدة: {order.status}")
    if new_status == 'shipped':
        print(f"📅 أيام الإرجاع المحددة: {order.return_days} يوم")
    print("" + "🔄"*20 + "\n")
    
    return order
'''