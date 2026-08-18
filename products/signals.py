# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from difflib import SequenceMatcher
from .models import ProductRequests, RequestTranslations, ProductTranslations, CategoryTranslations
from .utils import send_product_match_email
from django.conf import settings

# افترضنا أن عندك نموذج Product في تطبيق آخر اسمه products.Product
from products.models import Products  # عدّلي المسار حسب مشروعك

@receiver(post_save, sender=Products)
def notify_and_remove_matched_requests(sender, instance, created, **kwargs):
    if not created:
        return

    new_product_id = instance.id
    new_product_name = getattr(instance, 'name', '')
    new_product_description = getattr(instance, 'description', '')
    new_product_category_code = getattr(instance, 'category_code', '')

    matched_requests = ProductRequests.objects.filter(category=new_product_category_code)

    product_url = f"http://your-domain.com/product/{new_product_id}"

    for req in matched_requests:
        user_lang = req.language or 'en'

        # ترجمة الفئة للمستخدم
        cat_row = CategoryTranslations.objects.filter(category_code=new_product_category_code, language=user_lang).first()
        user_translated_category = cat_row.translation if cat_row else new_product_category_code

        # جلب ترجمة المنتج إن وُجدت
        p_tr = ProductTranslations.objects.filter(product_id=new_product_id, language_code=user_lang).first()
        user_translated_name = p_tr.translated_name if p_tr and p_tr.translated_name else new_product_name
        user_translated_description = p_tr.translated_description if p_tr and p_tr.translated_description else new_product_description

        # نسبة التشابه
        similarity = 0.0
        if user_translated_description and req.description:
            similarity = SequenceMatcher(None, user_translated_description.lower(), req.description.lower()).ratio()

        desc_match = similarity >= 0.5
        cat_match = (req.category == new_product_category_code)

        if cat_match:
            send_product_match_email(
                to_email=req.buyer_email,
                product_name=user_translated_name,
                product_description=user_translated_description,
                product_category=user_translated_category,
                product_url=product_url,
                lang=user_lang
            )

        if cat_match and desc_match:
            # احذف الترجمات ثم الطلب نفسه
            RequestTranslations.objects.filter(request=req).delete()
            req.delete()