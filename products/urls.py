from django.urls import path,include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt # تأكدي من وجود هذا الاستيراد في الأعلى
urlpatterns = [
   
    path("api/index/", views.index_api, name="index_api"),
    #===================
    # Seller
    #===================
    
    path('', views.index_api, name='index_api'),
    path('seller/', views.commerce_view_api, name='seller'), 
    path("merchant/register/", views.merchant_register_api, name="register"),
    path("merchant/verify/", views.merchant_verify_api, name="verify"),
    path("login/", views.merchant_login_api, name="login"),
    path("api/seller/products/add/", views.add_product_api, name="add_product"),
    path("api/categories/", views.categories_api,name="category"),
    path('api/buyer/orders/confirmed/', views.confirmed_orders_api, name='confirmed_orders'),

    path('set_language/<str:lang>', views.set_language, name='set_language'),
   
    path("product/<int:product_id>/", views.product_detail, name="product_detail"),
    
    # ======================
    # Cart
    # ======================
    path('api/cart/add/', views.add_to_cart_api, name='add_to_cart'),
    path('api/buyer/products/', views.buyer_products_api, name='buyer_products_api'),

    path('view_cart/', views.buyer_cart_page, name='view_cart'),
    path('remove_from_cart/<int:item_id>/', views.remove_from_cart_view, name='remove_from_cart'),
    path('cart/', views.buyer_cart_page, name='view_cart'),
    path('cart/edit/<int:item_id>/', views.edit_cart_item_view, name='edit_cart_item'),
    path('ordered_products_page/', views.ordered_products_page, name='ordered_products_page'),
    path("api/buyer/cart/add/",views.add_cart_api,name="add_to_cart"),
    
    path("api/buyer/cart/",views.cart_api,name="buyer_cart"),

    path(
        "api/buyer/cart/add/",
        views.add_cart_api,
        name="add_to_cart"
    ),


    path(
        "api/buyer/cart/update/",
        views.update_cart_api,
        name="update_cart_quantity"
    ),


    path(
        "api/buyer/cart/remove/<int:cart_id>/",
        views.remove_cart_api,
        name="remove_from_cart"
    ),



    # ======================
    # Orders
    # ======================
    # path(
    #     "seller/orders/<str:order_number>/",
    #     views.get_order_details_api,
    # ),

    path(
        "api/buyer/order/confirm/",
        views.confirm_order_api,
        name="confirm_order"
    ),


    path(
        "api/buyer/orders/",
        views.orders_api,
        name="buyer_orders"
    ),



    path(
        "api/buyer/orders/cancel/<int:order_id>/",
        csrf_exempt(views.cancel_order_api), # تغليف الدالة هنا لمنع خطأ 403 تماماً
        name="cancel_order"
    ),

    path(
        "api/buyer/orders/return/<int:order_id>/",
        csrf_exempt(views.return_order_api), # تغليف الدالة هنا لمنع خطأ 403 تماماً
        name="request_return"
    ),
    path('api/seller/dashboard/', views.seller_dashboard_api, name='seller_dashboard_api'),
    path('api/seller/products/', views.get_seller_products_api, name='get_seller_products'),
    
    # 2. تحديث منتج (استخدام pk لتحديد رقم المنتج)
    path('api/seller/products/update/<int:pk>/', views.update_product_api, name='update_product'),
    
    # 3. حذف منتج
    path('api/seller/products/delete/<int:pk>/', views.delete_product_api, name='delete_product'),
    path(
        "api/seller/orders/<int:pk>/update-status/",
        views.update_order_status_api,
        name="update_order_status_api",
    ),
    path(
    "api/orders/action/",
    views.order_action_api,
    name="order_action_api",
    ),
    path("api/products/image",views.get_products_api),
    path("api/seller/orders",views.seller_orders_api),
    path(
        "api/products/details/<int:product_id>/",
        views.product_detail_api
    ),
    path("api/buyer/product/<int:product_id>/",views.product_detail),
    path('api/favorites/toggle/', views.ToggleFavoriteView, name='favorite-toggle'),
    path('favorites/toggle/', views.ToggleFavoriteView, name='toggle-favorite'),
    path('buyer/favorites/', views.get_buyer_favorites, name='get_buyer_favorites'),
    path(
    "api/buyer/search/",
        views.search_products_api,
        name="search_products_api",
    ),
    path(
    "api/translations/cart/",
    views.cart_translations_api),
    
    path(
    "api/translations/login/",
    views.login_translations_api
    ),
    path(
    "api/translations/register/",
    views.register_translations_api
    ),
    path("api/translations/buyer/common/",
    views.buyer_translations_api
    ),
    
    path(
        "api/categories/<str:category_code>/attributes/",
        views.get_category_attributes_api
    ),
    path(
        "seller/orders/<str:order_number>/",
        views.seller_order_details_api
    ),
    path(
        "seller/archived-orders/",
        views.seller_archived_orders_api,
        name="seller_archived_orders"
    ),
    
    # path(
    #     "seller/notifications/",
    #     views.seller_notifications_api,
    #     name="seller_notifications"
    # ),
   
    # path(
    #     "seller/notifications/<int:notification_id>/read/",
    #     views.seller_notifications_api,
    #     name="mark_seller_notification_as_read"
    # ),
    path(
        "seller/notifications/",
        views.seller_notifications_api,
        name="seller_notifications"
    ),

    path(
        "seller/notifications/<int:notification_id>/read/",
        views.mark_seller_notification_read_api,
        name="mark_seller_notification_as_read"
    ),
    path("merchant/register/", views.merchant_register_api, name="register"),
    path(
        "instagram/callback/",
        views.instagram_callback,
        name="instagram_callback",
    ),
    path(
        "instagram/deauthorize/",
        views.instagram_deauthorize,
        name="instagram_deauthorize",
    ),

    path(
        "instagram/data-deletion/",
        views.instagram_data_deletion,
        name="instagram_data_deletion",
    ),
    path(
        "instagram/login/",
        views.instagram_login,
        name="instagram_login"
    ),


    path(
        "instagram/webhook/",
        views.instagram_webhook,
        name="instagram_webhook"
    ),


]
if settings.DEBUG:
    urlpatterns +=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)