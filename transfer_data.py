import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nadorex.settings")
django.setup()

from django.db import connections


# ============================================================
# TABLES TO TRANSFER
# ============================================================

TABLES = [
    "categories",
    "category_attributes",
    "category_attribute_options",

    "merchants",
    "buyer_info",
    "buyer_translations",

    "shipping_companies",

    "product_requests",
    "request_translations",

    "category_translations",
    "category_attribute_translations",
    "category_attribute_option_translations",

    "products",
    "product_variants",
    "product_images",
    "product_translations",

    "translations",
    "product_attributes",

    "orders",
    "order_items",
    "order_logs",
    "order_shipments",

    "auto_delivery_logs",
    "product_reviews",

    "notifications",

    "favorites",
    "cart_items",

    "product_variant_attributes",
    "product_variant_images",
    "products_productcolor",
]


# ============================================================
# IMPORTANT:
# Tables with foreign keys should be transferred first.
# ============================================================

TABLE_ORDER = [
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
    "request_translations",

    "translations",

    "products",
    "product_attributes",

    "product_variants",
    "product_images",
    "product_translations",

    "buyer_translations",

    "orders",
    "order_items",
    "order_logs",
    "order_shipments",

    "auto_delivery_logs",
    "product_reviews",

    "notifications",

    "favorites",
    "cart_items",

    "product_variant_attributes",
    "product_variant_images",
    "products_productcolor",
]


# ============================================================
# CONNECTIONS
# ============================================================

mysql = connections["old_mysql"]
postgres = connections["default"]


def get_mysql_columns(table):
    with mysql.cursor() as cursor:
        cursor.execute(f"SHOW COLUMNS FROM `{table}`")
        rows = cursor.fetchall()

    # SHOW COLUMNS:
    # Field, Type, Null, Key, Default, Extra
    return [row[0] for row in rows]


def get_mysql_rows(table, columns):
    column_sql = ", ".join(f"`{c}`" for c in columns)

    with mysql.cursor() as cursor:
        cursor.execute(
            f"SELECT {column_sql} FROM `{table}`"
        )
        return cursor.fetchall()


def postgres_table_exists(table):
    with postgres.cursor() as cursor:
        cursor.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = %s
            )
            """,
            [table],
        )
        return cursor.fetchone()[0]


def get_postgres_columns(table):
    with postgres.cursor() as cursor:
        cursor.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = %s
            ORDER BY ordinal_position
            """,
            [table],
        )

        return [row[0] for row in cursor.fetchall()]


def quote_pg(column):
    return '"' + column.replace('"', '""') + '"'


def transfer_table(table):
    print()
    print("=" * 60)
    print("TABLE:", table)
    print("=" * 60)

    if not postgres_table_exists(table):
        print("SKIP - PostgreSQL table does not exist")
        return 0

    mysql_columns = get_mysql_columns(table)
    postgres_columns = get_postgres_columns(table)

    # Only use columns existing in BOTH databases.
    columns = [
        column
        for column in mysql_columns
        if column in postgres_columns
    ]

    if not columns:
        print("SKIP - no common columns")
        return 0

    rows = get_mysql_rows(table, columns)

    print("MySQL rows:", len(rows))

    if not rows:
        print("Nothing to transfer.")
        return 0

    column_sql = ", ".join(
        quote_pg(column)
        for column in columns
    )

    placeholders = ", ".join(
        ["%s"] * len(columns)
    )

    sql = f"""
        INSERT INTO {quote_pg(table)}
        ({column_sql})
        VALUES ({placeholders})
        ON CONFLICT DO NOTHING
    """

    inserted = 0

    try:
        with postgres.cursor() as cursor:
            for row in rows:
                cursor.execute(sql, row)
                inserted += 1

        postgres.commit()

        print("Transferred:", inserted)

        return inserted

    except Exception as e:
        postgres.rollback()

        print()
        print("ERROR while transferring:", table)
        print(type(e).__name__)
        print(e)

        return 0


def reset_sequence(table):
    """
    Reset PostgreSQL identity/sequence after importing explicit IDs.
    """

    with postgres.cursor() as cursor:

        # Find serial/identity-like columns
        cursor.execute(
            """
            SELECT
                column_name,
                pg_get_serial_sequence(
                    %s,
                    column_name
                )
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = %s
            """,
            [table, table],
        )

        sequences = cursor.fetchall()

        for column, sequence in sequences:

            if not sequence:
                continue

            try:
                cursor.execute(
                    f"""
                    SELECT MAX({quote_pg(column)})
                    FROM {quote_pg(table)}
                    """
                )

                max_id = cursor.fetchone()[0]

                if max_id is None:
                    continue

                cursor.execute(
                    "SELECT setval(%s, %s, true)",
                    [sequence, max_id],
                )

                print(
                    f"Sequence reset: {table}.{column} -> {max_id}"
                )

            except Exception as e:
                print(
                    f"Sequence warning for {table}.{column}: {e}"
                )

    postgres.commit()


# ============================================================
# MAIN
# ============================================================

print()
print("=" * 70)
print("        NADOREX MYSQL -> POSTGRESQL DATA TRANSFER")
print("=" * 70)
print()

print("Source database : old_mysql")
print("Target database : default")
print()

# Verify connections
with mysql.cursor() as cursor:
    cursor.execute("SELECT DATABASE()")
    print("MySQL database:", cursor.fetchone()[0])

with postgres.cursor() as cursor:
    cursor.execute("SELECT current_database()")
    print("PostgreSQL database:", cursor.fetchone()[0])

print()
print("Starting transfer...")
print()


total_transferred = 0
successful_tables = []
failed_tables = []


for table in TABLE_ORDER:

    if table not in TABLES:
        continue

    try:

        count = transfer_table(table)

        if count >= 0:
            successful_tables.append(table)
            total_transferred += count

    except Exception as e:

        print()
        print("FAILED:", table)
        print(e)

        failed_tables.append(table)


# ============================================================
# RESET POSTGRES SEQUENCES
# ============================================================

print()
print("=" * 70)
print("RESETTING POSTGRES SEQUENCES")
print("=" * 70)

for table in TABLE_ORDER:

    try:
        if postgres_table_exists(table):
            reset_sequence(table)

    except Exception as e:
        print("Sequence reset failed:", table, e)


# ============================================================
# FINAL RESULT
# ============================================================

print()
print("=" * 70)
print("             DATA TRANSFER FINISHED")
print("=" * 70)

print()
print("Tables processed:", len(successful_tables))
print("Rows transferred:", total_transferred)

if failed_tables:

    print()
    print("FAILED TABLES:")

    for table in failed_tables:
        print("!", table)

else:

    print()
    print("ALL TABLES TRANSFERRED SUCCESSFULLY.")

print()
print("=" * 70)