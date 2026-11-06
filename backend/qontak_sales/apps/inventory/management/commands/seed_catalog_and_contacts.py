from django.core.management.base import BaseCommand
import seed_contacts_and_products


class Command(BaseCommand):
    help = "Seed initial/dummy data for Contacts, Products, Inventory, and Price Rules"

    def handle(self, *args, **options):
        seed_contacts_and_products.run_seeder()
        self.stdout.write(self.style.SUCCESS("Seeding berhasil dijalankan."))
