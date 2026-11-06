from django.contrib import admin

from .models import InvoiceReminder, InvoiceReminderInterval, SalesFormSetting

admin.site.register(SalesFormSetting)
admin.site.register(InvoiceReminder)
admin.site.register(InvoiceReminderInterval)
