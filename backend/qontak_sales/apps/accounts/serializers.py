from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .authorities import permissions_for
from .invitations import find_invitation
from .models import AccountMapping, ApprovalRule, Billing, Company, CustomField, ProductionSetting, Role, RoleAuthority, TaggingRule

User = get_user_model()


class RoleAuthoritySerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleAuthority
        fields = ["id", "feature", "sub_feature", "see", "create", "edit", "can_delete"]


class RoleSerializer(serializers.ModelSerializer):
    authorities = RoleAuthoritySerializer(many=True, required=False)

    class Meta:
        model = Role
        fields = ["id", "code", "name", "description", "is_default", "authorities"]

    def create(self, validated_data):
        authorities = validated_data.pop("authorities", [])
        role = Role.objects.create(**validated_data)
        for authority in authorities:
            RoleAuthority.objects.create(role=role, **authority)
        return role

    def update(self, instance, validated_data):
        if instance.is_default:
            raise serializers.ValidationError("Role bawaan tidak dapat diubah.")
        authorities = validated_data.pop("authorities", None)
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.save()
        if authorities is not None:
            instance.authorities.all().delete()
            for authority in authorities:
                RoleAuthority.objects.create(role=instance, **authority)
        return instance


class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "created_at",
            "updated_at",
            "company_email",
            "phone",
            "industry",
            "industry_other",
            "address",
            "province",
            "city",
            "postal_code",
            "company_size",
            "bank_name",
            "swift_code",
            "branch_office",
            "branch_address",
            "account_number",
            "account_holder",
            "logo",
            "logo_url",
            "fax",
            "shipping_address",
            "billing_address",
            "tin",
            "website",
            "email",
            "show_logo_in_report",
            "feature_approval",
            "feature_multiple_withholding",
            "feature_performance_summary",
            "feature_tax_inclusive",
            "feature_transaction_tag",
            "feature_multicurrency",
            "base_currency",
            "currency_format",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "logo_url"]

    def get_logo_url(self, obj):
        request = self.context.get("request")
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    avatar_url = serializers.SerializerMethodField()
    role_config = serializers.JSONField(read_only=True)
    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "company",
            "company_name",
            "avatar",
            "avatar_url",
            "phone",
            "role_config",
            "roles",
            "permissions",
        ]
        read_only_fields = ["id", "role", "avatar_url", "company"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_roles(self, obj):
        return [
            {"id": role.id, "code": role.code, "name": role.name}
            for role in obj.roles.all()
        ]

    def get_permissions(self, obj):
        return permissions_for(obj)



class ProfileUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, allow_blank=False)
    remove_avatar = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "phone", "avatar", "remove_avatar"]

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value

    def validate_avatar(self, value):
        if value and value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Ukuran foto maksimal 5 MB.")
        return value

    def update(self, instance, validated_data):
        remove_avatar = validated_data.pop("remove_avatar", False)
        instance = super().update(instance, validated_data)
        if remove_avatar and instance.avatar:
            instance.avatar.delete(save=False)
            instance.avatar = None
            instance.save(update_fields=["avatar"])
        return instance


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    company_name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email sudah terdaftar.")
        return value

    def create(self, validated_data):
        company = Company.objects.create(name=validated_data["company_name"].strip())
        name_parts = validated_data["name"].strip().split()
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=name_parts[0] if name_parts else "",
            last_name=" ".join(name_parts[1:]),
            company=company,
            role="MANAGER",
        )
        return user


class AgentCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    avatar = serializers.ImageField(required=False, allow_null=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username sudah dipakai.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value.lower().strip()


class InviteMemberSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    type = serializers.ChoiceField(choices=["member", "partner"], default="member")
    access_time_limit = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    roles = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Role.objects.all()),
        required=False,
    )
    role_config = serializers.JSONField(required=False, default=dict)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username sudah dipakai.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value.lower().strip()


