from django.utils import timezone
from products.models import Products, ProductImages, CategoryAttributeOption
from products.services.product_translation import (
    translate_variant,
    save_variant_translations,
)

from django.utils import timezone
'''
def create_product(*, data, files):
    # ✅ السعر آمن
    try:
        price = float(data.get("price", 0))
    except (TypeError, ValueError):
        price = 0

    # ✅ الصورة الأساسية (قد تكون None)
    base_image = files.get("image")  # تأكدي أن الاسم يطابق الفورم

    product = Products.objects.create(
        name=data.get("name") or "",
        describtion=data.get("description") or "",
        price=price,
        old_price=data.get("old_price") or None,
        currency=data.get("currency") or "USD",
        base_image=base_image,
        commission=0,
        total_price=price,
        stock=int(data.get("stock") or 0),
        category_id=data.get("category"),
        
    )

    # ✅ الصور الفرعية
    sub_images = files.getlist("sub_images") if files else []
    sub_colors = data.getlist("sub_images_color") if data else []

    for idx, img in enumerate(sub_images):
        ProductImages.objects.create(
            product=product,
            image=img,
            color=sub_colors[idx] if idx < len(sub_colors) else None,
        )

    return product
'''
'''
def create_product(*, data, files):
    price = float(data.get("price") or 0)

    # 📸 أهم إصلاح: image key لازم يكون "image"
    base_image = files.get("image")

    if not data.get("category"):
        raise ValueError("Category is required")

    product = Products.objects.create(
        name=data.get("name") or "",
        describtion=data.get("description") or "",
        price=price,
        old_price=float(data.get("old_price") or 0),
        currency=data.get("currency") or "USD",

        base_image=base_image,

        commission=0,
        total_price=price,
        stock=int(data.get("stock") or 0),

        category_id=data.get("category"),
    )

    # 📸 sub images
    sub_images = files.getlist("sub_images")
    sub_colors = data.getlist("sub_images_color") if hasattr(data, "getlist") else []

    for idx, img in enumerate(sub_images):
        ProductImages.objects.create(
            product=product,
            image=img,
            color=sub_colors[idx] if idx < len(sub_colors) else None,
        )

    return product
'''
from products.models import Products,Categories  # تأكد من استيراد الموديل بالاسم الصحيح المجموع
'''
def create_product(*, data, files):
    price = float(data.get("price") or 0)
    base_image = files.get("image")

    # جلب الكود المرسل من الـ React (مثلاً: 'electronics' أو 'books')
    cat_code = data.get("category") 
    if not cat_code:
        raise ValueError("Category is required")

    # بما أن الموديل يعتمد على حقول نصية، نقوم بحفظ الكود مباشرة
    # وإذا كنت تريد تخزين الاسم الكامل أيضاً، يمكنك جلب الكائن نصياً كالتالي:
    #from products.models import Categories
    try:
        category_obj = Categories.objects.get(code=cat_code)
        category_name = category_obj.code # أو الحقل المسؤول عن الاسم في جدول Categories إن وجد
    except Categories.DoesNotExist:
        category_name = cat_code

    # 🚀 عملية الإنشاء المتوافقة مع الموديل الخاص بك تماماً
    product = Products.objects.create(
        name=data.get("name") or "",
        describtion=data.get("description") or "",
        price=price,
        old_price=float(data.get("old_price") or 0),
        currency=data.get("currency") or "USD",
        base_image=base_image,
        commission=0,
        total_price=price,
        stock=int(data.get("stock") or 0),

        # 👇 التعديل الجوهري هنا: نقوم بحفظ القيم في الحقول النصية المتوفرة بموديلك
        category=category_name,        # سيخزن الاسم أو الكود في حقل category
        category_code=cat_code,       # سيخزن الكود (مثل 'elec') في حقل category_code
        
        # ⚠️ تنبيه هام: موديل المنتجات يتطلب حقل 'merchant' (ForeignKey) ولا يمكن تركه فارغاً!
        # يجب تمرير كائن تاجر (Merchant Object) هنا، وإلا سيرفض الـ Database الحفظ.
        # كمثال مؤقت (تأكد من جلب التاجر الحقيقي المسؤول عن الطلب):
        # merchant=request.user.merchant 
    )

    # 📸 sub images
    sub_images = files.getlist("sub_images")
    sub_colors = data.getlist("sub_images_color") if hasattr(data, "getlist") else []

    for idx, img in enumerate(sub_images):
        ProductImages.objects.create(
            product=product,
            image=img,
            color=sub_colors[idx] if idx < len(sub_colors) else None,
        )

    return product
'''
'''
def create_product(*, data, files):
    price = float(data.get("price") or 0)
    base_image = files.get("image")

    cat_code = data.get("category")
    if not cat_code:
        raise ValueError("Category is required")

    #from .models import Categories
    try:
        category_obj = Categories.objects.get(code=cat_code)
        category_name = category_obj.code
    except Categories.DoesNotExist:
        category_name = cat_code

    # 1. نقوم بإنشاء المنتج بدون حقل الـ stock مؤقتاً لتفادي تعليق الـ ORM
    product = Products.objects.create(
        name=data.get("name") or "",
        describtion=data.get("description") or "",
        price=price,
        old_price=float(data.get("old_price") or 0),
        currency=data.get("currency") or "USD",
        base_image=base_image,
        commission=0,
        total_price=price,
        category=category_name,
        category_code=cat_code,
        # تأكدي من إضافة حقل الـ merchant هنا كما ذكرنا سابقاً إذا كان إجبارياً
    )

    # 2. نقوم بإسناد الـ stock وحفظه بشكل منفصل وجبري
    product.stock = int(data.get("stock") or 0)
    product.save(update_fields=['stock']) # 👈 يجبر Django على تحديث هذا الحقل بعينه

    # 📸 sub images
    sub_images = files.getlist("sub_images")
    sub_colors = data.getlist("sub_images_color") if hasattr(data, "getlist") else []

    for idx, img in enumerate(sub_images):
        ProductImages.objects.create(
            product=product,
            image=img,
            color=sub_colors[idx] if idx < len(sub_colors) else None,
        )

    return product
'''

