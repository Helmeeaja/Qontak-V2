from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class Company(models.Model):
    name = models.CharField(max_length=255)

    company_email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    industry = models.CharField(max_length=100, blank=True, default="")
    industry_other = models.CharField(max_length=100, blank=True, default="")
    address = models.TextField(blank=True, default="")
    province = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    postal_code = models.CharField(max_length=10, blank=True, default="")
    company_size = models.CharField(max_length=20, blank=True, default="")

    bank_name = models.CharField(max_length=100, blank=True, default="")
    swift_code = models.CharField(max_length=11, blank=True, default="")
    branch_office = models.CharField(max_length=150, blank=True, default="")
    branch_address = models.CharField(max_length=200, blank=True, default="")
    account_number = models.CharField(max_length=30, blank=True, default="")
    account_holder = models.CharField(max_length=150, blank=True, default="")

    logo = models.ImageField(upload_to="company_logos/", blank=True, null=True)
    fax = models.CharField(max_length=20, blank=True, default="")
    shipping_address = models.CharField(max_length=200, blank=True, default="")
    billing_address = models.CharField(max_length=200, blank=True, default="")
    tin = models.CharField(max_length=30, blank=True, default="")
    website = models.URLField(blank=True, default="")
    email = models.EmailField(blank=True, default="")
    show_logo_in_report = models.BooleanField(default=False)

    feature_approval = models.BooleanField(default=True)
    feature_multiple_withholding = models.BooleanField(default=False)
    feature_performance_summary = models.BooleanField(default=True)
    feature_tax_inclusive = models.BooleanField(default=False)
    feature_transaction_tag = models.BooleanField(default=True)
    feature_multicurrency = models.BooleanField(default=False)

    base_currency = models.CharField(max_length=50, default="IDR")
    currency_format = models.CharField(max_length=50, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class RoleAuthority(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="authorities")
    feature = models.CharField(max_length=100)
    sub_feature = models.CharField(max_length=100)
    see = models.BooleanField(default=False)
    create = models.BooleanField(default=False)
    edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = [("role", "feature", "sub_feature")]

    def __str__(self):
        return f"{self.role.name} - {self.feature} - {self.sub_feature}"


class ProductionSetting(models.Model):
    PLAN_DATE_MODES = [
        ("required", "required"),
        ("optional", "optional"),
        ("hidden", "hidden"),
    ]

    production_plan_date_mode = models.CharField(
        max_length=10, choices=PLAN_DATE_MODES, default="required"
    )
    allow_backdated_plan_date = models.BooleanField(default=False)
    allow_partial_production = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk and ProductionSetting.objects.exists():
            raise ValueError("ProductionSetting sudah ada (single-row table)")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Production setting"


class CustomField(models.Model):
    QUOTA = 3

    PAGE_CHOICES = [
        ("sales", "Sales"),
        ("purchases", "Purchases"),
        ("products", "Products"),
        ("expenses", "Expenses"),
    ]
    FIELD_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
        ("date", "Date"),
        ("dropdown", "Dropdown"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("deleted", "Deleted"),
    ]
    AFFIX_CHOICES = [
        ("none", "None"),
        ("prefix", "Prefix"),
        ("suffix", "Suffix"),
    ]
    DATE_DEFAULT_CHOICES = [
        ("none", "Empty"),
        ("today", "Today"),
    ]

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="custom_fields"
    )
    name = models.CharField(max_length=25)
    page = models.CharField(max_length=20, choices=PAGE_CHOICES)
    sub_pages = models.JSONField(blank=True, default=list)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    is_required = models.BooleanField(default=False)
    show_in_print = models.BooleanField(default=False)
    max_chars = models.PositiveIntegerField(blank=True, null=True)
    use_decimal = models.BooleanField(default=False)
    affix_type = models.CharField(max_length=10, choices=AFFIX_CHOICES, default="none")
    affix_text = models.CharField(max_length=30, blank=True, default="")
    date_default = models.CharField(
        max_length=10, choices=DATE_DEFAULT_CHOICES, default="none"
    )
    allow_multiple = models.BooleanField(default=False)
    options = models.JSONField(blank=True, default=list)
    default_value = models.CharField(max_length=100, blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        indexes = [
            models.Index(fields=["company", "page", "status"]),
        ]

    def __str__(self):
        return self.name


class AccountMapping(models.Model):
    ACCOUNT_TYPES = [
        ("sales", "Sales"),
        ("purchase", "Purchase"),
        ("ar_ap", "AR/AP"),
        ("inventory", "Inventory"),
        ("others", "Others"),
        ("bank", "Bank"),
        ("cash", "Cash"),
        ("credit_card", "Credit Card"),
        ("account_receivable", "Account Receivable"),
        ("account_payable", "Account Payable"),
    ]

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="account_mappings"
    )
    account_type = models.CharField(max_length=50, choices=ACCOUNT_TYPES)
    target_type = models.CharField(max_length=100, default="company")
    target_id = models.CharField(max_length=100)
    account_code = models.CharField(max_length=50)
    account_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    mapping_options = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ["account_type", "target_id"]
        unique_together = [
            ("company", "account_type", "target_type", "target_id"),
        ]

    def __str__(self):
        return f"{self.account_code} - {self.account_name}"


