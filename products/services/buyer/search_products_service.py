from products.models import Products

from .product_filters import (
    apply_search_filter,
    apply_category_filter,
    apply_color_filter,
    apply_size_filter,
    apply_book_language_filter,
    apply_sort_filter,
)


def search_products_service(
    lang="en",
    search="",
    category="all",
    sort="",
    book_language="",
    color="",
    size="",
):
    queryset = (
        Products.objects
        .select_related("merchant")
        .prefetch_related("translations")
    )

    queryset = apply_search_filter(queryset, search)
    queryset = apply_category_filter(queryset, category)
    queryset = apply_color_filter(queryset, color)
    queryset = apply_size_filter(queryset, size)
    queryset = apply_book_language_filter(queryset, book_language)
    queryset = apply_sort_filter(queryset, sort)

    return queryset