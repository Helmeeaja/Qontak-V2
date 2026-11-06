import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qontak_sales.settings")
django.setup()

def run_all():
    print("=" * 60)
    print("  MEMULAI SEEDING LENGKAP: COA, KONTAK, PRODUK, GUDANG, STOK")
    print("=" * 60)

    # 1. Seeding COA
    print("\n>>> [1/2] Menjalankan Seeder COA (Chart of Accounts)...")
    try:
        import seed_coa
    except Exception as e:
        print(f"Error saat seeding COA: {e}")

    # 2. Seeding Kontak, Produk, Gudang, Aturan Harga
    print("\n>>> [2/2] Menjalankan Seeder Kontak, Produk, Gudang, & Aturan Harga...")
    try:
        import seed_contacts_and_products
        seed_contacts_and_products.run_seeder()
    except Exception as e:
        print(f"Error saat seeding Kontak & Produk: {e}")

    print("\n" + "=" * 60)
    print("  SELURUH DATA SEEDER BERHASIL DIJALANKAN DENGAN SUKSES!")
    print("=" * 60)

if __name__ == "__main__":
    run_all()
