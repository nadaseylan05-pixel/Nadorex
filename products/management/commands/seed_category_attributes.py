from django.core.management.base import BaseCommand
from django.db import transaction

from products.seed_data.category_attributes import DATA

from products.category_attribute_translations import TRANSLATIONS
from products.category_attribute_option_translations import OPTION_TRANSLATIONS

from products.models import (
    CategoryAttribute,
    CategoryAttributeOption,
    CategoryAttributeTranslation,
    CategoryAttributeOptionTranslation,
)


class Command(BaseCommand):
    help = "Seed category attributes and options"

    @transaction.atomic
    def handle(self, *args, **kwargs):

        created_attributes = 0
        created_options = 0

        for category_code, category_data in DATA.items():

            attributes = category_data.get(
                "attributes",
                [],
            )

            for order, item in enumerate(
                attributes,
                start=1,
            ):

                attribute, created = (
                    CategoryAttribute.objects.update_or_create(
                        category_code_id=category_code,
                        name=item["name"],
                        defaults={
                            "attribute_type": item["attribute_type"],
                            "required": item.get(
                                "required",
                                False,
                            ),
                            "display_order": order,
                            "unit": item.get(
                                "unit",
                                None,
                            ),
                        },
                    )
                )

                if created:
                    created_attributes += 1

                # ====================================
                # Attribute Translations
                # ====================================

                translations = TRANSLATIONS.get(
                    attribute.name,
                    {},
                )

                for language, text in translations.items():

                    CategoryAttributeTranslation.objects.update_or_create(
                        attribute=attribute,
                        language=language,
                        defaults={
                            "translation": text,
                        },
                    )

                # ====================================
                # Attribute Options
                # ====================================

                options = item.get(
                    "options",
                    [],
                )

                for option_order, option in enumerate(
                    options,
                    start=1,
                ):

                    option_obj, option_created = (
                        CategoryAttributeOption.objects.update_or_create(
                            attribute=attribute,
                            value=option,
                            defaults={
                                "display_order": option_order,
                            },
                        )
                    )

                    if option_created:
                        created_options += 1

                    # ====================================
                    # Option Translations
                    # ====================================

                    option_translations = OPTION_TRANSLATIONS.get(
                        option,
                        {},
                    )

                    for language, text in option_translations.items():

                        CategoryAttributeOptionTranslation.objects.update_or_create(
                            option=option_obj,
                            language=language,
                            defaults={
                                "translation": text,
                            },
                        )

        self.stdout.write(
            self.style.SUCCESS(
                (
                    f"\n"
                    f"Attributes created : {created_attributes}\n"
                    f"Options created    : {created_options}\n"
                    f"Finished successfully."
                )
            )
        )