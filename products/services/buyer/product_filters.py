from django.db.models import Q


def apply_search_filter(queryset, search):
    """
    البحث بالاسم والوصف وجميع الترجمات.
    """
    if not search:
        return queryset

    return queryset.filter(
        Q(name__icontains=search) |
        Q(describtion__icontains=search) |
        Q(translations__translated_name__icontains=search) |
        Q(translations__translated_description__icontains=search)
    ).distinct()


def apply_category_filter(queryset, category):
    if not category or category == "all":
        return queryset

    return queryset.filter(category_code=category)


def apply_color_filter(queryset, color):
    if not color:
        return queryset

    return queryset.filter(colors__icontains=color)


def apply_size_filter(queryset, size):
    if not size:
        return queryset

    return queryset.filter(sizes__icontains=size)


def apply_book_language_filter(queryset, book_language):
    if not book_language:
        return queryset

    return queryset.filter(
        books_language__icontains=book_language
    )


def apply_sort_filter(queryset, sort):
    if sort == "price_asc":
        return queryset.order_by("price")

    if sort == "price_desc":
        return queryset.order_by("-price")

    if sort == "newest":
        return queryset.order_by("-id")

    return queryset