from django.db import models
from django.conf import settings


class AccountCOA(models.Model):
    KATEGORI_CHOICES = [
        ("Cash & Bank", "Cash & Bank"),
        ("Accounts Receivable (A/R)", "Accounts Receivable (A/R)"),
        ("Inventory", "Inventory"),
        ("Other Current Assets", "Other Current Assets"),
        ("Fixed Assets", "Fixed Assets"),
        ("Depreciation & Amortization", "Depreciation & Amortization"),
        ("Other Assets", "Other Assets"),
        ("Accounts Payable (A/P)", "Accounts Payable (A/P)"),
        ("Other Current Liabilities", "Other Current Liabilities"),
        ("Long Term Liabilities", "Long Term Liabilities"),
        ("Equity", "Equity"),
        ("Income", "Income"),
        ("Cost of Sales", "Cost of Sales"),
        ("Expenses", "Expenses"),
        ("Other Income", "Other Income"),
        ("Other Expense", "Other Expense"),
    ]

    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="coa_accounts",
    )
    kode_akun = models.CharField(max_length=20)
    nama_akun = models.CharField(max_length=255)
    kategori_akun = models.CharField(max_length=50, choices=KATEGORI_CHOICES)
    pengguna = models.CharField(max_length=100, default="all")
    pajak = models.CharField(max_length=50, blank=True, default="")
    deskripsi_pajak = models.TextField(blank=True, default="")
    saldo = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["kode_akun"]
        unique_together = ("company", "kode_akun")

    def __str__(self):
        return f"{self.kode_akun} - {self.nama_akun}"