from products.models import Products, ProductImages, Categories, Merchants
'''
def create_product(*, user, data, files):

    merchant = Merchants.objects.get(user=user)

    price = float(data.get("price") or 0)
    base_image = files.get("image")

    cat_code = data.get("category")
    if not cat_code:
        raise ValueError("Category is required")

    try:
        category_obj = Categories.objects.get(code=cat_code)
        category_name = category_obj.code
    except Categories.DoesNotExist:
        category_name = cat_code

    product = Products.objects.create(
        name=data.get("name") or "",
        describtion=data.get("description") or "",
        price=price,
        old_price=float(data.get("old_price") or 0),
        currency=data.get("currency") or "USD",
        base_image=base_image,
        commission=0,
        total_price=price,
        category=category_name,
        category_code=cat_code,

        merchant=merchant,
        merchant_email=merchant.email,
        store_name=merchant.name,
    )

    product.stock = int(data.get("stock") or 0)
    product.save(update_fields=["stock"])

    sub_images = files.getlist("sub_images")

    if hasattr(data, "getlist"):
        sub_colors = data.getlist("sub_images_color")
    else:
        sub_colors = []

    for idx, img in enumerate(sub_images):
        ProductImages.objects.create(
            product=product,
            image=img,
            color=sub_colors[idx] if idx < len(sub_colors) else None,
        )

    return product
'''
from products.models import Merchants
from products.models import Categories
from products.models import (
    Products,
    ProductImages,
    ProductVariants,
    ProductAttribute
)

