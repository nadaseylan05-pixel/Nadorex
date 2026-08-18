from django.apps import AppConfig

class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'products'
   
class RequestsAppConfig(AppConfig):
    name = 'requests_app'

    def ready(self):
        import products.signals  # هذا السطر يشغل أي كود في signals.py