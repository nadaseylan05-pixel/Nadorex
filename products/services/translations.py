
from products.utils import load_translations, t


def index_translations(lang):
    translations = load_translations()

    keys = [
        "homepage_title",
        "welcome",
        "buyer",
        "stores",
        "buyer_requests",
        "seller",
    ]

    return {
        key: t(key, lang, translations)
        for key in keys
    }
    
def merchant_verify_translations(lang):
    translations = load_translations()

    keys = [
        "verify_title",
        "verify_description",
        "verification_code_label",
        "verify_button",

        "session_expired",
        "verification_code_required",
        "invalid_verification_code",
        "verification_success",
    ]

    return {
        key: t(key, lang, translations)
        for key in keys
    }


def merchant_login_translations(lang):
    translations = load_translations()
    keys = [
        "merchant_login",
        "your_email_label",
        "password_label",
        "merchant_login_button",
        "error_invalid_credentials",
        "account_not_verified",
        "account_not_linked",
    ]

    return {
        key: t(key, lang, translations)
        for key in keys
    }

def merchant_register_translations(lang):
    translations = load_translations()
    keys = [
        ""
        "email_already_registered",
        "verification_email_failed",
        "verification_email_body",
        "verification_email_subject",
        "merchant_register_title",
        "seller_page_description",
        "name",
        "your_email_label",
        "password_label",
        "choose_language",
        "merchant_register_button",
        "already_have_account",
        "register",
        
        
    ]

    return {
        key: t(key, lang, translations)
        for key in keys
    }



def commerce_view_translations(lang):
    translations = load_translations()
    keys = [
        "lang",
        "seller_page_title",
        "seller_page_description",
        "back_to_home",
        "merchant_login",
        "merchant_register_title"
       
    ]

    return {
        key: t(key, lang, translations)
        for key in keys
    }
def show_products(lang):
    """ترجمات خاصة بعرض المنتجات"""
    translations_file = load_translations()
    keys = [
        "all",
        "select_category",
        "error_category_not_found",
        "no_products",
        "edit",
        "delete",
        "price",
        "old_price",
    ]
    return {key: t(key, lang, translations_file) for key in keys} 
def buyer_products_translations(lang):
    """ترجمات خاصة بعرض المنتجات"""
    translations_file = load_translations()
    keys = [
        "add_to_cart",
        "colors_label",
        "sizes_label",
        "books_languages_available",
        "no_products",
        "cart",
        "add_to_cart",
        "cart_count",
    ]
    return {key: t(key, lang, translations_file) for key in keys} 

def cart_translations(lang):
    translations = load_translations()
    keys = [
        "product_not_found",
        "added_to_cart",
        "error_adding_to_cart",
    ]
    return {
        key: t(key, lang, translations)
        for key in keys
    }



def store_list_translations(lang):
    translations = load_translations()

    keys = [
        "store_page_title",
        "store_description",
        "no_stores_found",
        "please_select_store",
        "back_to_home",
    ]

    return {key: t(key, lang, translations) for key in keys}


def store_page_translations(lang):
    translations = load_translations()

    keys = [
        "store_page_title",
        "store_welcome_description",
        "add_to_cart",
        "no_products_in_store",
        "please_select_store",
        "products_from",
        "back_to_home",
        "cart",
    ]

    return {
        key: t(key, lang, translations)
        for key in keys
    }
def confirmed_orders(lang):
    translations = load_translations()
    keys = [
        "confirmed_orders",
        "product",
        "quantity",
        "price",
        "status",
        "return_status",
        "order_date",
        "action",
        "cancel_order",
        "mark_as_delivered",
        "request_return",
        "cancel_return",
        "no_orders",
        "color_key",
        "size_key",
        "book_language_key"
    ]
from products.utils import load_translations, t