'''
def create_product(*, user, data, files):

    merchant = Merchants.objects.get(user=user)

    price = float(data.get("price") or 0)
    base_image = files.get("image")

    cat_code = data.get("category")

    if not cat_code:
        raise ValueError("Category is required")

    try:
        category = Categories.objects.get(code=cat_code)
        category_name = category.code
    except Categories.DoesNotExist:
        category_name = cat_code

    product = Products.objects.create(
        name=data.get("name") or "",
        describtion=data.get("description") or "",
        price=price,
        old_price=float(data.get("old_price") or 0),
        currency=data.get("currency") or "USD",
        base_image=base_image,
        commission=0,
        total_price=price,
        category=category_name,
        category_code=cat_code,
        merchant=merchant,
        merchant_email=merchant.email,
        store_name=merchant.name,
    )

    total_stock = 0

    index = 0

    while True:

        title = data.get(f"variants[{index}][title]")

        color = data.get(f"variants[{index}][color]")

        size = data.get(f"variants[{index}][size]")

        book_language = data.get(
            f"variants[{index}][book_language]"
        )

        stock = int(
            data.get(f"variants[{index}][stock]") or 0
        )

        image = files.get(
            f"variants[{index}][image]"
        )

        image_url = data.get(
            f"variants[{index}][image_url]"
        )

        if (
            title is None
            and color is None
            and size is None
            and book_language is None
            and image is None
            and image_url is None
        ):
            break

        ProductVariants.objects.create(
            product=product,
            title=title,
            color=color,
            size=size,
            book_language=book_language,
            stock=stock,
            image=image,
            image_url=image_url,
            sort_order=index,
            is_active=True,
        )

        total_stock += stock

        index += 1

    # إذا لم يرسل أي Variant ننشئ واحدة افتراضية
    if index == 0:

        stock = int(data.get("stock") or 0)

        ProductVariants.objects.create(
            product=product,
            title="Default",
            stock=stock,
            image=base_image,
            sort_order=0,
            is_active=True,
        )

        total_stock = stock

    product.stock = total_stock
    product.save(update_fields=["stock"])

    # الصور الإضافية القديمة (يمكن حذفها مستقبلاً)
    sub_images = files.getlist("sub_images")

    if hasattr(data, "getlist"):
        sub_colors = data.getlist("sub_images_color")
    else:
        sub_colors = []

    for idx, img in enumerate(sub_images):
        ProductImages.objects.create(
            product=product,
            image=img,
            color=sub_colors[idx] if idx < len(sub_colors) else None,
        )

    return product
'''
from products.models import Products, ProductVariants, ProductVariantImages # تأكدي من استيراد الموديلات الخاصة بكِ
'''
def create_product(user, data, files):
    """
    دالة إنشاء المنتج الأساسي والنسخ التابعة له (Variants)
    مع التعامل مع الصور المرفوعة أو الروابط لكل نسخة.
    """
    # 1. استخراج البيانات الأساسية للمنتج مع وضع قيم افتراضية عند الحاجة
    name = data.get('name')
    describtion = data.get('describtion', '')
    category_id = data.get('category')
    price = data.get('price')
    old_price = data.get('old_price') or None
    currency = data.get('currency', '₺')
    stock = data.get('stock', 0)
    
    # 2. التعامل مع الصورة الأساسية للمنتج (ملف أو رابط)
    base_image = None
    base_image_url = ''
    
    if data.get('image_source') == 'file' and files.get('image'):
        base_image = files.get('image')
    else:
        base_image_url = data.get('image_url', '')

    # 3. إنشاء كائن المنتج الأساسي في قاعدة البيانات
    product = Products.objects.create(
        user=user,
        name=name,
        describtion=describtion,
        category_id=category_id,
        price=price,
        old_price=old_price,
        currency=currency,
        stock=stock,
        image=base_image,       # إذا كان الموديل يدعم FileField/ImageField
        image_url=base_image_url # إذا كان الموديل يدعم URLField
    )

    # 4. استخراج مصفوفة النسخ (Variants) التي قمنا بتجهيزها في الـ API
    variants_data = data.get('variants', [])

    # 5. الدوران حول النسخ وإنشائها واحدة تلو الأخرى وربطها بالمنتج الأساسي
    for v in variants_data:
        v_title = v.get('title', 'نسخة افتراضية')
        v_stock = int(v.get('stock', 0))
        
        # استخراج خيارات الصور الخاصة بالنسخة الحالية
        v_image = v.get('image')  # الملف المرفوع الذي تم استخراجه من request.FILES
        v_image_url = v.get('image_url', '') # الرابط النصي إن وجد

        # إنشاء كائن النسخة (Variant)
        ProductVariants.objects.create(
            product=product,       # الربط بالمنتج الأساسي (ForeignKey)
            title=v_title,
            stock=v_stock,
            image=v_image,         # حفظ ملف الصورة المخصصة للنسخة
            image_url=v_image_url   # أو حفظ الرابط المخصص للنسخة
        )

    return product
'''
# from django.db.models import Sum
# def update_product_total_stock(product):
#     """
#     يحسب إجمالي مخزون المنتج
#     = مخزون المنتج الرئيسي + مخزون جميع النسخ النشطة
#     """

