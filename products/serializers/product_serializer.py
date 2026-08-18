from rest_framework import serializers

from products.models import Products,ProductAttribute, ProductVariantAttributes, CategoryAttributeOption, CategoryAttribute, CategoryAttributeTranslation


from rest_framework import serializers
from products.models import ProductVariants, ProductImages, Products, ProductVariantImages
class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImages
        fields = [
            "id",
            "image",
            "image_url",
        ]
# class ProductVariantAttributeSerializer(serializers.ModelSerializer):

#     attribute_name = serializers.SerializerMethodField()
#     option_name = serializers.SerializerMethodField()

#     class Meta:
#         model = ProductVariantAttributes
#         fields = [
#             "id",
#             "attribute",
#             "attribute_name",
#             "value",
#             "option",
#             "option_name",
#         ]


#     def get_attribute_name(self, obj):
#         lang = self.context.get("lang", "en")

#         translation = CategoryAttributeTranslation.objects.filter(
#             attribute=obj.attribute,
#             language=lang
#         ).first()

#         return translation.translation if translation else obj.attribute.name


#     def get_option_name(self, obj):
#         if not obj.option:
#             return None

#         lang = self.context.get("lang", "en")

#         translation = CategoryAttributeOptionTranslation.objects.filter(
#             option=obj.option,
#             language=lang
#         ).first()

#         return translation.translation if translation else obj.option.value
class ProductVariantAttributeSerializer(serializers.ModelSerializer):

    attribute_name = serializers.SerializerMethodField()
    attribute_type = serializers.SerializerMethodField()
    option_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariantAttributes
        fields = [
            "id",
            "attribute",
            "attribute_name",
            "attribute_type",
            "value",
            "option",
            "option_name",
        ]

    def get_attribute_name(self, obj):
        lang = self.context.get("lang", "en")

        translation = CategoryAttributeTranslation.objects.filter(
            attribute=obj.attribute,
            language=lang
        ).first()

        return (
            translation.translation
            if translation
            else obj.attribute.name
        )

    def get_attribute_type(self, obj):
        return obj.attribute.attribute_type

    def get_option_name(self, obj):
        if not obj.option:
            return None

        lang = self.context.get("lang", "en")

        translation = CategoryAttributeOptionTranslation.objects.filter(
            option=obj.option,
            language=lang
        ).first()

        return (
            translation.translation
            if translation
            else obj.option.value
        )
# class ProductVariantSerializer(serializers.ModelSerializer):
#     # التي اضفتها لكي اضيف عدة صور لاي نسخه 
#     images = ProductVariantImageSerializer(
#         many=True,
#         read_only=True
#     )
#     attributes = ProductVariantAttributeSerializer(
#         many=True,
#         read_only=True
#     )
#     class Meta:
#         model = ProductVariants
#         fields = [
#             "id",
#             "title",
#             "color",
#             "size",
#             "book_language",
#             "price",
#             "old_price",
#             "currency",
#             "sku",
#             "barcode",
#             "weight",
#             "stock",
#             "image",
#             "image_url",
#             "images",
#             "is_active",
#             "color_hex",
#             "attributes",
#         ]
from products.models import ProductVariantTranslation
class ProductVariantSerializer(serializers.ModelSerializer):

    images = ProductVariantImageSerializer(
        many=True,
        read_only=True
    )

    attributes = ProductVariantAttributeSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = ProductVariants
        fields = [
            "id",
            "title",
            "color",
            "size",
            "book_language",
            "price",
            "old_price",
            "currency",
            "sku",
            "barcode",
            "weight",
            "stock",
            "image",
            "image_url",
            "images",
            "is_active",
            "color_hex",
            "attributes",
        ]

    def to_representation(self, instance):

        data = super().to_representation(instance)

        request = self.context.get("request")

        lang = (
            request.GET.get("lang", "en")
            if request
            else "en"
        )

        translation = ProductVariantTranslation.objects.filter(
            variant=instance,
            language_code=lang
        ).first()

        if translation:
            data["title"] = (
                translation.translated_title
                or instance.title
            )

        return data

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ["id", "image",]
        