TRANSLATION_GROUPS = {
    # =======================
    # home
    # ========================
    "homme":[
        "home",
        "homepage_title",
        "main_menu",
        "welcome",
        "buyer",
        "seller",
        
    ],
    # =========================
    # Common
    # =========================
    "common": [
        "action",
        "address",
        "back_to_home",
        "cancel",
        "confirm_delete",
        "confirm_save",
        "currency",
        "delete",
        "delete_successful",
        "description",
        "edit",
        "email",
        "name",
        "no",
        "none",
        "phone",
        "phone_number",
        "price",
        "quantity",
        "save_cancelled",
        "search_product_placeholder_key",
        "status",
        "yes",
        "yes_save",
        "total_products",
        "active_products",
        "basic_information",
        "confirm_order"
    ],

    # =========================
    # Authentication
    # =========================
    "auth": [
        "merchant_login",
        "merchant_register_title",
        "register_merchant",
        "your_email_label",
        "password_label",
        "email_already_registered",
        "email_not_found",
        "account_not_verified",
        "login_failed",
        "login_success",
        "registration_failed",
        "registration_success",
        "registration_success_check_email",
        "verification_success",
        "verification_failed",
        "verification_code_incorrect",
        "verification_attempts_exceeded",
        "verification_email_subject",
        "verification_email_body",
        "enter_verification_code",
        "choose_language",
        "instagram_username",
        "name"
    ],

    # =========================
    # Store
    # =========================
    "store": [
        "stores",
        "store_setup",
        "store_banner",
        "store_logo",
        "store_name_label",
        "store_description",
        "store_description_placeholder",
        "store_phone_label",
        "store_instagram_label",
        "edit_store_profile",
        "store_updated_successfully",
        "please_select_a_store",
    ],

    # =========================
    # Products
    # =========================
    "products": [
        "products",
        "add_new_product",
        "active",
        "out_of_stock",
        "product",
        "product_name",
        "product_name_label",
        "product_description",
        "product_image",
        "product_id",
        "product_extra_images",
        "product_variants_options",
        "category",
        "category_label",
        "sub_category_label",
        "select_category",
        "choose_category",
        "add_product",
        "add_product_title",
        "edit_product",
        "product_added_success",
        "product_deleted",
        "product_not_found",
        "product_updated_successfully",
        "no_products",
        "no_product_found_key",
        "price",
        "old_price",
        "old_price_label",
        "price_label",
        "price_and_commission_label",
        "upload_product_image",
        "image_required",
        "manage_products",
        "update_stock",
        "sold_quantity",
        "view_products",
        "status",
        "total_stock_quantity",
        "save_upload_product",
        "inventory_management",
        "variants",
        "variant_name",
    ],

    # =========================
    # Cart
    # =========================
    "cart": [
        "cart",
        "view_cart",
        "add_to_cart",
        "added_to_cart",
        "deleted_from_cart",
        "empty_cart",
        "confirm_order",
        "back_to_shopping",
        "total_price",
        "total_price_label",
        "shopping_cart",
        "order_summary",
        "items",
        "discount",
        "shipping",
        "back_to_cart",
        "payment_arranged_directly_with_seller",
    ],

    # =========================
    # Orders
    # =========================
    "orders": [
        "orders_list",
        "order_id",
        "order_date",
        "order_cancelled",
        "date_ordered",
        "buyer_id",
        "product",
        "quantity",
        "status",
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "order_confirmed_successfully",
        "order_cancelled",
        "order_canceled",
        "order_not_found",
        "order_status_updated",
        "mark_as_delivered",
        "update_status",
        "select_new_status",
        "view_orders",
        "view_confirmed_order",
        "return_request_pending",
        "send_pickup_courier",
        "return_processing",
        "update_order_status_failed",
        "update_order_status_error",
        #
        "confirmed_orders",
        "product",
        "quantity",
        "price",
        "status",
        "return_status",
        "order_date",
        "action",
        "cancel_order",
        "mark_as_delivered",
        "request_return",
        "cancel_return",
        "no_orders",
        "color_key",
        "size_key",
        "book_language_key"
    ],

    # =========================
    # Returns
    # =========================
    "returns": [
        "request_return",
        "cancel_return",
        "return_requested",
        "return_cancelled",
        "return_cancelled_success",
        "return_status",
        "return_period",
        "return_period_expired",
        "return_deadline_notice",
        "no_return_request_found",
    ],

    # =========================
    # Buyer
    # =========================
    "buyer": [
        "buyer",
        "buyer_page_title",
        "buyer_page_description",
        "buyer_requests",
        "buyers_requests",
        "request_product_button",
        "product_request_title",
        "product_request_submitted",
    ],

    # =========================
    # Seller
    # =========================
    "seller": [
        "seller",
        "seller_page_title",
        "seller_page_description",
        "sales_report",
        "account_updated",
        "update_account",
        "customers",
        "total_sales",
        "total_inventory",
        "home",
        "main_menu",
        "from_last_month",
        "save_current_changes",
        "edit_category_section",
        "inventory",
        "add_new_variant",
        "images",
        "add_product_failed",
        "my_store_link",
        "share_store_with_customers",
        "copy_link", 
        "share",
        "open_my_store",
        "notifications",
        "refresh",
        "view_details",
        "no_notifications",
        "select",
        "optional",
        "archived_orders",

    ],

    # =========================
    # Colors
    # =========================
    "colors": [
        "black",
        "blue",
        "brown",
        "gray_light",
        "gray_medium",
        "green",
        "mint_green",
        "orange",
        "pink_light",
        "pink_love",
        "pink_medium",
        "pink_purple",
        "pink_shiny",
        "purple",
        "red",
        "sky_blue",
        "white",
        "yellow",
    ],

    # =========================
    # Errors
    # =========================
    "errors": [
        "db_connection_error",
        "unexpected_error",
        "unknown_action",
        "invalid_action",
        "category_not_found",
        "books_language_required_error",
        "email_send_failed",
    ],
}


def get_translations(groups, lang):
    """
    groups:
        "products"
        ["common", "products"]
    """

    translations = load_translations()

    if isinstance(groups, str):
        groups = [groups]

    keys = []

    for group in groups:
        keys.extend(TRANSLATION_GROUPS.get(group, []))

    # إزالة التكرار مع الحفاظ على الترتيب
    keys = list(dict.fromkeys(keys))

    return {
        key: t(key, lang, translations)
        for key in keys
    }