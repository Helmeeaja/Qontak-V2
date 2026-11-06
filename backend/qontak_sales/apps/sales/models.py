from django.db import models

from qontak_sales.common.models import PAYMENT_TERM_CHOICES, SingletonModel


class SalesFormSetting(SingletonModel):
    preferred_sales_term = models.CharField(
        max_length=20, choices=PAYMENT_TERM_CHOICES, default="net_30"
    )
    use_sales_shipping = models.BooleanField(default=False)
    use_sales_discount = models.BooleanField(default=False)
    use_sales_discount_per_line = models.BooleanField(default=False)
    use_discount_account_per_product = models.BooleanField(default=False)
    use_sales_deposit = models.BooleanField(default=False)
    show_profit_margin_on_invoice = models.BooleanField(default=False)
    block_sale_if_stock_insufficient = models.BooleanField(default=False)
    lock_price_by_price_rule = models.BooleanField(default=False)
    default_invoice_message = models.TextField(blank=True, default="")
    default_delivery_slip_message = models.TextField(blank=True, default="")

    def __str__(self):
        return "Sales form setting"


class InvoiceReminder(SingletonModel):
    TYPE_CHOICES = [
        ("sales_invoice", "Invoice penjualan"),
        ("sales_order", "Pesanan penjualan"),
        ("both", "Keduanya"),
    ]

    is_enabled = models.BooleanField(default=False)
    invoice_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="sales_invoice")
    exempt_by_amount = models.BooleanField(default=False)
    exempt_amount_under = models.DecimalField(
        max_digits=18, decimal_places=2, null=True, blank=True
    )
    exempt_by_customer = models.BooleanField(default=False)
    exempt_by_invoice = models.BooleanField(default=False)
    exempt_by_order = models.BooleanField(default=False)
    exempt_customers = models.ManyToManyField(
        "customers.Customer", blank=True, related_name="exempt_from_reminders"
    )

    def __str__(self):
        return "Invoice reminder"


class InvoiceReminderInterval(models.Model):
    TIMING_CHOICES = [
        ("before_due", "Sebelum jatuh tempo"),
        ("after_due", "Sesudah jatuh tempo"),
    ]

    reminder = models.ForeignKey(
        InvoiceReminder, on_delete=models.CASCADE, related_name="intervals"
    )
    days = models.PositiveIntegerField()
    timing = models.CharField(max_length=10, choices=TIMING_CHOICES, default="before_due")
    email_subject = models.CharField(max_length=255)
    email_body = models.TextField()
    include_pdf = models.BooleanField(default=True)

    class Meta:
        ordering = ["timing", "days"]

    def __str__(self):
        return f"{self.days} hari {self.timing}"
