from django.contrib import admin
from .models import Contact, ContactGroup, ContactBankAccount


class BankAccountInline(admin.TabularInline):
    model = ContactBankAccount
    extra = 1


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ["display_name", "company_name", "phone", "balance", "is_archived"]
    search_fields = ["display_name", "company_name", "phone"]
    list_filter = ["is_archived", "citizenship"]
    inlines = [BankAccountInline]


@admin.register(ContactGroup)
class ContactGroupAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]
