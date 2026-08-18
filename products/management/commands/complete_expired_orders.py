from products.services.merchant.show_products import complete_expired_orders_service
from django.core.management.base import BaseCommand

class Command(BaseCommand):

    help = "Complete and archive expired orders"

    def handle(self, *args, **options):

        completed_orders = complete_expired_orders_service()

        if completed_orders:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Completed orders: {completed_orders}"
                )
            )
        else:
            self.stdout.write(
                "No orders were completed."
            )