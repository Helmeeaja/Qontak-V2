from django.contrib import admin
from .models import AccountCOA


@admin.register(AccountCOA)
class AccountCOAAdmin(admin.ModelAdmin):
    list_display = ["kode_akun", "nama_akun", "kategori_akun", "pengguna", "pajak", "saldo", "company"]
    list_filter = ["kategori_akun", "company"]
    search_fields = ["kode_akun", "nama_akun"]
    ordering = ["kode_akun"]
