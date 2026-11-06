from django.db import transaction
from django.db.models import F, Q
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from qontak_sales.apps.accounts.permissions import ModulePermission
from qontak_sales.common.views import SingletonSettingView

from .models import (
    Product,
    ProductBatchReminder,
    ProductCategory,
    ProductSetting,
    ProductUnit,
)
from .serializers import (
    ProductBatchReminderSerializer,
    ProductCategorySerializer,
    ProductSerializer,
    ProductSettingSerializer,
    ProductUnitSerializer,
)


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = ProductCategory.objects.all()
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))
        q = self.request.query_params.get("search")
        if q:
            qs = qs.filter(name__icontains=q)
        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)


class ProductUnitViewSet(viewsets.ModelViewSet):
    queryset = ProductUnit.objects.all()
    serializer_class = ProductUnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = ProductUnit.objects.all()
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))
        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code", "barcode", "description"]
    ordering_fields = ["name", "code", "total_stock", "sell_price", "buy_price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = Product.objects.all().select_related("category", "unit").prefetch_related("bundle_components")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))

        # Filter: Archived
        archived = self.request.query_params.get("archived")
        if archived == "true":
            qs = qs.filter(is_archived=True)
        else:
            qs = qs.filter(is_archived=False)

        # Filter: Type (Single, Bundle)
        product_type = self.request.query_params.get("product_type")
        if product_type:
            types = [t.strip() for t in product_type.split(",") if t.strip()]
            if types:
                qs = qs.filter(product_type__in=types)

        # Filter: Category
        category_id = self.request.query_params.get("category_id")
        if category_id:
            qs = qs.filter(category_id=category_id)

        category_name = self.request.query_params.get("category")
        if category_name:
            qs = qs.filter(category__name__icontains=category_name)

        # Filter: Stock status (available, minimum/low, out)
        stock_status = self.request.query_params.get("product_stock")
        if stock_status == "available":
            qs = qs.filter(available_qty__gt=0)
        elif stock_status == "minimum" or stock_status == "low":
            qs = qs.filter(available_qty__gt=0, available_qty__lte=F("minimum_stock"))
        elif stock_status == "out":
            qs = qs.filter(available_qty__lte=0)

        # Filter: Keyword general search
        keyword = self.request.query_params.get("keyword")
        if keyword:
            qs = qs.filter(
                Q(name__icontains=keyword)
                | Q(code__icontains=keyword)
                | Q(barcode__icontains=keyword)
            )

        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)

    @action(detail=True, methods=["post"], url_path="toggle-archive")
    def toggle_archive(self, request, pk=None):
        product = self.get_object()
        product.is_archived = not product.is_archived
        product.save()
        return Response({"status": "ok", "is_archived": product.is_archived})

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """
        Ringkasan stok kartu atas ProductStatCards:
        Stok tersedia, Stok menipis, Stok habis
        """
        qs = self.get_queryset()
        available_count = qs.filter(available_qty__gt=0).count()
        low_stock_count = qs.filter(
            available_qty__gt=0, available_qty__lte=F("minimum_stock")
        ).count()
        out_of_stock_count = qs.filter(available_qty__lte=0).count()

        return Response({
            "available_stock": available_count,
            "low_stock": low_stock_count,
            "out_of_stock": out_of_stock_count,
            "total_products": qs.count(),
        })


class ProductSettingView(SingletonSettingView):
    model = ProductSetting
    serializer_class = ProductSettingSerializer
    permission_classes = [ModulePermission]
    permission_module = "products"


class ProductBatchReminderListView(APIView):
    permission_classes = [ModulePermission]
    permission_module = "products"

    def get(self, request):
        reminders = ProductBatchReminder.objects.all()
        return Response(ProductBatchReminderSerializer(reminders, many=True).data)

    def put(self, request):
        serializer = ProductBatchReminderSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            ProductBatchReminder.objects.all().delete()
            ProductBatchReminder.objects.bulk_create(
                [ProductBatchReminder(**item) for item in serializer.validated_data]
            )
        reminders = ProductBatchReminder.objects.all()
        return Response(ProductBatchReminderSerializer(reminders, many=True).data)
