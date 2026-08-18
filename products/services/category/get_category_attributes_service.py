# from products.models import CategoryAttribute


# def get_category_attributes_service(category_code):
#     attributes = CategoryAttribute.objects.filter(
#         category_code_id=category_code
#     ).prefetch_related(
#         "options"
#     ).order_by(
#         "display_order"
#     )

#     return attributes
from products.models import CategoryAttribute


def get_category_attributes_service(category_code):

    return (
        CategoryAttribute.objects
        .filter(
            category_code=category_code
        )
        .prefetch_related(
            "translations",
            "options__translations",
        )
        .order_by(
            "display_order"
        )
    )