# from products.models import ProductVariantTranslation
# class ProductVariantSerializer(serializers.ModelSerializer):

#     images = ProductVariantImageSerializer(
#         many=True,
#         read_only=True
#     )

#     attributes = ProductVariantAttributeSerializer(
#         many=True,
#         read_only=True
#     )

#     class Meta:
#         model = ProductVariants
#         fields = [
#             "id",
#             "title",
#             "color",
#             "size",
#             "book_language",
#             "price",
#             "old_price",
#             "currency",
#             "sku",
#             "barcode",
#             "weight",
#             "stock",
#             "image",
#             "image_url",
#             "images",
#             "is_active",
#             "color_hex",
#             "attributes",
#         ]

#     def to_representation(self, instance):

#         data = super().to_representation(instance)

#         request = self.context.get("request")

#         lang = (
#             request.GET.get("lang", "en")
#             if request
#             else "en"
#         )

#         translation = ProductVariantTranslation.objects.filter(
#             variant=instance,
#             language_code=lang
#         ).first()

#         if translation:

#             data["title"] = (
#                 translation.translated_title
#                 or instance.title
#             )

#         return data

# class ProductAttributeSerializer(serializers.ModelSerializer):
#     attribute_name = serializers.CharField(
#         source="attribute.name",
#         read_only=True
#     )

#     attribute_type = serializers.CharField(
#         source="attribute.attribute_type",
#         read_only=True
#     )

#     class Meta:
#         model = ProductAttribute
#         fields = [
#             "attribute",
#             "attribute_name",
#             "attribute_type",
#             "value",
#         ]
# class ProductAttributeSerializer(serializers.ModelSerializer):

#     attribute_name = serializers.SerializerMethodField()

#     class Meta:
#         model = ProductAttribute
#         fields = [
#             "id",
#             "attribute",
#             "attribute_name",
#             "value",
#         ]

#     def get_attribute_name(self, obj):
#         lang = self.context.get("lang", "en")

#         translation = CategoryAttributeTranslation.objects.filter(
#             attribute=obj.attribute,
#             language=lang
#         ).first()

#         return (
#             translation.translation
#             if translation
#             else obj.attribute.name
#         )
class ProductAttributeSerializer(serializers.ModelSerializer):

    attribute_name = serializers.SerializerMethodField()
    attribute_type = serializers.SerializerMethodField()

    class Meta:
        model = ProductAttribute
        fields = [
            "id",
            "attribute",
            "attribute_name",
            "attribute_type",
            "value",
        ]

    def get_attribute_name(self, obj):
        lang = self.context.get("lang", "en")

        translation = CategoryAttributeTranslation.objects.filter(
            attribute=obj.attribute,
            language=lang
        ).first()

        return (
            translation.translation
            if translation
            else obj.attribute.name
        )

    def get_attribute_type(self, obj):
        return obj.attribute.attribute_type
from products.models import ProductTranslation

# class ProductDetailSerializer(serializers.ModelSerializer):
#     variants = ProductVariantSerializer(many=True, read_only=True)
#     images = ProductImageSerializer(many=True, read_only=True)
#     attributes = ProductAttributeSerializer(
#         many=True,
#         read_only=True
#     )
#     class Meta:
#         model = Products
#         fields = [
#             "id",
#             "name",
#             "describtion",
#             "price",
#             "old_price",
#             "currency",
#             "stock",
#             "image_url",
#             "base_image",
#             "variants",
#             "images",
#             "category_code",
#             "attributes",
           
            
#         ]
#     def get_variants(self, obj):

#         lang = self.context.get(
#             "lang",
#             "en"
#         )
    