class Billing(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("sent", "Sent"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
        ("canceled", "Canceled"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash"),
        ("bank_transfer", "Bank Transfer"),
        ("credit_card", "Credit Card"),
        ("check", "Check"),
        ("online", "Online Payment"),
    ]

    invoice_number = models.CharField(max_length=100, unique=True)
    invoice_date = models.DateField()
    due_date = models.DateField()
    customer = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="billings")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, blank=True, default="")
    billing_period = models.CharField(max_length=100)
    notes = models.TextField(blank=True, default="")
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-invoice_date"]

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.name}"


class ApprovalRule(models.Model):
    RULE_TYPES = [
        ("amount_based", "Amount Based"),
        ("role_based", "Role Based"),
        ("user_based", "User Based"),
        ("workflow", "Workflow"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    rule_type = models.CharField(max_length=50, choices=RULE_TYPES)
    amount_threshold = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    approver_role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name="approval_rules", blank=True, null=True)
    approver_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="approval_rules", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    condition = models.JSONField(blank=True, null=True)
    notification_template = models.TextField(blank=True, default="")
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="approval_rules")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class TaggingRule(models.Model):
    TAG_TYPES = [
        ("transaction", "Transaction"),
        ("customer", "Customer"),
        ("product", "Product"),
        ("employee", "Employee"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    tag_type = models.CharField(max_length=50, choices=TAG_TYPES)
    transaction_type = models.CharField(max_length=100)
    tag_mapping = models.JSONField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    default_tag = models.CharField(max_length=100, blank=True, default="")
    tag_set = models.JSONField(blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="tagging_rules")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class TemplateSetting(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="template_settings"
    )
    key = models.CharField(max_length=50)
    data = models.JSONField(blank=True, default=dict)
    signature_image = models.ImageField(
        upload_to="template_signatures/", blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("company", "key")]
        ordering = ["key"]

    def __str__(self):
        return f"{self.company.name} - {self.key}"


class CustomUser(AbstractUser):
    roles = models.ManyToManyField(Role, blank=True, related_name="users")
    ROLE_CHOICES = [
        ("MANAGER", "Sales Manager"),
        ("AGENT", "Sales Agent"),
    ]
    STATUS_CHOICES = [
        ("invited", "invited"),
        ("active", "active"),
        ("inactive", "inactive"),
    ]
    TYPE_CHOICES = [
        ("member", "member"),
        ("partner", "partner"),
    ]

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="users", null=True, blank=True
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="AGENT")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="member")
    access_time_limit = models.CharField(max_length=255, blank=True, default="")
    role_config = models.JSONField(blank=True, default=dict)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None


class Invitation(models.Model):


    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="invitation"
    )
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_invitations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Undangan {self.user.email}"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    @property
    def is_usable(self):
        return self.accepted_at is None and not self.is_expired
