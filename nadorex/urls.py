from products import views as product_views
from django.conf import settings
from django.conf.urls.static import static
"""
URL configuration for nadorex project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.contrib import admin
from django.urls import path, include

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('products.urls')),  # ربط التطبيق بدون بادئة
    path("api/",include("products.urls")),
    path('products/', include(('products.urls', 'products'), namespace='products')),
    #path("api/",include("products.urls")),
]
'''
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
'''
if settings.DEBUG:
    # 1. إعداد ملفات الميديا (الصور المرفوعة من المستخدمين والتاجر)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # 2. إعداد الملفات الثابتة (CSS, JS, صور النظام الثابتة)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
