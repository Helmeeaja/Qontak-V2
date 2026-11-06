from django.db import models
from django.conf import settings


class Warehouse(models.Model):
    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="warehouses",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, blank=True, null=True, unique=True)
    address = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    pics = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="managed_warehouses"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class WarehouseStock(models.Model):
    warehouse = models.ForeignKey(
        Warehouse, on_delete=models.CASCADE, related_name="stocks"
    )
    product = models.ForeignKey(
        "products.Product", on_delete=models.CASCADE, related_name="warehouse_stocks"
    )
    quantity = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("warehouse", "product")

    def __str__(self):
        return f"{self.warehouse.name} - {self.product.name}: {self.quantity}"


class StockAdjustment(models.Model):
    ADJUSTMENT_TYPES = [
        ("stock_count", "Perhitungan stok"),
        ("in_out", "Stok masuk/keluar"),
    ]

    CATEGORY_CHOICES = [
        ("General", "General"),
        ("Damaged goods", "Damaged goods"),
        ("Production", "Production"),
        ("Opening quantity", "Opening quantity"),
    ]

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING_APPROVAL", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="stock_adjustments",
        null=True,
        blank=True,
    )
    transaction_no = models.CharField(max_length=100, unique=True)
    date = models.DateField()
    adjustment_type = models.CharField(
        max_length=30, choices=ADJUSTMENT_TYPES, default="stock_count"
    )
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, default="General"
    )
    account_id = models.CharField(max_length=50, default="8-80100")
    warehouse = models.ForeignKey(
        Warehouse, on_delete=models.RESTRICT, related_name="adjustments"
    )
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES, default="APPROVED"
    )
    tags = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_adjustments",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.transaction_no} ({self.date})"


class StockAdjustmentItem(models.Model):
    adjustment = models.ForeignKey(
        StockAdjustment, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(
        "products.Product", on_delete=models.RESTRICT, related_name="adjustment_items"
    )
    system_quantity = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    actual_quantity = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    difference_quantity = models.DecimalField(
        max_digits=14, decimal_places=2, default=0.00
    )
    unit_cost = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.adjustment.transaction_no} - {self.product.name} ({self.difference_quantity})"


class WarehouseTransfer(models.Model):
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING_APPROVAL", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="warehouse_transfers",
        null=True,
        blank=True,
    )
    transaction_no = models.CharField(max_length=100, unique=True)
    date = models.DateField()
    from_warehouse = models.ForeignKey(
        Warehouse, on_delete=models.RESTRICT, related_name="outgoing_transfers"
    )
    to_warehouse = models.ForeignKey(
        Warehouse, on_delete=models.RESTRICT, related_name="incoming_transfers"
    )
    memo = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES, default="APPROVED"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_transfers",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.transaction_no}: {self.from_warehouse.name} -> {self.to_warehouse.name}"


class WarehouseTransferItem(models.Model):
    transfer = models.ForeignKey(
        WarehouseTransfer, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(
        "products.Product", on_delete=models.RESTRICT, related_name="transfer_items"
    )
    quantity = models.DecimalField(max_digits=14, decimal_places=2)

    def __str__(self):
        return f"{self.transfer.transaction_no} - {self.product.name}: {self.quantity}"


class WarehouseTransferAttachment(models.Model):
    transfer = models.ForeignKey(
        WarehouseTransfer, on_delete=models.CASCADE, related_name="attachments"
    )
    file = models.FileField(upload_to="transfers/", blank=True, null=True)
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
