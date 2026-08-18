# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class AutoDeliveryLogs(models.Model):
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    change_time = models.DateTimeField()
    note = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auto_delivery_logs'


class BuyerInfo(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    #created_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField()
    session_id = models.CharField(max_length=255, blank=True, null=True)
    order_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'buyer_info'


class BuyerTranslations(models.Model):
    key_name = models.CharField(max_length=255, blank=True, null=True)
    ar = models.CharField(max_length=255, blank=True, null=True)
    en = models.CharField(max_length=255, blank=True, null=True)
    tr = models.CharField(max_length=255, blank=True, null=True)
    de = models.CharField(max_length=255, blank=True, null=True)
    fr = models.CharField(max_length=255, blank=True, null=True)
    es = models.CharField(max_length=255, blank=True, null=True)
    zh = models.CharField(max_length=255, blank=True, null=True)
    ja = models.CharField(max_length=255, blank=True, null=True)
    ko = models.CharField(max_length=255, blank=True, null=True)
    sv = models.CharField(max_length=255, blank=True, null=True)
    it = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'buyer_translations'


class CartItems(models.Model):
    session_id = models.CharField(max_length=255, blank=True, null=True)
    product = models.ForeignKey('products.Products',
                                on_delete=models.CASCADE, 
                                db_column='product_id'
                                )
    quantity = models.IntegerField(blank=True, null=True)
    added_at = models.DateTimeField(blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'cart_items'


class Categories(models.Model):
    code = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'categories'

class CategoryTranslations(models.Model):
    id = models.AutoField(primary_key=True)  # إضافة مفتاح أساسي تلقائي
    # category_code = models.ForeignKey(
    #     Categories,
    #     models.DO_NOTHING,
    #     db_column='category_code',
    #     to_field='code',
    #     blank=True,
    #     null=True,
    # )
    category_code = models.ForeignKey(
        Categories,
        models.DO_NOTHING,
        db_column="category_code",
        to_field="code",
        related_name="translations",
        blank=True,
        null=True,
    )
    language = models.CharField(max_length=10, blank=True, null=True)
    translation = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'category_translations'

class ProductRequests(models.Model):
    product_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, db_column='category', blank=True, null=True)
    ''' 
    category = models.ForeignKey(
        CategoryTranslations,
        models.DO_NOTHING,
        db_column='category',
        blank=True,
        null=True,
    )  # نستخدم المفتاح الأساسي (id) في FK وليس to_field
    '''
    sub_category = models.CharField(max_length=100, blank=True, null=True)
    buyer_email = models.CharField(max_length=255, blank=True, null=True)
    date_requested = models.DateTimeField(blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    language = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_requests'

class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Merchants(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="merchant",
        null=True,       # مؤقتًا للسماح للسجلات القديمة بالبقاء
        blank=True
    )
    
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    name = models.CharField(max_length=150) 
    password = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField()
    
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_attempts = models.IntegerField(default=0)
    merchant_lang = models.CharField(max_length=10, blank=True, null=True)
    iyzico_merchant_key = models.CharField(max_length=255, blank=True, null=True)
    iyzico_sub_key = models.CharField(max_length=255, blank=True, null=True)
    submerchanttype = models.CharField(db_column='subMerchantType', max_length=50, blank=True, null=True)  # Field name made lowercase.
    gsmnumber = models.CharField(db_column='gsmNumber', max_length=20, blank=True, null=True)  # Field name made lowercase.
    iban = models.CharField(max_length=34, blank=True, null=True)
    taxnumber = models.CharField(db_column='taxNumber', max_length=50, blank=True, null=True)  # Field name made lowercase.
    identitytype = models.CharField(db_column='identityType', max_length=50, blank=True, null=True)  # Field name made lowercase.    
    identitynumber = models.CharField(db_column='identityNumber', max_length=100, blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(max_length=500, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=2, blank=True, null=True)
    zipcode = models.CharField(db_column='zipCode', max_length=20, blank=True, null=True)  # Field name made lowercase.
    iyzico_status = models.CharField(max_length=50, blank=True, null=True)
    store_banner = models.CharField(max_length=255, blank=True, null=True)
    store_logo = models.CharField(max_length=255, blank=True, null=True)
    store_description = models.TextField(blank=True, null=True)
    description_color = models.CharField(max_length=20, blank=True, null=True)
    description_font = models.CharField(max_length=50, blank=True, null=True)
    instagram_username = models.CharField(
        max_length=100, 
        unique=True, 
        null=True, 
        blank=True, 
        db_index=True,
        verbose_name="يوزر إنستغرام التاجر"
    )
    class Meta:
        managed = False
        db_table = 'merchants'



class OrderLogs(models.Model):
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    action = models.CharField(max_length=50, blank=True, null=True)
    log_date = models.DateTimeField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    return_status = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order_logs'


class OrderShipments(models.Model):
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    shipping_company = models.ForeignKey('ShippingCompanies', models.DO_NOTHING)
    tracking_number = models.CharField(unique=True, max_length=100)
    shipping_status = models.CharField(max_length=50, blank=True, null=True)
    estimated_delivery_date = models.DateField(blank=True, null=True)
    actual_delivery_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order_shipments'
BASE_COLOR_TYPE_CHOICES = [
    ("neutral", "Neutral"),
    ("single", "Single"),
    ("dark", "Dark/Patterned"),
]

class Products(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    
    base_image = models.ImageField(upload_to="products/base/")

    uses_mask = models.BooleanField(default=False)
    mask_image = models.ImageField(
        upload_to="products/masks/",
        null=True,
        blank=True
    )
    base_color_type = models.CharField(
        max_length=10,
        choices=BASE_COLOR_TYPE_CHOICES,
        default="single"
    )
    commission = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    describtion = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    merchant_email = models.CharField(max_length=255, blank=True, null=True)
    category_code = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    store_name = models.CharField(max_length=255, blank=True, null=True)
    books_language = models.CharField(max_length=10, blank=True, null=True)
    sizes = models.TextField(blank=True, null=True)
    colors = models.TextField(blank=True, null=True)
    total_stock = models.PositiveIntegerField(default=0)
    merchant = models.ForeignKey(Merchants,
                                 on_delete=models.CASCADE,
                                 related_name='products'
                                 )
    stock = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'products'
class ProductVariants(models.Model):
    id = models.BigAutoField(primary_key=True)

    # المنتج الأساسي
    product = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        related_name="variants"
    )

    # اسم النسخة (اختياري)
    title = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    # خصائص النسخة
    color = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    size = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    book_language = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    # السعر الخاص بهذه النسخة
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    # السعر قبل الخصم
    old_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    # العملة
    currency = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )

    # رمز المنتج (SKU)
    sku = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True
    )

    # الباركود
    barcode = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # الوزن
    weight = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True
    )
    # كمية هذه النسخة فقط
    stock = models.PositiveIntegerField(default=0)

    # صورة النسخة
    image = models.ImageField(
        upload_to="products/variants/",
        blank=True,
        null=True
    )

    # أو رابط صورة خارجي (مثل صورة الإنستغرام)
    image_url = models.URLField(
        blank=True,
        null=True
    )

    # ترتيب العرض
    sort_order = models.PositiveIntegerField(default=0)

    # هل هذه النسخة مفعلة
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    color_hex = models.CharField(
        max_length=7,
        blank=True,
        null=True,
        help_text="Hex color مثل #FF5733"
    )

    class Meta:
        db_table = "product_variants"
        ordering = ["sort_order", "id"]

    def __str__(self):
        values = [
            self.title,
            self.color,
            self.size,
            self.book_language,
        ]
        values = [v for v in values if v]
        return " - ".join(values) if values else f"Variant {self.id}"

