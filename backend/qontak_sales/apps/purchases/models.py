from django.db import models

from qontak_sales.common.models import PAYMENT_TERM_CHOICES, SingletonModel


class PurchaseSetting(SingletonModel):
    preferred_purchase_term = models.CharField(
        max_length=20, choices=PAYMENT_TERM_CHOICES, default="net_30"
    )
    enable_supplier_in_purchase_request = models.BooleanField(default=False)
    use_purchase_shipping = models.BooleanField(default=False)
    use_purchase_discount = models.BooleanField(default=False)
    use_purchase_discount_per_line = models.BooleanField(default=False)
    use_purchase_deposit = models.BooleanField(default=False)
    default_purchase_order_message = models.TextField(blank=True, default="")

    def __str__(self):
        return "Purchase setting"
