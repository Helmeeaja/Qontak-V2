import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qontak_sales.settings")
django.setup()

from qontak_sales.apps.accounts_coa.models import AccountCOA
from qontak_sales.apps.accounts.models import Company

# Ambil company pertama, atau buat jika belum ada
company = Company.objects.first()
if not company:
    company = Company.objects.create(name="Perusahaan Demo")
    print(f"Company belum ada, otomatis dibuat: {company.name}")

print(f"Seeding COA untuk company: {company.name}")

COA_DATA = [
    # Cash & Bank
    ("1-10001", "Kas", "Cash & Bank", "all", "", 7500000.00),
    ("1-10002", "Rekening Bank", "Cash & Bank", "all", "", 65055500.00),
    ("1-10003", "Giro", "Cash & Bank", "all", "", 0.00),
    # Accounts Receivable
    ("1-10100", "Piutang Usaha", "Accounts Receivable (A/R)", "all", "", 0.00),
    ("1-10101", "Piutang Belum Ditagih", "Accounts Receivable (A/R)", "all", "", 0.00),
    ("1-10102", "Cadangan Kerugian Piutang", "Accounts Receivable (A/R)", "all", "", 0.00),
    # Inventory
    ("1-10200", "Persediaan Barang", "Inventory", "all", "", 0.00),
    # Other Current Assets
    ("1-10300", "Piutang Lainnya", "Other Current Assets", "all", "", 0.00),
    ("1-10301", "Piutang Karyawan", "Other Current Assets", "all", "", 0.00),
    ("1-10400", "Dana Belum Disetor", "Other Current Assets", "all", "", 0.00),
    ("1-10401", "Aset Lancar Lainnya", "Other Current Assets", "all", "", 0.00),
    ("1-10402", "Biaya Dibayar Di Muka", "Other Current Assets", "all", "", 0.00),
    ("1-10403", "Uang Muka", "Other Current Assets", "all", "", 0.00),
    ("1-10500", "PPN Masukan", "Other Current Assets", "all", "", 49500.00),
    ("1-10501", "Pajak Dibayar Di Muka - PPh 22", "Other Current Assets", "all", "", 0.00),
    ("1-10502", "Pajak Dibayar Di Muka - PPh 23", "Other Current Assets", "all", "", 0.00),
    ("1-10503", "Pajak Dibayar Di Muka - PPh 25", "Other Current Assets", "all", "", 0.00),
    # Fixed Assets
    ("1-10700", "Aset Tetap - Tanah", "Fixed Assets", "all", "", 0.00),
    ("1-10701", "Aset Tetap - Bangunan", "Fixed Assets", "all", "", 0.00),
    ("1-10702", "Aset Tetap - Building Improvements", "Fixed Assets", "all", "", 0.00),
    ("1-10703", "Aset Tetap - Kendaraan", "Fixed Assets", "all", "", 0.00),
    ("1-10704", "Aset Tetap - Mesin & Peralatan", "Fixed Assets", "all", "", 0.00),
    ("1-10705", "Aset Tetap - Perlengkapan Kantor", "Fixed Assets", "all", "", 450000.00),
    ("1-10706", "Aset Tetap - Aset Sewa Guna Usaha", "Fixed Assets", "all", "", 0.00),
    ("1-10707", "Aset Tak Berwujud", "Fixed Assets", "all", "", 0.00),
    ("1-10708", "Hak Merek Dagang", "Fixed Assets", "all", "", 0.00),
    ("1-10709", "Hak Cipta", "Fixed Assets", "all", "", 0.00),
    ("1-10710", "Good Will", "Fixed Assets", "all", "", 0.00),
    # Depreciation & Amortization
    ("1-10751", "Akumulasi Penyusutan - Bangunan", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10752", "Akumulasi Penyusutan - Building Improvements", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10753", "Akumulasi penyusutan - Kendaraan", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10754", "Akumulasi Penyusutan - Mesin & Peralatan", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10755", "Akumulasi Penyusutan - Peralatan Kantor", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10756", "Akumulasi Penyusutan - Aset Sewa Guna Usaha", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10757", "Akumulasi Amortisasi", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10758", "Akumulasi Amortisasi : Hak Merek Dagang", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10759", "Akumulasi Amortisasi : Hak Cipta", "Depreciation & Amortization", "all", "", 0.00),
    ("1-10760", "Akumulasi Amortisasi : Good Will", "Depreciation & Amortization", "all", "", 0.00),
    # Other Assets
    ("1-10800", "Investasi", "Other Assets", "all", "", 0.00),
    # Accounts Payable
    ("2-20100", "Hutang Usaha", "Accounts Payable (A/P)", "all", "", 0.00),
    ("2-20101", "Hutang Belum Ditagih", "Accounts Payable (A/P)", "all", "", 0.00),
    # Other Current Liabilities
    ("2-20200", "Hutang Lain Lain", "Other Current Liabilities", "all", "", 0.00),
    ("2-20201", "Hutang Gaji", "Other Current Liabilities", "all", "", 0.00),
    ("2-20202", "Hutang Deviden", "Other Current Liabilities", "all", "", 0.00),
    ("2-20203", "Pendapatan Diterima Di Muka", "Other Current Liabilities", "all", "", 0.00),
    ("2-20301", "Sarana Kantor Terhutang", "Other Current Liabilities", "all", "", 0.00),
    ("2-20302", "Bunga Terhutang", "Other Current Liabilities", "all", "", 0.00),
    ("2-20399", "Biaya Terhutang Lainnya", "Other Current Liabilities", "all", "", 0.00),
    ("2-20400", "Hutang Bank", "Other Current Liabilities", "all", "", 0.00),
    ("2-20500", "PPN Keluaran", "Other Current Liabilities", "all", "", 55000.00),
    ("2-20501", "Hutang Pajak - PPh 21", "Other Current Liabilities", "all", "", 0.00),
    ("2-20502", "Hutang Pajak - PPh 22", "Other Current Liabilities", "all", "", 0.00),
    ("2-20503", "Hutang Pajak - PPh 23", "Other Current Liabilities", "all", "", 0.00),
    ("2-20504", "Hutang Pajak - PPh 29", "Other Current Liabilities", "all", "", 0.00),
    ("2-20599", "Hutang Pajak Lainnya", "Other Current Liabilities", "all", "", 0.00),
    ("2-20600", "Hutang dari Pemegang Saham", "Other Current Liabilities", "all", "", 0.00),
    ("2-20601", "Kewajiban Lancar Lainnya", "Other Current Liabilities", "all", "", 0.00),
    # Long Term Liabilities
    ("2-20700", "Kewajiban Manfaat Karyawan", "Long Term Liabilities", "all", "", 0.00),
    # Equity
    ("3-30000", "Modal Saham", "Equity", "all", "", 90000000.00),
    ("3-30001", "Tambahan Modal Disetor", "Equity", "all", "", 0.00),
    ("3-30100", "Laba Ditahan", "Equity", "all", "", 0.00),
    ("3-30200", "Deviden", "Equity", "all", "", 0.00),
    ("3-30300", "Pendapatan Komprehensif Lainnya", "Equity", "all", "", -15000000.00),
    ("3-30999", "Ekuitas Saldo Awal", "Equity", "all", "", 0.00),
    # Income
    ("4-40000", "Pendapatan Jasa", "Income", "all", "", 500000.00),
    ("4-40100", "Diskon Penjualan", "Income", "all", "", 0.00),
    ("4-40200", "Retur Penjualan", "Income", "all", "", 0.00),
    ("4-40201", "Pendapatan Belum Ditagih", "Income", "all", "", 0.00),
    # Cost of Sales
    ("5-50000", "Beban Pokok Pendapatan", "Cost of Sales", "all", "", 0.00),
    ("5-50100", "Diskon Pembelian", "Cost of Sales", "all", "", 0.00),
    ("5-50200", "Retur Pembelian", "Cost of Sales", "all", "", 0.00),
    ("5-50300", "Pengiriman & Pengangkutan", "Cost of Sales", "all", "", 0.00),
    ("5-50400", "Biaya Impor", "Cost of Sales", "all", "", 0.00),
    ("5-50500", "Biaya Produksi", "Cost of Sales", "all", "", 0.00),
    # Expenses
    ("6-60000", "Biaya Penjualan", "Expenses", "all", "", 0.00),
    ("6-60001", "Iklan & Promosi", "Expenses", "all", "", 0.00),
    ("6-60002", "Komisi & Fee", "Expenses", "all", "", 0.00),
    ("6-60003", "Bensin, Tol dan Parkir - Penjualan", "Expenses", "all", "", 0.00),
    ("6-60004", "Perjalanan Dinas - Penjualan", "Expenses", "all", "", 0.00),
    ("6-60005", "Komunikasi - Penjualan", "Expenses", "all", "", 0.00),
    ("6-60006", "Marketing Lainnya", "Expenses", "all", "", 0.00),
    ("6-60100", "Biaya Umum & Administratif", "Expenses", "all", "", 0.00),
    ("6-60101", "Gaji", "Expenses", "all", "", 0.00),
    ("6-60102", "Upah", "Expenses", "all", "", 0.00),
    ("6-60103", "Makanan & Transportasi", "Expenses", "all", "", 0.00),
    ("6-60104", "Lembur", "Expenses", "all", "", 0.00),
    ("6-60105", "Pengobatan", "Expenses", "all", "", 0.00),
    ("6-60106", "THR & Bonus", "Expenses", "all", "", 0.00),
    ("6-60107", "Jamsostek", "Expenses", "all", "", 0.00),
    ("6-60108", "Insentif", "Expenses", "all", "", 0.00),
    ("6-60109", "Pesangon", "Expenses", "all", "", 0.00),
    ("6-60110", "Manfaat dan Tunjangan Lain", "Expenses", "all", "", 0.00),
    ("6-60200", "Donasi", "Expenses", "all", "", 0.00),
    ("6-60201", "Hiburan", "Expenses", "all", "", 0.00),
    ("6-60202", "Bensin, Tol dan Parkir - Umum", "Expenses", "all", "", 0.00),
    ("6-60203", "Perbaikan & Pemeliharaan", "Expenses", "all", "", 0.00),
    ("6-60204", "Perjalanan Dinas - Umum", "Expenses", "all", "", 0.00),
    ("6-60205", "Makanan", "Expenses", "all", "", 0.00),
    ("6-60206", "Komunikasi - Umum", "Expenses", "all", "", 0.00),
    ("6-60207", "Iuran & Langganan", "Expenses", "all", "", 0.00),
    ("6-60208", "Asuransi", "Expenses", "all", "", 0.00),
    ("6-60209", "Legal & Profesional", "Expenses", "all", "", 0.00),
    ("6-60210", "Beban Manfaat Karyawan", "Expenses", "all", "", 0.00),
    ("6-60211", "Sarana Kantor", "Expenses", "all", "", 0.00),
    ("6-60212", "Pelatihan & Pengembangan", "Expenses", "all", "", 0.00),
    ("6-60213", "Beban Piutang Tak Tertagih", "Expenses", "all", "", 0.00),
    ("6-60214", "Pajak dan Perizinan", "Expenses", "all", "", 0.00),
    ("6-60215", "Denda", "Expenses", "all", "", 0.00),
    ("6-60216", "Pengeluaran Barang Rusak", "Expenses", "all", "", 0.00),
    ("6-60217", "Listrik", "Expenses", "all", "", 0.00),
    ("6-60218", "Air", "Expenses", "all", "", 0.00),
    ("6-60219", "IPL", "Expenses", "all", "", 0.00),
    ("6-60220", "Langganan Software", "Expenses", "all", "", 0.00),
    ("6-60221", "Beban Gaji Karyawan", "Expenses", "all", "PPN", 2500000.00),
    ("6-60300", "Beban Kantor", "Expenses", "all", "", 0.00),
    ("6-60301", "Alat Tulis Kantor & Printing", "Expenses", "all", "", 0.00),
    ("6-60302", "Bea Materai", "Expenses", "all", "", 0.00),
    ("6-60303", "Keamanan dan Kebersihan", "Expenses", "all", "", 0.00),
    ("6-60304", "Supplies dan Material", "Expenses", "all", "", 0.00),
    ("6-60305", "Pemborong", "Expenses", "all", "", 0.00),
    ("6-60400", "Biaya Sewa - Bangunan", "Expenses", "all", "", 0.00),
    ("6-60401", "Biaya Sewa - Kendaraan", "Expenses", "all", "", 0.00),
    ("6-60402", "Biaya Sewa - Operasional", "Expenses", "all", "", 0.00),
    ("6-60403", "Biaya Sewa - Lain - lain", "Expenses", "all", "", 0.00),
    ("6-60500", "Penyusutan - Bangunan", "Expenses", "all", "", 0.00),
    ("6-60501", "Penyusutan - Perbaikan Bangunan", "Expenses", "all", "", 0.00),
    ("6-60502", "Penyusutan - Kendaraan", "Expenses", "all", "", 0.00),
    ("6-60503", "Penyusutan - Mesin & Peralatan", "Expenses", "all", "", 0.00),
    ("6-60504", "Penyusutan - Peralatan Kantor", "Expenses", "all", "", 0.00),
    ("6-60599", "Penyusutan - Aset Sewa Guna Usaha", "Expenses", "all", "", 0.00),
    ("6-60600", "Amortisasi : Hak Merek Dagang", "Expenses", "all", "", 0.00),
    ("6-60601", "Amortisasi : Hak Cipta", "Expenses", "all", "", 0.00),
    ("6-60602", "Amortisasi : Good Will", "Expenses", "all", "", 0.00),
    # Other Income
    ("7-70000", "Pendapatan Bunga - Bank", "Other Income", "all", "", 0.00),
    ("7-70001", "Pendapatan Bunga - Deposito", "Other Income", "all", "", 0.00),
    ("7-70002", "Pembulatan", "Other Income", "all", "", 0.00),
    ("7-70099", "Pendapatan Lain - lain", "Other Income", "all", "", 0.00),
    # Other Expense
    ("8-80000", "Beban Bunga", "Other Expense", "all", "", 0.00),
    ("8-80001", "Provisi", "Other Expense", "all", "", 0.00),
    ("8-80002", "(Laba)/Rugi Pelepasan Aset Tetap", "Other Expense", "all", "", 0.00),
    ("8-80100", "Penyesuaian Persediaan", "Other Expense", "all", "", 0.00),
    ("8-80999", "Beban Lain - lain", "Other Expense", "all", "", 0.00),
    ("9-90000", "Beban Pajak - Kini", "Other Expense", "all", "", 0.00),
    ("9-90001", "Beban Pajak - Tangguhan", "Other Expense", "all", "", 0.00),
]

created = 0
skipped = 0
for kode, nama, kategori, pengguna, pajak, saldo in COA_DATA:
    obj, was_created = AccountCOA.objects.get_or_create(
        company=company,
        kode_akun=kode,
        defaults={
            "nama_akun": nama,
            "kategori_akun": kategori,
            "pengguna": pengguna,
            "pajak": pajak,
            "saldo": saldo,
        },
    )
    if was_created:
        created += 1
    else:
        skipped += 1

print(f"Selesai! {created} akun dibuat, {skipped} sudah ada (skipped).")
