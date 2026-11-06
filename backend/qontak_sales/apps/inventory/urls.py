from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WarehouseViewSet,
    WarehouseStockViewSet,
    StockAdjustmentViewSet,
    WarehouseTransferViewSet,
)

router = DefaultRouter()
router.register(r"warehouses", WarehouseViewSet, basename="warehouse")
router.register(r"warehouse-stocks", WarehouseStockViewSet, basename="warehouse-stock")
router.register(r"stock-adjustments", StockAdjustmentViewSet, basename="stock-adjustment")
router.register(r"warehouse-transfers", WarehouseTransferViewSet, basename="warehouse-transfer")

urlpatterns = [
    path("", include(router.urls)),
]
