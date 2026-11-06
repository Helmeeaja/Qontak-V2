from django.contrib import admin
from .models import (
    Warehouse,
    WarehouseStock,
    StockAdjustment,
    StockAdjustmentItem,
    WarehouseTransfer,
    WarehouseTransferItem,
    WarehouseTransferAttachment,
)


class WarehouseStockInline(admin.TabularInline):
    model = WarehouseStock
    extra = 1


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active", "created_at"]
    search_fields = ["name", "code"]
    list_filter = ["is_active"]
    inlines = [WarehouseStockInline]


class StockAdjustmentItemInline(admin.TabularInline):
    model = StockAdjustmentItem
    extra = 1


@admin.register(StockAdjustment)
class StockAdjustmentAdmin(admin.ModelAdmin):
    list_display = ["transaction_no", "date", "adjustment_type", "warehouse", "status"]
    list_filter = ["adjustment_type", "status", "warehouse"]
    search_fields = ["transaction_no"]
    inlines = [StockAdjustmentItemInline]


class WarehouseTransferItemInline(admin.TabularInline):
    model = WarehouseTransferItem
    extra = 1


class WarehouseTransferAttachmentInline(admin.TabularInline):
    model = WarehouseTransferAttachment
    extra = 0


@admin.register(WarehouseTransfer)
class WarehouseTransferAdmin(admin.ModelAdmin):
    list_display = ["transaction_no", "date", "from_warehouse", "to_warehouse", "status"]
    list_filter = ["status", "from_warehouse", "to_warehouse"]
    search_fields = ["transaction_no"]
    inlines = [WarehouseTransferItemInline, WarehouseTransferAttachmentInline]