#         return ProductVariantSerializer(
#             obj.variants.all(),
#             many=True,
#             context={
#                 "lang": lang
#             }
#         ).data    

class ProductDetailSerializer(serializers.ModelSerializer):

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    attributes = ProductAttributeSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "describtion",
            "price",
            "old_price",
            "currency",
            "stock",
            "image_url",
            "base_image",
            "variants",
            "images",
            "category_code",
            "attributes",
        ]

    def to_representation(self, instance):

        data = super().to_representation(instance)

        request = self.context.get("request")

        lang = (
            request.GET.get("lang", "en")
            if request
            else "en"
        )

        translation = ProductTranslation.objects.filter(
            product=instance,
            language_code=lang
        ).first()

        if translation:
            data["name"] = (
                translation.translated_name
                or instance.name
            )

            data["describtion"] = (
                translation.translated_description
                or instance.describtion
            )

        return data
# from rest_framework import serializers
from products.models import Favorite, Products, CategoryAttributeOptionTranslation


# class ProductSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()
#     attributes = ProductAttributeSerializer(
#         many=True,
#         read_only=True
#     )
#     class Meta:
#         model = Products
#         fields = [
#             "id",
#             "name",
#             "describtion",
#             "price",
#             "old_price",
#             "currency",
#             "stock",
#             "category",
#             "category_code",
#             "colors",
#             "sizes",
#             "books_language",
#             "store_name",
#             "image_url",
#             "variants",
#             "attributes",
#         ]

#     def get_image_url(self, obj):
#         request = self.context.get("request")
#         if obj.base_image and request:
#             return request.build_absolute_uri(obj.base_image.url)
#         return None
# class ProductSerializer(serializers.ModelSerializer):

#     image_url = serializers.SerializerMethodField()
#     attributes = serializers.SerializerMethodField()

#     class Meta:
#         model = Products
#         fields = [
#             "id",
#             "name",
#             "describtion",
#             "price",
#             "old_price",
#             "currency",
#             "stock",
#             "category",
#             "category_code",
#             "colors",
#             "sizes",
#             "books_language",
#             "store_name",
#             "image_url",
#             "variants",
#             "attributes",
#         ]

#     def get_image_url(self, obj):
#         request = self.context.get("request")
#         if obj.base_image and request:
#             return request.build_absolute_uri(obj.base_image.url)
#         return None

#     def get_attributes(self, obj):
#         print("PRODUCT ID:", obj.id)
#         print("PRODUCT ATTRIBUTES:", list(obj.attributes.all()))

#         return ProductAttributeSerializer(
#             obj.attributes.all(),
#             many=True,
#             context=self.context
# #         ).data
# class ProductSerializer(serializers.ModelSerializer):

#     image_url = serializers.SerializerMethodField()

#     attributes = ProductAttributeSerializer(
#         many=True,
#         read_only=True
#     )

#     variants = ProductVariantSerializer(
#         many=True,
#         read_only=True
#     )

#     class Meta:
#         model = Products
#         fields = [
#             "id",
#             "name",
#             "describtion",
#             "price",
#             "old_price",
#             "currency",
#             "stock",
#             "category",
#             "category_code",
#             "colors",
#             "sizes",
#             "books_language",
#             "store_name",
#             "image_url",
#             "variants",
#             "attributes",
#         ]

#     def get_image_url(self, obj):
#         request = self.context.get("request")

#         if obj.base_image and request:
#             return request.build_absolute_uri(obj.base_image.url)

