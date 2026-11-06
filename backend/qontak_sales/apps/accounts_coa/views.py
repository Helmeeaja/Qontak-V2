from rest_framework import viewsets, filters, permissions
from rest_framework.pagination import PageNumberPagination
from .models import AccountCOA
from .serializers import AccountCOASerializer


class COAPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 10000


class AccountCOAViewSet(viewsets.ModelViewSet):
    serializer_class = AccountCOASerializer
    pagination_class = COAPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["kode_akun", "nama_akun", "kategori_akun"]
    ordering_fields = ["kode_akun", "nama_akun", "kategori_akun", "saldo"]
    ordering = ["kode_akun"]

    def get_queryset(self):
        user = self.request.user
        queryset = AccountCOA.objects.filter(company=user.company)

        kategori = self.request.query_params.get("kategori")
        if kategori:
            queryset = queryset.filter(kategori_akun=kategori)

        return queryset

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)
