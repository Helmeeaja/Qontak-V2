from django.db import models
from django.conf import settings


class ContactGroup(models.Model):
    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="contact_groups",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Contact(models.Model):
    CITIZENSHIP_CHOICES = [
        ("indonesian", "Warga Negara Indonesia"),
        ("foreign", "Warga Negara Asing"),
    ]

    company = models.ForeignKey(
        "accounts.Company",
        on_delete=models.CASCADE,
        related_name="contacts",
        null=True,
        blank=True,
    )
    display_name = models.CharField(max_length=200)
    contact_types = models.JSONField(default=list, help_text="e.g. ['customer', 'vendor']")
    groups = models.ManyToManyField(ContactGroup, blank=True, related_name="contacts")

    title = models.CharField(max_length=20, blank=True, default="")
    first_name = models.CharField(max_length=100, blank=True, default="")
    middle_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")

    identity_type = models.CharField(max_length=30, blank=True, default="")
    identity_number = models.CharField(max_length=50, blank=True, default="")

    emails = models.JSONField(default=list, blank=True)
    company_name = models.CharField(max_length=200, blank=True, default="")
    phone = models.CharField(max_length=30, blank=True, default="")
    telephone = models.CharField(max_length=30, blank=True, default="")
    fax = models.CharField(max_length=30, blank=True, default="")

    billing_address = models.TextField(blank=True, default="")
    billing_number = models.CharField(max_length=50, blank=True, default="")
    billing_rt_rw = models.CharField(max_length=50, blank=True, default="")
    billing_hamlet = models.CharField(max_length=100, blank=True, default="")
    billing_village = models.CharField(max_length=100, blank=True, default="")
    billing_sub_district = models.CharField(max_length=100, blank=True, default="")
    billing_district = models.CharField(max_length=100, blank=True, default="")
    billing_province = models.CharField(max_length=100, blank=True, default="")
    billing_postal_code = models.CharField(max_length=20, blank=True, default="")

    same_as_billing = models.BooleanField(default=True)
    shipping_address = models.TextField(blank=True, default="")
    other_info = models.TextField(blank=True, default="")

    citizenship = models.CharField(
        max_length=20, choices=CITIZENSHIP_CHOICES, default="indonesian"
    )
    npwp = models.CharField(max_length=20, blank=True, default="")
    nitku = models.CharField(max_length=10, blank=True, default="")
    tin = models.CharField(max_length=50, blank=True, default="")

    receivable_account_id = models.CharField(max_length=50, default="1-10100", blank=True)
    payable_account_id = models.CharField(max_length=50, default="2-20100", blank=True)

    has_max_receivable = models.BooleanField(default=False)
    max_receivable_amount = models.DecimalField(
        max_digits=18, decimal_places=2, default=0.00
    )
    payment_term = models.CharField(max_length=30, default="net30", blank=True)

    balance = models.DecimalField(max_digits=18, decimal_places=2, default=0.00)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.display_name


class ContactBankAccount(models.Model):
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name="bank_accounts"
    )
    bank_name = models.CharField(max_length=150)
    branch = models.CharField(max_length=100, blank=True, default="")
    holder_name = models.CharField(max_length=150)
    account_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bank_name} - {self.account_number} ({self.holder_name})"
