from django.contrib import admin
from .models import (
    Product,
    ProductBatchReminder,
    ProductBundleItem,
    ProductCategory,
    ProductSetting,
    ProductUnit,
)


class ProductBundleItemInline(admin.TabularInline):
    model = ProductBundleItem
    fk_name = "bundle_product"
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "product_type", "category", "sell_price", "total_stock", "is_archived"]
    search_fields = ["name", "code", "barcode"]
    list_filter = ["product_type", "category", "is_archived"]
    inlines = [ProductBundleItemInline]


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]


@admin.register(ProductUnit)
class ProductUnitAdmin(admin.ModelAdmin):
    list_display = ["name", "symbol"]
    search_fields = ["name", "symbol"]


@admin.register(ProductSetting)
class ProductSettingAdmin(admin.ModelAdmin):
    list_display = ["id", "inventory_costing_method", "enable_batch_tracking"]


@admin.register(ProductBatchReminder)
class ProductBatchReminderAdmin(admin.ModelAdmin):
    list_display = ["title", "interval_value", "interval_unit", "timing"]
    search_fields = ["title"]