class MemberSerializer(serializers.ModelSerializer):


    roles = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Role.objects.all(), required=False
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "status",
            "type",
            "access_time_limit",
            "role",
            "roles",
            "role_config",
        ]
        read_only_fields = ["id", "username", "role"]

    def validate_email(self, value):
        value = value.lower().strip()
        if value and User.objects.filter(email__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Email atau password salah.")
        if not user.check_password(password):
            raise serializers.ValidationError("Email atau password salah.")
        if not user.is_active:
            raise serializers.ValidationError("Akun dinonaktifkan.")
        if user.status == "invited":
            raise serializers.ValidationError(
                "Undangan belum diterima. Buka link undangan untuk membuat password."
            )
        if user.status == "inactive":
            raise serializers.ValidationError("Akun dinonaktifkan.")
        refresh = RefreshToken.for_user(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}


class AcceptInvitationSerializer(serializers.Serializer):

    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Konfirmasi password tidak sama."}
            )

        invitation = find_invitation(attrs["token"].strip())
        if invitation is None or not invitation.is_usable:
            raise serializers.ValidationError(
                {"token": "Undangan tidak valid atau sudah kedaluwarsa."}
            )
        if invitation.user.status != "invited":
            raise serializers.ValidationError({"token": "Undangan ini sudah tidak berlaku."})

        try:
            validate_password(attrs["password"], user=invitation.user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        attrs["invitation"] = invitation
        return attrs

    def save(self):
        invitation = self.validated_data["invitation"]
        user = invitation.user
        with transaction.atomic():
            user.set_password(self.validated_data["password"])
            user.status = "active"
            user.is_active = True
            user.save(update_fields=["password", "status", "is_active"])
            invitation.accepted_at = timezone.now()
            invitation.save(update_fields=["accepted_at", "updated_at"])
        return user


class ProductionSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionSetting
        fields = [
            "id",
            "production_plan_date_mode",
            "allow_backdated_plan_date",
            "allow_partial_production",
        ]


CUSTOM_FIELD_SUB_PAGES = {
    "sales": [
        "Sales Order",
        "Sales Invoice",
        "Sales Quotation",
        "Sales Delivery",
        "Sales Return",
        "Down payment receipt",
        "Proforma invoice",
        "Proforma order",
    ],
    "purchases": [
        "Purchase Order",
        "Purchase Invoice",
        "Purchase Quotation",
        "Purchase Request",
        "Purchase Return",
        "Purchase Quote",
        "Purchase Delivery",
    ],
    "expenses": ["Expense"],
    "products": [],
}


class CustomFieldSerializer(serializers.ModelSerializer):
    sub_pages = serializers.ListField(
        child=serializers.CharField(max_length=50), required=False
    )
    options = serializers.ListField(
        child=serializers.CharField(allow_blank=True, max_length=100),
        required=False,
        max_length=50,
    )
    default_value = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )
    max_chars = serializers.IntegerField(
        min_value=1, max_value=1000, required=False, allow_null=True
    )
    affix_text = serializers.CharField(max_length=30, required=False, allow_blank=True)

    class Meta:
        model = CustomField
        fields = [
            "id",
            "name",
            "page",
            "sub_pages",
            "field_type",
            "status",
            "is_required",
            "show_in_print",
            "max_chars",
            "use_decimal",
            "affix_type",
            "affix_text",
            "date_default",
            "allow_multiple",
            "options",
            "default_value",
            "sort_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "sort_order", "created_at", "updated_at"]

    def validate_status(self, value):
        if value == "deleted":
            raise serializers.ValidationError(
                "Gunakan aksi hapus untuk menghapus custom field."
            )
        return value

    def validate_options(self, value):
        cleaned = [item.strip() for item in value]
        if any(not item for item in cleaned):
            raise serializers.ValidationError("Opsi dropdown tidak boleh kosong.")
        lowered = [item.lower() for item in cleaned]
        if len(set(lowered)) != len(lowered):
            raise serializers.ValidationError("Opsi dropdown tidak boleh sama.")
        return cleaned

    def _current(self, attrs, key):
        if key in attrs:
            return attrs[key]
        if self.instance is not None:
            return getattr(self.instance, key)
        return CustomField._meta.get_field(key).get_default()

    def validate(self, attrs):
        company = self.context["request"].user.company
        if company is None:
            raise serializers.ValidationError(
                {"detail": "User belum terhubung ke company."}
            )
        if self.instance is not None and self.instance.status == "deleted":
            raise serializers.ValidationError(
                {"detail": "Custom field yang sudah dihapus tidak dapat diubah."}
            )

        page = self._current(attrs, "page")
        field_type = self._current(attrs, "field_type")
        name = self._current(attrs, "name")

        allowed_sub_pages = CUSTOM_FIELD_SUB_PAGES[page]
        if allowed_sub_pages:
            selected = self._current(attrs, "sub_pages")
            if any(item not in allowed_sub_pages for item in selected):
                raise serializers.ValidationError({"sub_pages": "Halaman tidak valid."})
            if not selected:
                raise serializers.ValidationError(
                    {"sub_pages": "Pilih minimal satu halaman."}
                )
            attrs["sub_pages"] = [item for item in allowed_sub_pages if item in selected]
        else:
            attrs["sub_pages"] = []

        duplicates = CustomField.objects.filter(
            company=company, page=page, name__iexact=name
        ).exclude(status="deleted")
        if self.instance is not None:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists():
            raise serializers.ValidationError(
                {"name": "Custom field dengan nama ini sudah ada di halaman tersebut."}
            )

        if self.instance is None:
            used = (
                CustomField.objects.filter(company=company)
                .exclude(status="deleted")
                .count()
            )
            if used >= CustomField.QUOTA:
                raise serializers.ValidationError(
                    {"detail": "Kuota custom field sudah habis."}
                )

        if field_type != "text":
            attrs["max_chars"] = None

        if field_type == "number":
            affix_type = self._current(attrs, "affix_type")
            affix_text = (self._current(attrs, "affix_text") or "").strip()
            if affix_type == "none":
                affix_text = ""
            elif not affix_text:
                raise serializers.ValidationError(
                    {"affix_text": "Teks tambahan wajib diisi."}
                )
            attrs["affix_text"] = affix_text
        else:
            attrs["use_decimal"] = False
            attrs["affix_type"] = "none"
            attrs["affix_text"] = ""

        if field_type != "date":
            attrs["date_default"] = "none"

        if field_type == "dropdown":
            options = self._current(attrs, "options")
            if not options:
                raise serializers.ValidationError(
                    {"options": "Minimal satu opsi wajib diisi."}
                )
            default_value = self._current(attrs, "default_value") or None
            if default_value is not None and default_value not in options:
                raise serializers.ValidationError(
                    {"default_value": "Opsi utama harus salah satu dari opsi yang ada."}
                )
            attrs["default_value"] = default_value
        else:
            attrs["options"] = []
            attrs["default_value"] = None
            attrs["allow_multiple"] = False

        return attrs


class CustomFieldReorderSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, max_length=100
    )

    def validate_ids(self, value):
        if len(set(value)) != len(value):
            raise serializers.ValidationError("Daftar id tidak boleh duplikat.")
        return value


class AccountMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountMapping
        fields = [
            "id",
            "account_type",
            "target_type",
            "target_id",
            "account_code",
            "account_name",
            "is_active",
            "mapping_options",
        ]

    def validate_account_code(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Kode akun wajib diisi.")
        return value

    def validate_mapping_options(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Mapping options harus berupa objek JSON.")
        return value


class BillingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = Billing
        fields = [
            "id",
            "invoice_number",
            "invoice_date",
            "due_date",
            "customer",
            "customer_name",
            "amount",
            "tax_amount",
            "total_amount",
            "status",
            "payment_method",
            "billing_period",
            "notes",
            "paid_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ApprovalRuleSerializer(serializers.ModelSerializer):
    approver_role_name = serializers.CharField(source="approver_role.name", read_only=True)
    approver_user_name = serializers.CharField(
        source="approver_user.get_full_name", read_only=True
    )

    class Meta:
        model = ApprovalRule
        fields = [
            "id",
            "name",
            "description",
            "rule_type",
            "amount_threshold",
            "approver_role",
            "approver_role_name",
            "approver_user",
            "approver_user_name",
            "is_active",
            "condition",
            "notification_template",
        ]
        read_only_fields = ["id"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Nama rule wajib diisi.")
        return value

    def validate_condition(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Condition harus berupa objek JSON.")
        return value


class TaggingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaggingRule
        fields = [
            "id",
            "name",
            "description",
            "tag_type",
            "transaction_type",
            "tag_mapping",
            "is_active",
            "default_tag",
            "tag_set",
        ]
        read_only_fields = ["id"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Nama rule wajib diisi.")
        return value

    def validate_tag_mapping(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Tag mapping harus berupa objek JSON.")
        return value


SIGNATURE_DOCUMENT_TYPES = [
    "Sales Invoice",
    "Sales Order",
    "Sales Quote",
    "Sales Return",
    "Receive Payment",
    "Sales Order Payment",
    "Purchase Invoice",
    "Purchase Order",
    "Purchase Return",
    "Payment",
]

PDF_DATE_FORMATS = [
    "28-08-2023",
    "28 Aug 2023",
    "28 August 2023",
    "08/28/2023",
    "08-28-2023",
]

PDF_HEADER_FLAGS = [
    "showLogo",
    "applyForBoth",
    "showCompanyName",
    "showCompanyAddress",
    "showCompanyEmail",
    "showCompanyPhone",
    "showCompanyWeb",
    "showCompanyFax",
    "showCompanyTax",
    "showRecipientName",
    "showRecipientCompany",
    "showRecipientFullName",
    "showRecipientAddress",
    "showRecipientTelephone",
    "showRecipientEmail",
    "showCustomFields",
]

PDF_HEADER_TEXTS = [
    "titleId",
    "titleEn",
    "labelCompanyEmail",
    "labelCompanyPhone",
    "labelRecipientName",
    "labelRecipientCompany",
    "labelRecipientFullName",
    "labelRecipientAddress",
    "labelRecipientTelephone",
    "labelRecipientEmail",
]

PDF_CONTENT_FLAGS = [
    "showCustomerRef",
    "showOtherDpp",
    "showTags",
    "showWarehouse",
    "showTableProduct",
    "showTableDescription",
    "showTableQty",
    "showTablePrice",
    "showTableDiscount",
    "showTableTax",
    "showMessage",
    "showMemo",
    "showPaymentInfo",
    "showAmountInWords",
    "showSignature",
    "showFooter",
    "showFootnote",
]

PDF_CONTENT_TEXTS = [
    "labelCustomerRef",
    "labelTableQty",
    "labelTablePrice",
    "labelTableDiscount",
    "labelTableTax",
]


def _optional_fields(flags, texts, extra):
    fields = {name: serializers.BooleanField(required=False) for name in flags}
    fields.update(
        {
            name: serializers.CharField(required=False, allow_blank=True, max_length=100)
            for name in texts
        }
    )
    fields.update(extra)
    return fields


PdfHeaderSerializer = type(
    "PdfHeaderSerializer",
    (serializers.Serializer,),
    _optional_fields(
        PDF_HEADER_FLAGS,
        PDF_HEADER_TEXTS,
        {
            "logoPosition": serializers.ChoiceField(
                choices=["Left", "Center", "Right"], required=False
            ),
            "contentSize": serializers.ChoiceField(
                choices=["Large", "Medium", "Small"], required=False
            ),
        },
    ),
)

PdfContentSerializer = type(
    "PdfContentSerializer",
    (serializers.Serializer,),
    _optional_fields(
        PDF_CONTENT_FLAGS,
        PDF_CONTENT_TEXTS,
        {
            "dateFormat": serializers.ChoiceField(choices=PDF_DATE_FORMATS, required=False),
            "amountNominal": serializers.ChoiceField(
                choices=["Total", "Balance due"], required=False
            ),
            "footnoteText": serializers.CharField(
                required=False, allow_blank=True, max_length=200
            ),
        },
    ),
)


class PdfDocumentTemplateSerializer(serializers.Serializer):
    header = PdfHeaderSerializer(required=False)
    content = PdfContentSerializer(required=False)


class EmailTemplateSerializer(serializers.Serializer):
    subject = serializers.CharField(required=False, allow_blank=True, max_length=255)
    message = serializers.CharField(required=False, allow_blank=True, max_length=5000)


class WhatsappTemplateSerializer(serializers.Serializer):
    message = serializers.CharField(required=False, allow_blank=True, max_length=2000)
    show_footer = serializers.BooleanField(required=False)
    footer = serializers.CharField(required=False, allow_blank=True, max_length=500)


class SignatureRowSerializer(serializers.Serializer):
    option = serializers.ChoiceField(
        choices=["", "[User Name]", "[Company Name]"], required=False, allow_blank=True
    )
    text = serializers.CharField(required=False, allow_blank=True, max_length=150)


class PdfGeneralTemplateSerializer(serializers.Serializer):
    use_footer = serializers.BooleanField(required=False)
    use_signature = serializers.BooleanField(required=False)
    use_draft_watermark = serializers.BooleanField(required=False)
    use_qr_code = serializers.BooleanField(required=False)
    signature_types = serializers.ListField(
        child=serializers.ChoiceField(choices=SIGNATURE_DOCUMENT_TYPES),
        required=False,
        max_length=len(SIGNATURE_DOCUMENT_TYPES),
    )
    signature_rows = serializers.ListField(
        child=SignatureRowSerializer(), required=False, max_length=20
    )


class PdfCustomizeStateSerializer(serializers.Serializer):
    document_type = serializers.ChoiceField(
        choices=["Sales Invoice", "Sales Order", "Purchase Invoice"],
        required=False,
        allow_blank=True,
    )
    template = serializers.ChoiceField(
        choices=["Template 1", "Template 6", "Template 7", "Template 10", "Template 12"],
        required=False,
    )

    def validate(self, attrs):
        document_type = attrs.get("document_type")
        template = attrs.get("template")
        if (
            document_type
            and template == "Template 12"
            and document_type != "Sales Invoice"
        ):
            raise serializers.ValidationError(
                {"template": "Template 12 hanya tersedia untuk Sales Invoice."}
            )
        return attrs


class SignatureImageSerializer(serializers.Serializer):
    image = serializers.ImageField(required=False, allow_null=True)
    remove = serializers.BooleanField(required=False, default=False)

    def validate_image(self, value):
        if value and value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Ukuran gambar tanda tangan maksimal 2 MB.")
        return value


TEMPLATE_SERIALIZERS = {
    "email_sales_invoice": EmailTemplateSerializer,
    "email_sales_quote": EmailTemplateSerializer,
    "email_sales_order": EmailTemplateSerializer,
    "email_purchase_order": EmailTemplateSerializer,
    "whatsapp_sales": WhatsappTemplateSerializer,
    "whatsapp_order": WhatsappTemplateSerializer,
    "pdf_general": PdfGeneralTemplateSerializer,
    "pdf_customize": PdfCustomizeStateSerializer,
    "pdf_sales_invoice": PdfDocumentTemplateSerializer,
    "pdf_sales_order": PdfDocumentTemplateSerializer,
    "pdf_purchase_invoice": PdfDocumentTemplateSerializer,
}
