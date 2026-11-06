from django.db import models


class PriceRule(models.Model):
    RULE_TYPE_CHOICES = [
        ("percentage_discount", "Diskon persentase"),
        ("fixed_discount", "Diskon jumlah tetap"),
        ("tiered_discount", "Diskon persentase bertingkat"),
        ("subtotal_discount", "Diskon subtotal penjualan"),
        ("final_price_discount", "Diskon harga akhir"),
        ("percentage_markup", "Markup persentase"),
        ("fixed_markup", "Markup jumlah tetap"),
    ]

    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="price_rules",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=250)
    start_date = models.DateField()
    end_date = models.DateField()
    rule_type = models.CharField(
        max_length=50, choices=RULE_TYPE_CHOICES, default="percentage_discount"
    )
    value = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)

    is_active = models.BooleanField(default=True)
    apply_to_all_contacts = models.BooleanField(default=False)
    apply_to_all_products = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date", "-created_at"]

    def __str__(self):
        return f"{self.name} ({self.rule_type}: {self.value})"


class PriceRuleContact(models.Model):
    price_rule = models.ForeignKey(
        PriceRule, on_delete=models.CASCADE, related_name="target_contacts"
    )
    contact = models.ForeignKey(
        "contacts.Contact",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="price_rules",
    )
    group = models.ForeignKey(
        "contacts.ContactGroup",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="price_rules",
    )
    created_at = models.DateTimeField(auto_now_add=True)


class PriceRuleProduct(models.Model):
    price_rule = models.ForeignKey(
        PriceRule, on_delete=models.CASCADE, related_name="target_products"
    )
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="price_rules",
    )
    category = models.ForeignKey(
        "products.ProductCategory",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="price_rules",
    )
    created_at = models.DateTimeField(auto_now_add=True)
