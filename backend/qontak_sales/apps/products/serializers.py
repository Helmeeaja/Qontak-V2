from rest_framework import serializers
from .models import (
    Product,
    ProductBatchReminder,
    ProductBundleItem,
    ProductCategory,
    ProductSetting,
    ProductUnit,
)


class ProductCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductCategory
        fields = ["id", "name", "description", "product_count", "created_at", "updated_at"]

    def get_product_count(self, obj):
        return obj.products.count()


class ProductUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductUnit
        fields = ["id", "name", "symbol", "created_at"]


class ProductSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSetting
        exclude = ["id"]


class ProductBatchReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBatchReminder
        fields = [
            "id",
            "title",
            "interval_value",
            "interval_unit",
            "timing",
            "email_subject",
            "email_body",
        ]


class ProductBundleItemSerializer(serializers.ModelSerializer):
    component_name = serializers.ReadOnlyField(source="component_product.name")
    component_code = serializers.ReadOnlyField(source="component_product.code")
    component_unit = serializers.ReadOnlyField(source="component_product.unit.name")

    class Meta:
        model = ProductBundleItem
        fields = [
            "id",
            "component_product",
            "component_name",
            "component_code",
            "component_unit",
            "quantity",
            "unit_cost_allocation",
            "extra_cost_account_id",
        ]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")
    unit_name = serializers.ReadOnlyField(source="unit.name")
    bundle_components = ProductBundleItemSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            "id",
            "company",
            "name",
            "code",
            "barcode",
            "unit",
            "unit_name",
            "category",
            "category_name",
            "description",
            "product_type",
            "image",
            "inventory_tracking",
            "track_mode",
            "minimum_stock",
            "inventory_account_id",
            "is_purchased",
            "buy_price",
            "buy_account_id",
            "buy_tax",
            "last_buy_price",
            "is_sold",
            "sell_price",
            "sell_account_id",
            "sell_tax",
            "total_stock",
            "available_qty",
            "is_archived",
            "bundle_components",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        bundle_data = validated_data.pop("bundle_components", [])
        product = Product.objects.create(**validated_data)
        if product.product_type == "Bundle":
            for item in bundle_data:
                ProductBundleItem.objects.create(bundle_product=product, **item)
        return product

    def update(self, instance, validated_data):
        bundle_data = validated_data.pop("bundle_components", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if bundle_data is not None and instance.product_type == "Bundle":
            instance.bundle_components.all().delete()
            for item in bundle_data:
                ProductBundleItem.objects.create(bundle_product=instance, **item)

        return instance
