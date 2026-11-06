import os
import django
from decimal import Decimal
from datetime import date

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qontak_sales.settings")
django.setup()

from qontak_sales.apps.accounts.models import Company, CustomUser
from qontak_sales.apps.contacts.models import Contact, ContactGroup, ContactBankAccount
from qontak_sales.apps.products.models import ProductCategory, ProductUnit, Product, ProductBundleItem
from qontak_sales.apps.inventory.models import (
    Warehouse,
    WarehouseStock,
    StockAdjustment,
    StockAdjustmentItem,
    WarehouseTransfer,
    WarehouseTransferItem,
    WarehouseTransferAttachment,
)
from qontak_sales.apps.pricerules.models import PriceRule, PriceRuleContact, PriceRuleProduct


def run_seeder():
    print("=== Memulai Seeding Data Kontak, Produk, Gudang & Aturan Harga ===")

    company = Company.objects.first()
    if not company:
        company = Company.objects.create(name="PT Qontak Solusi Pratama")
        print(f"[OK] Dibuat Company default: {company.name}")
    else:
        print(f"[INFO] Menggunakan Company: {company.name}")

    user = CustomUser.objects.filter(is_superuser=True).first() or CustomUser.objects.first()

    # 1. Grup Kontak
    grp_vip, _ = ContactGroup.objects.get_or_create(
        name="VIP Client",
        defaults={"company": company}
    )
    grp_supplier, _ = ContactGroup.objects.get_or_create(
        name="Supplier Utama",
        defaults={"company": company}
    )
    print("[OK] Seeding ContactGroup selesai.")

    # 2. Master Kontak
    c1, _ = Contact.objects.get_or_create(
        display_name="PT Sinar Abadi Sentosa",
        defaults={
            "company": company,
            "contact_types": ["customer"],
            "title": "Mr.",
            "first_name": "Budi",
            "last_name": "Santoso",
            "identity_type": "KTP",
            "identity_number": "3271012345670001",
            "emails": ["finance@sinarabadi.com", "budi@sinarabadi.com"],
            "company_name": "PT Sinar Abadi Sentosa",
            "phone": "081298765432",
            "billing_address": "Jl. Jend. Sudirman Kav 21, Jakarta Selatan",
            "citizenship": "indonesian",
            "npwp": "1234567890123456",
            "receivable_account_id": "1-10100",
            "payable_account_id": "2-20100",
            "payment_term": "net30",
            "balance": Decimal("25000000.00"),
        }
    )
    c1.groups.add(grp_vip)

    c2, _ = Contact.objects.get_or_create(
        display_name="CV Maju Jaya Supplier",
        defaults={
            "company": company,
            "contact_types": ["vendor"],
            "title": "Mr.",
            "first_name": "Hendra",
            "last_name": "Kurniawan",
            "identity_type": "KTP",
            "identity_number": "3171098765430002",
            "emails": ["sales@majujaya.co.id"],
            "company_name": "CV Maju Jaya Supplier",
            "phone": "081345678901",
            "billing_address": "Jl. Industri No. 45, Kawasan MM2100, Bekasi",
            "citizenship": "indonesian",
            "npwp": "9876543210987654",
            "receivable_account_id": "1-10100",
            "payable_account_id": "2-20100",
            "payment_term": "net15",
            "balance": Decimal("-15000000.00"),
        }
    )
    c2.groups.add(grp_supplier)

    # 3. Rekening Bank Kontak
    ContactBankAccount.objects.get_or_create(
        contact=c1,
        account_number="8870123456",
        defaults={
            "bank_name": "PT. BANK CENTRAL ASIA TBK.",
            "branch": "KCP Sudirman",
            "holder_name": "PT Sinar Abadi Sentosa",
        }
    )
    ContactBankAccount.objects.get_or_create(
        contact=c2,
        account_number="1560009876543",
        defaults={
            "bank_name": "PT. BANK MANDIRI (PERSERO) TBK.",
            "branch": "KC Bekasi",
            "holder_name": "CV Maju Jaya Supplier",
        }
    )
    print("[OK] Seeding Contact & Bank Accounts selesai.")

    # 4. Kategori Produk & Satuan
    cat_elektronik, _ = ProductCategory.objects.get_or_create(
        name="Elektronik & Aksesoris",
        defaults={"company": company, "description": "Komponen dan perangkat elektronik"}
    )
    cat_atk, _ = ProductCategory.objects.get_or_create(
        name="Alat Tulis Kantor",
        defaults={"company": company, "description": "Kebutuhan administrasi dan ATK"}
    )

    unit_pcs, _ = ProductUnit.objects.get_or_create(
        name="Pieces",
        defaults={"company": company, "symbol": "Pcs"}
    )
    unit_box, _ = ProductUnit.objects.get_or_create(
        name="Box",
        defaults={"company": company, "symbol": "Box"}
    )

    # 5. Master Produk
    p1, _ = Product.objects.get_or_create(
        code="SKU-LSA-01",
        defaults={
            "company": company,
            "name": "Laptop Stand Aluminium Adjustable",
            "barcode": "899123456701",
            "unit": unit_pcs,
            "category": cat_elektronik,
            "description": "Stand laptop ergonomis bahan aluminium alloy",
            "product_type": "Single",
            "inventory_tracking": "tracked",
            "track_mode": "no_tracking",
            "minimum_stock": Decimal("10.00"),
            "buy_price": Decimal("150000.00"),
            "sell_price": Decimal("250000.00"),
            "total_stock": Decimal("85.00"),
            "available_qty": Decimal("85.00"),
        }
    )

    p2, _ = Product.objects.get_or_create(
        code="BNDL-WFH-01",
        defaults={
            "company": company,
            "name": "Paket Work From Home Ergonomic",
            "barcode": "899123456702",
            "unit": unit_box,
            "category": cat_elektronik,
            "description": "Paket bundle stand laptop + wireless mouse",
            "product_type": "Bundle",
            "inventory_tracking": "tracked",
            "track_mode": "no_tracking",
            "minimum_stock": Decimal("5.00"),
            "buy_price": Decimal("250000.00"),
            "sell_price": Decimal("399000.00"),
            "total_stock": Decimal("20.00"),
            "available_qty": Decimal("20.00"),
        }
    )

    # Komponen Bundle
    ProductBundleItem.objects.get_or_create(
        bundle_product=p2,
        component_product=p1,
        defaults={
            "quantity": Decimal("1.00"),
            "unit_cost_allocation": Decimal("150000.00"),
        }
    )
    print("[OK] Seeding Products & Bundle components selesai.")

    # 6. Master Gudang
    wh1, _ = Warehouse.objects.get_or_create(
        code="WH-CGK-01",
        defaults={
            "company": company,
            "name": "Gudang Pusat Cengkareng",
            "address": "Kawasan Pergudangan Daan Mogot KM 12, Jakarta Barat",
            "description": "Gudang operasional pusat jabodetabek",
            "is_active": True,
        }
    )
    wh2, _ = Warehouse.objects.get_or_create(
        code="WH-SUB-01",
        defaults={
            "company": company,
            "name": "Gudang Transit Surabaya",
            "address": "Jl. Rungkut Industri Raya No. 10, Surabaya",
            "description": "Gudang distribusi wilayah Jawa Timur",
            "is_active": True,
        }
    )
    if user:
        wh1.pics.add(user)
        wh2.pics.add(user)

    # Stok Gudang
    WarehouseStock.objects.get_or_create(
        warehouse=wh1,
        product=p1,
        defaults={"quantity": Decimal("55.00")}
    )
    WarehouseStock.objects.get_or_create(
        warehouse=wh2,
        product=p1,
        defaults={"quantity": Decimal("30.00")}
    )
    print("[OK] Seeding Warehouses & Stocks selesai.")

    # 7. Penyesuaian Stok (Stok Opname)
    adj, _ = StockAdjustment.objects.get_or_create(
        transaction_no="ADJ-202610-0001",
        defaults={
            "company": company,
            "date": date(2026, 10, 20),
            "adjustment_type": "stock_count",
            "category": "General",
            "account_id": "8-80100",
            "warehouse": wh1,
            "status": "APPROVED",
            "notes": "Penyesuaian stok berkala akhir kuartal 3",
            "created_by": user,
        }
    )
    StockAdjustmentItem.objects.get_or_create(
        adjustment=adj,
        product=p1,
        defaults={
            "system_quantity": Decimal("57.00"),
            "actual_quantity": Decimal("55.00"),
            "difference_quantity": Decimal("-2.00"),
            "unit_cost": Decimal("150000.00"),
            "total_amount": Decimal("-300000.00"),
        }
    )
    print("[OK] Seeding Stock Adjustments selesai.")

    # 8. Transfer Gudang
    trf, _ = WarehouseTransfer.objects.get_or_create(
        transaction_no="TRF-202610-0001",
        defaults={
            "company": company,
            "date": date(2026, 10, 22),
            "from_warehouse": wh1,
            "to_warehouse": wh2,
            "memo": "Relokasi stok Stand Laptop ke cabang Surabaya",
            "status": "APPROVED",
            "created_by": user,
        }
    )
    WarehouseTransferItem.objects.get_or_create(
        transfer=trf,
        product=p1,
        defaults={"quantity": Decimal("20.00")}
    )
    WarehouseTransferAttachment.objects.get_or_create(
        transfer=trf,
        file_name="surat_jalan_TRF001.pdf",
        defaults={"file_size": 245760}
    )
    print("[OK] Seeding Warehouse Transfers selesai.")

    # 9. Aturan Harga
    r1, _ = PriceRule.objects.get_or_create(
        name="Promo Akhir Tahun VIP 15%",
        defaults={
            "company": company,
            "start_date": date(2026, 11, 1),
            "end_date": date(2026, 12, 31),
            "rule_type": "percentage_discount",
            "value": Decimal("15.00"),
            "is_active": True,
            "apply_to_all_contacts": False,
            "apply_to_all_products": True,
        }
    )
    PriceRuleContact.objects.get_or_create(price_rule=r1, group=grp_vip)

    r2, _ = PriceRule.objects.get_or_create(
        name="Diskon Supplier Grosir Rp 20.000",
        defaults={
            "company": company,
            "start_date": date(2026, 10, 1),
            "end_date": date(2026, 11, 30),
            "rule_type": "fixed_discount",
            "value": Decimal("20000.00"),
            "is_active": True,
            "apply_to_all_contacts": True,
            "apply_to_all_products": False,
        }
    )
    PriceRuleProduct.objects.get_or_create(price_rule=r2, product=p1)
    print("[OK] Seeding Price Rules selesai.")

    print("\n[SUKSES] SEMUA DATA DUMMY BERHASIL DITAMBAHKAN KE DATABASE!")


if __name__ == "__main__":
    run_seeder()