class ProductVariantTranslation(models.Model):
    variant = models.ForeignKey(
        ProductVariants,
        on_delete=models.CASCADE,
        related_name="translations"
    )

    language_code = models.CharField(
        max_length=10
    )

    translated_title = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    translated_color = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    translated_size = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    translated_book_language = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    class Meta:
        db_table = "product_variant_translations"

        constraints = [
            models.UniqueConstraint(
                fields=["variant", "language_code"],
                name="unique_variant_language"
            )
        ]
class ProductVariantImages(models.Model):
    variant = models.ForeignKey(
        ProductVariants,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="products/variants/",
        blank=True,
        null=True
    )

    image_url = models.URLField(
        blank=True,
        null=True
    )

    sort_order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "product_variant_images"
        ordering = ["sort_order", "id"]
class ProductColor(models.Model):
    product = models.ForeignKey(
        Products,
        related_name="product_colors",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7)

    image = models.ImageField(
        upload_to="products/colors/",
        null=True,
        blank=True
    )

    is_available = models.BooleanField(default=True)

    def _str_(self):
        return f"{self.product.name} - {self.name}"
 
class ProductImages(models.Model):
    product = models.ForeignKey(
        'Products',                  # الربط بالمنتج الرئيسي
        on_delete=models.CASCADE,     # لو حُذف المنتج، تحذف كل صوره المرتبطة به
        related_name='images'         # اسم نستخدمه في templates للوصول للصور الفرعية
    )
    image = models.ImageField(upload_to="products/gallery/")  # مكان حفظ الصورة
    color = models.CharField(max_length=50, blank=True, null=True)  # لو الصورة مرتبطة بلون معين
    alt_text = models.CharField(max_length=255, blank=True, null=True)  # وصف للصورة (اختياري)
    class Meta :
        db_table ='product_images'
    def __str__(self):
        # تم تصحيح الشرطات السفلية لتكون دالة سحرية بايثون __str__
        product_name = self.product.name if self.product else (self.name or "Unknown")
        parts = [f"{product_name} ({self.quantity})"]
        if self.chosen_color: # 👈 تم التصحيح إلى الحقل الفعلي
            parts.append(f"Color: {self.chosen_color}")
        if self.chosen_size:  # 👈 تم التصحيح إلى الحقل الفعلي
            parts.append(f"Size: {self.chosen_size}")
        if self.book_language:
            parts.append(f"Lang: {self.book_language}")
        return " - ".join(parts)
    
