from rest_framework import serializers
from .models import (
    Warehouse,
    WarehouseStock,
    StockAdjustment,
    StockAdjustmentItem,
    WarehouseTransfer,
    WarehouseTransferItem,
    WarehouseTransferAttachment,
)


class WarehouseSerializer(serializers.ModelSerializer):
    pic_names = serializers.SerializerMethodField(read_only=True)
    total_products = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Warehouse
        fields = [
            "id",
            "company",
            "name",
            "code",
            "address",
            "description",
            "pics",
            "pic_names",
            "total_products",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def get_pic_names(self, obj):
        return [u.get_full_name() or u.username for u in obj.pics.all()]

    def get_total_products(self, obj):
        return obj.stocks.filter(quantity__gt=0).count()


class WarehouseStockSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_code = serializers.ReadOnlyField(source="product.code")
    product_unit = serializers.ReadOnlyField(source="product.unit.name")

    class Meta:
        model = WarehouseStock
        fields = [
            "id",
            "warehouse",
            "product",
            "product_name",
            "product_code",
            "product_unit",
            "quantity",
            "updated_at",
        ]


class StockAdjustmentItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_code = serializers.ReadOnlyField(source="product.code")

    class Meta:
        model = StockAdjustmentItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_code",
            "system_quantity",
            "actual_quantity",
            "difference_quantity",
            "unit_cost",
            "total_amount",
        ]


class StockAdjustmentSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.ReadOnlyField(source="warehouse.name")
    items = StockAdjustmentItemSerializer(many=True, required=False)

    class Meta:
        model = StockAdjustment
        fields = [
            "id",
            "company",
            "transaction_no",
            "date",
            "adjustment_type",
            "category",
            "account_id",
            "warehouse",
            "warehouse_name",
            "status",
            "tags",
            "notes",
            "items",
            "created_by",
            "created_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        adjustment = StockAdjustment.objects.create(**validated_data)
        for item in items_data:
            StockAdjustmentItem.objects.create(adjustment=adjustment, **item)
        return adjustment


class WarehouseTransferItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_code = serializers.ReadOnlyField(source="product.code")

    class Meta:
        model = WarehouseTransferItem
        fields = ["id", "product", "product_name", "product_code", "quantity"]


class WarehouseTransferAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseTransferAttachment
        fields = ["id", "file", "file_name", "file_size", "uploaded_at"]


class WarehouseTransferSerializer(serializers.ModelSerializer):
    from_warehouse_name = serializers.ReadOnlyField(source="from_warehouse.name")
    to_warehouse_name = serializers.ReadOnlyField(source="to_warehouse.name")
    items = WarehouseTransferItemSerializer(many=True, required=False)
    attachments = WarehouseTransferAttachmentSerializer(many=True, required=False)

    class Meta:
        model = WarehouseTransfer
        fields = [
            "id",
            "company",
            "transaction_no",
            "date",
            "from_warehouse",
            "from_warehouse_name",
            "to_warehouse",
            "to_warehouse_name",
            "memo",
            "status",
            "items",
            "attachments",
            "created_by",
            "created_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        transfer = WarehouseTransfer.objects.create(**validated_data)
        for item in items_data:
            WarehouseTransferItem.objects.create(transfer=transfer, **item)
        return transfer
