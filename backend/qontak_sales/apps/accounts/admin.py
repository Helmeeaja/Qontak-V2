from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    AccountMapping,
    ApprovalRule,
    Billing,
    Company,
    CustomField,
    CustomUser,
    Invitation,
    TaggingRule,
    TemplateSetting,
)

admin.site.register(Company)
admin.site.register(CustomUser, UserAdmin)


@admin.register(AccountMapping)
class AccountMappingAdmin(admin.ModelAdmin):
    list_display = ("company", "account_type", "target_id", "account_name", "is_active")
    list_filter = ("account_type", "is_active")
    search_fields = ("company__name", "target_id", "account_name")


@admin.register(ApprovalRule)
class ApprovalRuleAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "rule_type", "is_active")
    list_filter = ("rule_type", "is_active")
    search_fields = ("name", "company__name")


@admin.register(Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "customer", "invoice_date", "total_amount", "status")
    list_filter = ("status",)
    search_fields = ("invoice_number", "customer__name")


@admin.register(TaggingRule)
class TaggingRuleAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "tag_type", "transaction_type", "is_active")
    list_filter = ("tag_type", "is_active")
    search_fields = ("name", "company__name")


@admin.register(TemplateSetting)
class TemplateSettingAdmin(admin.ModelAdmin):
    list_display = ("company", "key", "updated_at")
    list_filter = ("key",)
    search_fields = ("company__name", "key")


@admin.register(CustomField)
class CustomFieldAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "page", "field_type", "status", "sort_order")
    list_filter = ("page", "field_type", "status")
    search_fields = ("name", "company__name")


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ("user", "expires_at", "accepted_at", "created_by", "created_at")
    list_filter = ("accepted_at",)
    search_fields = ("user__email", "user__username")
    readonly_fields = ("token_hash", "created_at", "updated_at")
