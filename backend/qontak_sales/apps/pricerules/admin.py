from django.contrib import admin
from .models import PriceRule, PriceRuleContact, PriceRuleProduct


class PriceRuleContactInline(admin.TabularInline):
    model = PriceRuleContact
    extra = 1


class PriceRuleProductInline(admin.TabularInline):
    model = PriceRuleProduct
    extra = 1


@admin.register(PriceRule)
class PriceRuleAdmin(admin.ModelAdmin):
    list_display = ["name", "start_date", "end_date", "rule_type", "value", "is_active"]
    list_filter = ["rule_type", "is_active"]
    search_fields = ["name"]
    inlines = [PriceRuleContactInline, PriceRuleProductInline]
