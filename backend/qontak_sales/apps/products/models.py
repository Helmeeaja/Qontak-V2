from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from qontak_sales.common.models import SingletonModel


class ProductCategory(models.Model):
    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="product_categories",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Product categories"

    def __str__(self):
        return self.name


class ProductUnit(models.Model):
    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="product_units",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=20, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.symbol})" if self.symbol else self.name


class Product(models.Model):
    PRODUCT_TYPES = [
        ("Single", "Single"),
        ("Bundle", "Bundle"),
    ]

    INVENTORY_TRACKING_CHOICES = [
        ("tracked", "Lacak"),
        ("no_tracking", "Tidak dilacak"),
    ]

    TRACK_MODE_CHOICES = [
        ("no_tracking", "Lacak kuantitas saja"),
        ("batch", "Lacak berdasarkan batch"),
        ("serial_number", "Lacak berdasarkan nomor seri"),
    ]

    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, blank=True, null=True, unique=True)
    barcode = models.CharField(max_length=100, blank=True, default="")

    unit = models.ForeignKey(
        ProductUnit,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )

    description = models.TextField(blank=True, default="")
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default="Single")
    image = models.URLField(max_length=500, blank=True, null=True)    

    # Pelacakan Persediaan
    inventory_tracking = models.CharField(
        max_length=20, choices=INVENTORY_TRACKING_CHOICES, default="tracked"
    )
    track_mode = models.CharField(
        max_length=30, choices=TRACK_MODE_CHOICES, default="no_tracking"
    )
    minimum_stock = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    inventory_account_id = models.CharField(max_length=50, default="1-10200", blank=True)

    # Pembelian
    is_purchased = models.BooleanField(default=True)
    buy_price = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    buy_account_id = models.CharField(max_length=50, default="5-50000", blank=True)
    buy_tax = models.CharField(max_length=50, blank=True, default="")
    last_buy_price = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)

    # Penjualan
    is_sold = models.BooleanField(default=True)
    sell_price = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    sell_account_id = models.CharField(max_length=50, default="4-40000", blank=True)
    sell_tax = models.CharField(max_length=50, blank=True, default="")

    # Stok agregat
    total_stock = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    available_qty = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)

    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.code})" if self.code else self.name


class ProductSetting(SingletonModel):
    COSTING_METHOD_CHOICES = [("average", "Average cost")]

    inventory_costing_method = models.CharField(
        max_length=20, choices=COSTING_METHOD_CHOICES, default="average"
    )
    show_stock_info = models.BooleanField(default=False)
    enable_barcode = models.BooleanField(default=False)
    use_product_variant = models.BooleanField(default=False)
    enable_serial_number_tracking = models.BooleanField(default=True)
    enable_batch_tracking = models.BooleanField(default=True)
    enable_storage_location = models.BooleanField(default=False)

    def __str__(self):
        return "Product setting"


class ProductBatchReminder(models.Model):
    UNIT_CHOICES = [("day", "Hari"), ("week", "Minggu"), ("month", "Bulan")]
    TIMING_CHOICES = [
        ("before_expiration", "Sebelum kedaluwarsa"),
        ("after_expiration", "Sesudah kedaluwarsa"),
    ]

    title = models.CharField(max_length=40)
    interval_value = models.PositiveIntegerField(
        validators=[MinValueValidator(1)], default=1
    )
    interval_unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default="day")
    timing = models.CharField(
        max_length=20, choices=TIMING_CHOICES, default="before_expiration"
    )
    email_subject = models.CharField(max_length=255, blank=True, default="")
    email_body = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class ProductBundleItem(models.Model):
    bundle_product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="bundle_components"
    )
    component_product = models.ForeignKey(
        Product, on_delete=models.RESTRICT, related_name="used_in_bundles"
    )
    quantity = models.DecimalField(max_digits=14, decimal_places=2, default=1.00)
    unit_cost_allocation = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    extra_cost_account_id = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bundle_product.name} -> {self.component_product.name} x {self.quantity}"
