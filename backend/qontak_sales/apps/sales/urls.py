from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    InvoiceReminderIntervalViewSet,
    InvoiceReminderView,
    SalesFormSettingView,
)

router = DefaultRouter()
router.register(
    r"sales/invoice-reminder/intervals",
    InvoiceReminderIntervalViewSet,
    basename="invoice-reminder-interval",
)

urlpatterns = [
    path("sales/form-settings/", SalesFormSettingView.as_view(), name="sales-form-setting"),
    path("sales/invoice-reminder/", InvoiceReminderView.as_view(), name="invoice-reminder"),
    path("", include(router.urls)),
]
