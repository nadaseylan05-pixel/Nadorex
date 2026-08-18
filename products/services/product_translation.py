import requests

from products.models import ProductVariantTranslation
TRANSLATION_URL = "http://127.0.0.1:5000/translate"

SUPPORTED_LANGUAGES = [
    "ar",
    "en",
    "tr",
    "de",
    "fr",
    "es",
    "zh",
    "ja",
    "ko",
    "sv",
    "it",
]


def translate_text(text, source_language, target_language):
    if not text:
        return ""

    if source_language == target_language:
        return text

    response = requests.post(
        TRANSLATION_URL,
        json={
            "q": text,
            "source": source_language,
            "target": target_language,
        },
        timeout=60,
    )

    response.raise_for_status()

    return response.json().get("translatedText", text)
def translate_variant(title, source_language="en"):
    languages = [
        "ar",
        "en",
        "tr",
        "de",
        "fr",
        "es",
        "zh",
        "ja",
        "ko",
        "sv",
        "it",
    ]

    translations = {}

    for lang in languages:

        if not title:
            translated_title = ""

        elif source_language == lang:
            translated_title = title

        else:
            translated_title = translate_text(
                text=title,
                source_language=source_language,
                target_language=lang
            )

        translations[lang] = {
            "translated_title": translated_title
        }

    return translations
def save_variant_translations(variant, translations):
    print("========== SAVING VARIANT TRANSLATIONS ==========")
    print("VARIANT ID:", variant.id)
    print("TRANSLATIONS:", translations)
    for language_code, data in translations.items():

        ProductVariantTranslation.objects.update_or_create(
            variant=variant,
            language_code=language_code,
            defaults={
                "translated_title": data.get("translated_title", "")
            }
        )

def translate_product(name, description, source_language):

    translations = {}

    for target_language in SUPPORTED_LANGUAGES:

        # اللغة الأصلية
        if target_language == source_language:
            translations[target_language] = {
                "translated_name": name,
                "translated_description": description,
            }
            continue

        # إذا المصدر English نترجم مباشرة
        if source_language == "en":

            translated_name = translate_text(
                name,
                "en",
                target_language
            )

            translated_description = translate_text(
                description,
                "en",
                target_language
            )

        # إذا الهدف English نترجم مباشرة
        elif target_language == "en":

            translated_name = translate_text(
                name,
                source_language,
                "en"
            )

            translated_description = translate_text(
                description,
                source_language,
                "en"
            )

        # باقي الحالات:
        # source → English → target
        else:

            english_name = translate_text(
                name,
                source_language,
                "en"
            )

            english_description = translate_text(
                description,
                source_language,
                "en"
            )

            translated_name = translate_text(
                english_name,
                "en",
                target_language
            )

            translated_description = translate_text(
                english_description,
                "en",
                target_language
            )

        translations[target_language] = {
            "translated_name": translated_name,
            "translated_description": translated_description,
        }

    return translations

from products.models import ProductTranslation


def save_product_translations(product, translations):

    for language_code, content in translations.items():

        ProductTranslation.objects.update_or_create(
            product=product,
            language_code=language_code,
            defaults={
                "translated_name": content["translated_name"],
                "translated_description": content["translated_description"],
                "translated_price": product.price,
                "translated_old_price": product.old_price,
            }
        )