from django.urls import path

from .views import PurchaseSettingView

urlpatterns = [
    path("purchases/form-settings/", PurchaseSettingView.as_view(), name="purchase-setting"),
]
