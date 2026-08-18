import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nadorex.settings")
django.setup()

from django.apps import apps
from django.db import connection


table_order = [
    "categories",
    "category_attributes",
    "category_attribute_options",
    "merchants",
    "buyer_info",
    "shipping_companies",
    "product_requests",
    "category_translations",
    "category_attribute_translations",
    "category_attribute_option_translations",
    "product_attributes",
    "product_translations",
    "buyer_translations",
    "request_translations",
    "translations",
    "notifications",
    "orders",
    "order_items",
    "order_logs",
    "order_shipments",
    "auto_delivery_logs",
    "product_reviews",
]


all_models = {
    model._meta.db_table: model
    for model in apps.get_models()
}


with connection.cursor() as cursor:
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """)
    existing = {row[0] for row in cursor.fetchall()}


with connection.schema_editor() as schema_editor:

    for table in table_order:

        if table in existing:
            print("Already exists:", table)
            continue

        if table not in all_models:
            print("MODEL NOT FOUND:", table)
            continue

        model = all_models[table]

        print("Creating:", table)

        old_managed = model._meta.managed
        model._meta.managed = True

        try:
            schema_editor.create_model(model)
        finally:
            model._meta.managed = old_managed


print("\nDONE")