#     variants_stock = (
#         ProductVariants.objects
#         .filter(product=product, is_active=True)
#         .aggregate(total=Sum("stock"))["total"] or 0
#     )

#     product.total_stock = product.stock + variants_stock
#     product.save(update_fields=["total_stock"])

from django.db.models import Sum
from products.services.product_translation import translate_product, save_product_translations
def update_product_total_stock(product):
    variants_stock = (
        ProductVariants.objects
        .filter(product=product, is_active=True)
        .aggregate(total=Sum("stock"))["total"] or 0
    )

    total_stock = product.stock + variants_stock

    Products.objects.filter(pk=product.pk).update(total_stock=total_stock)

    product.total_stock = total_stock
from products.models import ProductVariantAttributes    
def create_product(merchant, data, files):
    # استخراج البيانات الأساسية للمنتج بحقول الموديل الصحيحة
    name = data.get('name')
    describtion = data.get('describtion', '')
    category_code = data.get('category_code') or data.get('category')
    price = data.get('price')
    old_price = data.get('old_price') or None
    currency = data.get('currency', '₺')
    
    # التعامل مع الحقلين base_image و image_url للمنتج
    base_image = files.get('base_image') or files.get('image') or None
    image_url = data.get('image_url', '')
    #merchant = Merchants.objects.get(email=user.email)
    # إنشاء المنتج الأساسي
    print("CATEGORY RECEIVED:", data.get("category"))
    product = Products.objects.create(
        merchant=merchant,
        merchant_email=merchant.email,
     #   merchant=merchant,
        #user=user,
        name=name,
        describtion=describtion,
        category_code=category_code,
        price=price,
        old_price=old_price,
        currency=currency,
        # stock=0, # سيتم تحديثه تلقائيًا بالأسفل بناءً على الـ variants
        stock=int(data.get("stock", 0)),
        total_stock=0,
        base_image=base_image,
        image_url=image_url,
       # merchant=user.username, 
        #merchant_email=user.email,
        #merchant = Merchants.objects.get(email=request.user.email),
        created_at=timezone.now()
    )
    # ==========================================
    # ترجمة اسم ووصف المنتج
    # ==========================================

    source_language = merchant.merchant_lang or "en"

    print("PRODUCT SOURCE LANGUAGE:", source_language)

    # try:
    #     product_translations = translate_product(
    #         name=name,
    #         description=describtion,
    #         source_language=source_language
    #     )

    #     save_product_translations(
    #         product=product,
    #         translations=product_translations
    #     )

    #     print("PRODUCT TRANSLATIONS SAVED SUCCESSFULLY")

    # except Exception as e:
    #     print("PRODUCT TRANSLATION ERROR:", e)
    # print("PRODUCT CATEGORY SAVED:", product.category_code)
    try:
        product_translations = translate_product(
            name=name,
            description=describtion,
            source_language=source_language
        )

        print("TRANSLATIONS RESULT:")
        print(product_translations)

        save_product_translations(
            product=product,
            translations=product_translations
        )

        print("PRODUCT TRANSLATIONS SAVED SUCCESSFULLY")
        print("========== TRANSLATIONS RESULT ==========")
        print(product_translations)

    except Exception as e:
        import traceback
        print("PRODUCT TRANSLATION ERROR:", e)
        traceback.print_exc()
    # حفظ خصائص المنتج الرئيسي
    import json

    product_attributes = data.get("attributes", {})

    print("========== CREATE PRODUCT ATTRIBUTES ==========")
    print("product_attributes =", product_attributes)

    if isinstance(product_attributes, str):
        try:
            product_attributes = json.loads(product_attributes)
        except json.JSONDecodeError:
            product_attributes = {}

    if isinstance(product_attributes, dict):
        for attribute_id, attr_value in product_attributes.items():
            print("ATTRIBUTE ID:", attribute_id)
            print("ATTRIBUTE VALUE:", attr_value)
            if attr_value in [None, ""]:
                continue

            # إذا كانت الخاصية Select
            if isinstance(attr_value, int) or str(attr_value).isdigit():
                print(
                    "CREATING OPTION:",
                    "attribute_id =", attribute_id,
                    "option_id =", attr_value
                )
                # نحتاج هنا option_id، لكن ProductAttribute
                # لا يحتوي option_id حسب الموديل الحالي.
                # لذلك نخزن القيمة في value حاليًا.
                ProductAttribute.objects.create(
                    product=product,
                    attribute_id=int(attribute_id),
                    value=str(attr_value)
                )

            else:
                ProductAttribute.objects.create(
                    product=product,
                    attribute_id=int(attribute_id),
                    value=str(attr_value)
                )
    # إنشاء الصور الإضافية للمنتج إن وجدت (ProductImages)
    ##extra_images = data.get('extra_images', [])
    extra_images = files.getlist('extra_images')
    for img_file in extra_images:
        ProductImages.objects.create(product=product, image=img_file)

    # معالجة الـ Variants وحساب المخزون الإجمالي
    variants_data = data.get('variants', [])
    # total_stock = 0
    # main_stock = int(data.get("stock", 0))
    # total_stock = main_stock
    
    for v in variants_data:
        v_title = v.get('title', 'نسخة افتراضية')
        v_color = v.get('color', None)
        v_size = v.get('size', None)
        v_book_language = v.get('book_language', None)
        v_stock = int(v.get('stock', 0))
        v_sort_order = int(v.get('sort_order', 0))
        v_is_active = str(v.get('is_active', 'true')).lower() in ['true', '1']
        
        v_image = v.get('image', None)
        v_image_url = v.get('image_url', '')
        color_hex=v.get("color_hex")
        # إنشاء كائن الـ Variant
        variant = ProductVariants.objects.create(
            product=product,
            title=v_title,
            color=v_color,
            size=v_size,
            book_language=v_book_language,
            stock=v_stock,
            image=v_image,
            image_url=v_image_url,
            sort_order=v_sort_order,
            is_active=v_is_active,
            color_hex =color_hex
        )
        # ==========================================
        # ترجمة اسم الـVariant
        # ==========================================

        try:

            variant_translations = translate_variant(
                title=v_title,
                source_language=source_language
            )

            save_variant_translations(
                variant=variant,
                translations=variant_translations
            )

            print(
                "VARIANT TRANSLATIONS SAVED:",
                variant.id
            )

        except Exception as e:

            print(
                "VARIANT TRANSLATION ERROR:",
                variant.id,
                e
            )
        # حفظ خصائص النسخة Variant Attributes
        import json
        print("========== CREATE VARIANT ==========")
        print("v =", v)
        print("attributes =", v.get("attributes"))
        variant_attributes = v.get("attributes", {})

        if isinstance(variant_attributes, str):
            try:
                variant_attributes = json.loads(variant_attributes)
            except json.JSONDecodeError:
                variant_attributes = {}

        # for attribute_id, attr_value in variant_attributes.items():

        #     # إذا كانت Select يكون لدينا option_id
        #     if isinstance(attr_value, int) or str(attr_value).isdigit():

        #         ProductVariantAttributes.objects.create(
        #             variant=variant,
        #             attribute_id=int(attribute_id),
        #             option_id=int(attr_value)
        #         )

        #     else:
        #         # Text / Number / Color
        #         ProductVariantAttributes.objects.create(
        #             variant=variant,
        #             attribute_id=int(attribute_id),
        #             value=attr_value
        #         )
        for attribute_id, attr_value in variant_attributes.items():

            if attr_value in [None, ""]:
                continue

            # هل هذا الـAttribute لديه Options في قاعدة البيانات؟
            options_exist = CategoryAttributeOption.objects.filter(
                attribute_id=int(attribute_id)
            ).exists()

            if options_exist:
                # Select → القيمة يجب أن تكون option_id
                ProductVariantAttributes.objects.create(
                    variant=variant,
                    attribute_id=int(attribute_id),
                    option_id=int(attr_value)
                )

            else:
                # Text / Number / Color → نخزن القيمة نفسها
                ProductVariantAttributes.objects.create(
                    variant=variant,
                    attribute_id=int(attribute_id),
                    value=str(attr_value)
                )
        # إضافة المخزون للمجموع
        ##total_stock += v_stock

        # إنشاء صور الـ Variant الإضافية إن وجدت (ProductVariantImages)
        v_extra_images = v.get('extra_images', [])
        for v_img_file in v_extra_images:
            ProductVariantImages.objects.create(variant=variant, image=v_img_file)

   
    # حفظ إجمالي المخزون
    # product.total_stock = total_stock
    # product.save(update_fields=["total_stock"])
    update_product_total_stock(product)


    return product
