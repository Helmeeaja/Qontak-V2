from rest_framework import serializers
from .models import AccountCOA


class AccountCOASerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountCOA
        fields = [
            "id",
            "kode_akun",
            "nama_akun",
            "kategori_akun",
            "pengguna",
            "pajak",
            "deskripsi_pajak",
            "saldo",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