#         return None
from products.models import ProductTranslation
class ProductSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    attributes = ProductAttributeSerializer(
        many=True,
        read_only=True
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "describtion",
            "price",
            "old_price",
            "currency",
            "stock",
            "category",
            "category_code",
            "colors",
            "sizes",
            "books_language",
            "store_name",
            "image_url",
            "variants",
            "attributes",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.base_image and request:
            return request.build_absolute_uri(obj.base_image.url)

        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get("request")

        # اللغة المطلوبة من الـFrontend
        lang = request.query_params.get("lang", "en") if request else "en"

        # البحث عن ترجمة المنتج
        translation = ProductTranslation.objects.filter(
            product=instance,
            language_code=lang
        ).first()

        if translation:
            data["name"] = translation.translated_name or instance.name
            data["describtion"] = (
                translation.translated_description
                or instance.describtion
            )

        return data
class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['favorite_id', 'buyer_phone', 'product', 'created_at']
        read_only_fields = ['favorite_id', 'created_at']
from rest_framework import serializers
from products.models import Products, Translations
from rest_framework import serializers
from products.models import Products, Translations

from rest_framework import serializers
from products.models import Products, Categories


class SearchProductSerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source="merchant.name", read_only=True)

    name = serializers.SerializerMethodField()
    describtion = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "describtion",
            "price",
            "old_price",
            "currency",
            "image_url",
            "base_image",
            "store_name",
            "category_code",
            "colors",
            "sizes",
            "books_language",
            "stock",
        ]

    def _get_product_translation(self, obj, lang):
        """
        إرجاع ترجمة المنتج حسب اللغة المطلوبة.
        """
        for translation in obj.translations.all():
            if translation.language_code.lower() == lang.lower():
                return translation

        return None

    def get_name(self, obj):
        lang = self.context.get("lang", "en")

        translation = self._get_product_translation(obj, lang)

        if translation and translation.translated_name:
            return translation.translated_name

        return obj.name

    def get_describtion(self, obj):
        lang = self.context.get("lang", "en")

        translation = self._get_product_translation(obj, lang)

        if translation and translation.translated_description:
            return translation.translated_description

        return obj.describtion

class CategorySerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = Categories
        fields = [
            "code",
            "name"
        ]

    def get_name(self,obj):

        lang = self.context.get(
            "lang",
            "en"
        )

        translation = obj.translations.filter(
            language=lang
        ).first()

        if translation:
            return translation.translation

        return obj.code

class CategoryAttributeOptionSerializer(serializers.ModelSerializer):

    translation = serializers.SerializerMethodField()

    class Meta:
        model = CategoryAttributeOption
        fields = [
            "id",
            "value",
            "translation",
        ]

    def get_translation(self, obj):

        lang = self.context.get("lang", "en")

        translation = obj.translations.filter(
            language=lang
        ).first()

        if translation:
            return translation.translation

        return obj.value
# class CategoryAttributeSerializer(serializers.ModelSerializer):

#     translation = serializers.SerializerMethodField()

#     options = CategoryAttributeOptionSerializer(
#         many=True,
#         read_only=True,
#     )

#     class Meta:
#         model = CategoryAttribute
#         fields = [
#             "id",
#             "name",
#             "translation",
#             "attribute_type",
#             "required",
#             "display_order",
#             "unit",
#             "options",
#         ]

#     def get_translation(self, obj):

#         lang = self.context.get("lang", "en")

#         translation = obj.translations.filter(
#             language=lang
#         ).first()

#         if translation:
#             return translation.translation

#         return obj.name
class CategoryAttributeSerializer(serializers.ModelSerializer):

    translation = serializers.SerializerMethodField()

    options = serializers.SerializerMethodField()

    class Meta:
        model = CategoryAttribute
        fields = [
            "id",
            "name",
            "translation",
            "attribute_type",
            "required",
            "display_order",
            "unit",
            "options",
        ]

    def get_translation(self, obj):

        lang = self.context.get("lang", "en")

        translation = obj.translations.filter(
            language=lang
        ).first()

        if translation:
            return translation.translation

        return obj.name

    def get_options(self, obj):

        lang = self.context.get("lang", "en")

        queryset = obj.options.all().order_by(
            "display_order"
        )

        return CategoryAttributeOptionSerializer(
            queryset,
            many=True,
            context={
                "lang": lang,
            },
        ).data
