from rest_framework import viewsets

from qontak_sales.apps.accounts.permissions import ModulePermission
from qontak_sales.common.views import SingletonSettingView

from .models import InvoiceReminder, InvoiceReminderInterval, SalesFormSetting
from .serializers import (
    InvoiceReminderIntervalSerializer,
    InvoiceReminderSerializer,
    SalesFormSettingSerializer,
)


class SalesFormSettingView(SingletonSettingView):
    model = SalesFormSetting
    serializer_class = SalesFormSettingSerializer
    permission_classes = [ModulePermission]
    permission_module = "sales"


class InvoiceReminderView(SingletonSettingView):
    model = InvoiceReminder
    serializer_class = InvoiceReminderSerializer
    permission_classes = [ModulePermission]
    permission_module = "sales"


class InvoiceReminderIntervalViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceReminderIntervalSerializer
    permission_classes = [ModulePermission]
    permission_module = "sales"

    def get_queryset(self):
        return InvoiceReminderInterval.objects.filter(reminder=InvoiceReminder.load())

    def perform_create(self, serializer):
        serializer.save(reminder=InvoiceReminder.load())
