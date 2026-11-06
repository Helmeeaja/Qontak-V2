from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    Warehouse,
    WarehouseStock,
    StockAdjustment,
    WarehouseTransfer,
)
from .serializers import (
    WarehouseSerializer,
    WarehouseStockSerializer,
    StockAdjustmentSerializer,
    WarehouseTransferSerializer,
)


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all().prefetch_related("pics", "stocks")
    serializer_class = WarehouseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code", "address"]
    ordering_fields = ["name", "code", "is_active", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        user = self.request.user
        qs = Warehouse.objects.all().prefetch_related("pics", "stocks")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))

        show_inactive = self.request.query_params.get("show_inactive")
        if show_inactive != "true":
            qs = qs.filter(is_active=True)

        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)

    @action(detail=True, methods=["post"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        warehouse = self.get_object()
        warehouse.is_active = not warehouse.is_active
        warehouse.save()
        return Response({"status": "ok", "is_active": warehouse.is_active})

    @action(detail=True, methods=["get"], url_path="stocks")
    def stocks(self, request, pk=None):
        warehouse = self.get_object()
        stocks = warehouse.stocks.all().select_related("product", "product__unit")
        serializer = WarehouseStockSerializer(stocks, many=True)
        return Response(serializer.data)


class WarehouseStockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WarehouseStock.objects.all().select_related("warehouse", "product")
    serializer_class = WarehouseStockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = WarehouseStock.objects.all().select_related("warehouse", "product")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(
                Q(warehouse__company=user.company) | Q(warehouse__company__isnull=True)
            )
        warehouse_id = self.request.query_params.get("warehouse_id")
        if warehouse_id:
            qs = qs.filter(warehouse_id=warehouse_id)
        product_id = self.request.query_params.get("product_id")
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs


class StockAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = StockAdjustment.objects.all().prefetch_related("items")
    serializer_class = StockAdjustmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["transaction_no", "notes"]
    ordering_fields = ["date", "transaction_no", "created_at"]
    ordering = ["-date", "-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = StockAdjustment.objects.all().prefetch_related("items")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))

        # Filter: Date range
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date:
            qs = qs.filter(date__gte=start_date)
        if end_date:
            qs = qs.filter(date__lte=end_date)

        # Filter: Status (Require approval: PENDING_APPROVAL)
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        # Filter: Warehouse
        warehouse = self.request.query_params.get("warehouse_id")
        if warehouse:
            qs = qs.filter(warehouse_id=warehouse)

        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company, created_by=self.request.user)


class WarehouseTransferViewSet(viewsets.ModelViewSet):
    queryset = WarehouseTransfer.objects.all().prefetch_related("items", "attachments")
    serializer_class = WarehouseTransferSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["transaction_no", "memo"]
    ordering_fields = ["date", "transaction_no", "created_at"]
    ordering = ["-date", "-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = WarehouseTransfer.objects.all().prefetch_related("items", "attachments")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))

        # Filter: Date range
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date:
            qs = qs.filter(date__gte=start_date)
        if end_date:
            qs = qs.filter(date__lte=end_date)

        # Filter: Status
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company, created_by=self.request.user)