class Orders(models.Model):
    buyer = models.ForeignKey(BuyerInfo, models.DO_NOTHING, blank=True, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    order_date = models.DateTimeField(blank=True, null=True)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.IntegerField()
    #product_id = models.IntegerField()
    product = models.ForeignKey(Products, models.DO_NOTHING, db_column='product_id')
    name = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    delivered_date = models.DateTimeField(blank=True, null=True)
    return_status = models.CharField(max_length=50, blank=True, null=True)
    return_days = models.IntegerField(blank=True, null=True)
    book_language = models.CharField(max_length=10, blank=True, null=True)
    chosen_color = models.CharField(max_length=50, blank=True, null=True)
    chosen_size = models.CharField(max_length=50, blank=True, null=True)
    language = models.CharField(max_length=10, blank=True, null=True)
    merchant = models.ForeignKey(Merchants, models.DO_NOTHING, blank=True, null=True)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    refund_id = models.CharField(max_length=255, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_transaction_id = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    building = models.CharField(max_length=100, blank=True, null=True)
    apartment = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    shipping_company_id = models.IntegerField(blank=True, null=True)
    shipped_date = models.DateTimeField(blank=True, null=True)
    is_archived = models.BooleanField(default=False)
    order_number = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    variant = models.ForeignKey(
        ProductVariants,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    attributes_snapshot = models.JSONField(
        blank=True,
        null=True
    )
    is_archived = models.BooleanField(default=False)
    def _str_(self):
        parts = [f"{self.product.name} ({self.quantity})"]
        if self.color:
            parts.append(f"Color: {self.color}")
        if self.size:
            parts.append(f"Size: {self.size}")
        if self.book_language:
            parts.append(f"Lang: {self.book_language}")
        return " - ".join(parts)
    class Meta:
        managed = False
        db_table = 'orders'


# class OrderItems(models.Model):
#     order_id = models.IntegerField(blank=True, null=True)
#     product_id = models.IntegerField(blank=True, null=True)
#     quantity = models.IntegerField(blank=True, null=True)
#     price_at_order_time = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'order_items'

class OrderItems(models.Model):
    order = models.ForeignKey(
        Orders,
        db_column="order_id",
        on_delete=models.CASCADE,
    )

    product = models.ForeignKey(
        Products,
        db_column="product_id",
        on_delete=models.CASCADE,
    )

    quantity = models.IntegerField(blank=True, null=True)

    price_at_order_time = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )

    class Meta:
        managed = False
        db_table = "order_items"


class ProductReviews(models.Model):
    order = models.ForeignKey(Orders, models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    reviewer_email = models.CharField(max_length=255)
    rating = models.JSONField(blank=True, null=True)
    review_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_reviews'


# class ProductTranslations(models.Model):
#     pk = models.CompositePrimaryKey('product_id', 'language_code')
#     product_id = models.IntegerField()
#     language_code = models.CharField(max_length=10)
#     translated_name = models.CharField(max_length=255, blank=True, null=True)
#     translated_description = models.TextField(blank=True, null=True)
#     translated_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
#     translated_old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'product_translations'

class ProductTranslations(models.Model):
    pk = models.CompositePrimaryKey("product", "language_code")

    product = models.ForeignKey(
        Products,
        db_column="product_id",
        related_name="translations",
        on_delete=models.DO_NOTHING,
    )

    language_code = models.CharField(max_length=10)

    translated_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    translated_description = models.TextField(
        blank=True,
        null=True
    )

    translated_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    translated_old_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    class Meta:
        managed = False
        db_table = "product_translations"


# class ProductsTranslation(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     text_key = models.CharField(unique=True, max_length=255)
#     arabic = models.TextField()
#     english = models.TextField()
#     turkish = models.TextField()
#     german = models.TextField()
#     french = models.TextField()
#     spanish = models.TextField()
#     chinese = models.TextField()
#     japanese = models.TextField()
#     korean = models.TextField()
#     swedish = models.TextField()
#     italian = models.TextField()

#     class Meta:
#         managed = False
#         db_table = 'products_translation'

# class ProductTranslation(models.Model):
#     product = models.ForeignKey(
#         Products,
#         on_delete=models.CASCADE,
#         db_column="product_id",
#         related_name="product_translations"
#     )

#     language_code = models.CharField(max_length=10)

#     translated_name = models.CharField(
#         max_length=255,
#         null=True,
#         blank=True
#     )

#     translated_description = models.TextField(
#         null=True,
#         blank=True
#     )

#     translated_price = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         null=True,
#         blank=True
#     )

#     translated_old_price = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         null=True,
#         blank=True
#     )

#     class Meta:
#         managed = False
#         db_table = "product_translations"

class ProductTranslation(models.Model):

    product = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        db_column="product_id",
        related_name="product_translations"
    )

    language_code = models.CharField(
        max_length=10
    )

    pk = models.CompositePrimaryKey(
        "product",
        "language_code"
    )

    translated_name = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    translated_description = models.TextField(
        null=True,
        blank=True
    )

    translated_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    translated_old_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    class Meta:
        managed = False
        db_table = "product_translations"

class RequestTranslations(models.Model):
    request = models.ForeignKey(ProductRequests, models.DO_NOTHING, blank=True, null=True)
    language_code = models.CharField(max_length=10, blank=True, null=True)
    translated_description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'request_translations'


class ShippingCompanies(models.Model):
    name = models.CharField(max_length=100)
    logo_url = models.CharField(max_length=255, blank=True, null=True)
    supported_countries = models.TextField(blank=True, null=True)
    api_key = models.CharField(max_length=255, blank=True, null=True)
    api_secret = models.CharField(max_length=255, blank=True, null=True)
    base_url = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shipping_companies'


class Translations(models.Model):
    text_key = models.CharField(max_length=255)
    arabic = models.TextField()
    english = models.TextField()
    turkish = models.TextField()
    german = models.TextField(blank=True, null=True)
    french = models.TextField(blank=True, null=True)
    spanish = models.TextField(blank=True, null=True)
    chinese = models.TextField(blank=True, null=True)
    japanese = models.TextField(blank=True, null=True)
    korean = models.TextField(blank=True, null=True)
    swedish = models.TextField(blank=True, null=True)
    # italian = models.TextField(db_collation='utf8mb3_general_ci')
    italian = models.TextField(
        null=True,
        blank=True
    )
    category_code = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'translations'

from django.db import models


class Favorite(models.Model):
    favorite_id = models.AutoField(primary_key=True)

    buyer_phone = models.CharField(max_length=20, db_index=True)

    product = models.ForeignKey(
        "Products",
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "favorites"
        unique_together = ("buyer_phone", "product")

    def __str__(self):
        return f"{self.buyer_phone} - {self.product_id}"
class CategoryAttribute(models.Model):
    ATTRIBUTE_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
        ("select", "Select"),
        ("boolean", "Boolean"),
        ("color", "Color"),
    ]

    id = models.AutoField(primary_key=True)
    category_code = models.ForeignKey(
        Categories,
        models.DO_NOTHING,
        db_column="category_code",
        to_field="code",
        related_name="attributes",
    )
    name = models.CharField(max_length=100)
    attribute_type = models.CharField(max_length=20, choices=ATTRIBUTE_TYPES)
    required = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "category_attributes"
class CategoryAttributeOption(models.Model):
    id = models.AutoField(primary_key=True)
    attribute = models.ForeignKey(
        CategoryAttribute,
        models.DO_NOTHING,
        db_column="attribute_id",
        related_name="options",
    )
    value = models.CharField(max_length=100)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        managed = False
        db_table = "category_attribute_options"
class ProductAttribute(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey(
        Products,
        models.DO_NOTHING,
        db_column="product_id",
        related_name="attributes",
    )
    attribute = models.ForeignKey(
        CategoryAttribute,
        models.DO_NOTHING,
        db_column="attribute_id",
        related_name="product_values",
    )
    value = models.TextField( blank=True, null=True)

    class Meta:
        managed = False
        db_table = "product_attributes"
        unique_together = (("product", "attribute"),)  
class CategoryAttributeTranslation(models.Model):
    id = models.AutoField(primary_key=True)

    attribute = models.ForeignKey(
        CategoryAttribute,
        models.DO_NOTHING,
        db_column="attribute_id",
        related_name="translations",
    )

    language = models.CharField(max_length=10)

    translation = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "category_attribute_translations"

class CategoryAttributeOptionTranslation(models.Model):
    id = models.AutoField(primary_key=True)

    option = models.ForeignKey(
        CategoryAttributeOption,
        models.DO_NOTHING,
        db_column="option_id",
        related_name="translations",
    )

    language = models.CharField(max_length=10)

    translation = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "category_attribute_option_translations"

class ProductVariantAttributes(models.Model):
    variant = models.ForeignKey(
        ProductVariants,
        on_delete=models.CASCADE,
        related_name="attributes"
    )

    attribute = models.ForeignKey(
        CategoryAttribute,
        on_delete=models.CASCADE,
        related_name="variant_values"
    )

    value = models.TextField(
        blank=True,
        null=True
    )

    option = models.ForeignKey(
        CategoryAttributeOption,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="variant_values"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "product_variant_attributes"

    def __str__(self):
        return f"{self.variant.id} - {self.attribute.id}"
class Notifications(models.Model):

    NOTIFICATION_TYPES = [
        ("new_order", "New Order"),
        ("order_cancelled", "Order Cancelled"),
        ("order_shipped", "Order Shipped"),
        ("order_delivered", "Order Delivered"),
        ("return_requested", "Return Requested"),
    ]

    merchant = models.ForeignKey(
        "Merchants",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )

    buyer = models.ForeignKey(
        "BuyerInfo",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )

    order = models.ForeignKey(
        "Orders",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )

    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        managed = False
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notification_type} - {self.id}"