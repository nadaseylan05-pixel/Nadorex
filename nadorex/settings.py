import os
# import dj_database_url
from pathlib import Path

import os
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = os.getenv("SECRET_KEY")


DEBUG = os.getenv("DEBUG", "False").lower() == "true"
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' 
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = os.getenv("EMAIL_PORT")
EMAIL_HOST_USER =os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")


# ALLOWED_HOSTS = []

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("ALLOWED_HOSTS", "").split(",")
    if host.strip()
]
#Application definition
import pymysql
pymysql.install_as_MySQLdb()

INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'products',
    'cloudinary_storage',
    'cloudinary',
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'nadorex.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'products.context_processors.inject_translations',
            ],
        },
    },
]
WSGI_APPLICATION = 'nadorex.wsgi.application'

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL")
    ),
    "old_mysql": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("OLD_DB_NAME"),
        "USER": os.getenv("OLD_DB_USER"),
        "PASSWORD": os.getenv("OLD_DB_PASSWORD"),
        "HOST": os.getenv("OLD_DB_HOST"),
        "PORT": os.getenv("OLD_DB_PORT", "3306"),
    }
    
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True
# CORS_ALLOWED_ORIGINS =[
#     "http://localhost:8000",
#     "http://localhost:5176",
# ]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    os.getenv("FRONTEND_URL"),
]
CORS_ALLOW_CREDENTIALS =True

STATIC_URL = '/static/'  # لازم يكون فيه سلاش في البداية والنهاية
STATIC_ROOT = '/static/'

LOGIN_URL = 'register'

# إضافة هذا السطر مهم جداً ليعرف Django من وين يجيب الملفات الثابتة
STATICFILES_DIRS = [
    BASE_DIR / "products" / "static",
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# ================================
# Logging setup (لإظهار رسائل debug في الكونسول)
# ================================
import logging

LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',  # يمكنك تغييره إلى INFO أو ERROR إذا أردتِ تقليل التفاصيل
    },
}
# SESSION_COOKIE_SAMESITE = 'Lax'
# CSRF_COOKIE_SAMESITE = 'Lax'

# # لمنع المتصفح من حظر الكوكيز أثناء استخدام http المحلي (Localhost)
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = False
# SESSION_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
# SESSION_COOKIE_SECURE = not DEBUG

# CSRF_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
# CSRF_COOKIE_SECURE = not DEBUG

# CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False

CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False

CORS_ALLOW_CREDENTIALS = True

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1), # تم زيادة العمر إلى يوم كامل
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
}
import smtplib

try:
    print("SMTP TEST START", flush=True)

    server = smtplib.SMTP_SSL(
        EMAIL_HOST,
        EMAIL_PORT,
        timeout=10
    )

    print("SMTP CONNECTION OK", flush=True)

    server.login(
        EMAIL_HOST_USER,
        EMAIL_HOST_PASSWORD
    )

    print("SMTP LOGIN OK", flush=True)

    server.quit()

except Exception as e:
    print("SMTP TEST ERROR:", type(e).__name__, flush=True)
    print("SMTP TEST MESSAGE:", str(e), flush=True)
    
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}