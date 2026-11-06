from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ProductBatchReminderListView,
    ProductCategoryViewSet,
    ProductSettingView,
    ProductUnitViewSet,
    ProductViewSet,
)

router = DefaultRouter()
router.register(r"products/categories", ProductCategoryViewSet, basename="product-category-setting")
router.register(r"products/units", ProductUnitViewSet, basename="product-unit-setting")
router.register(r"product-categories", ProductCategoryViewSet, basename="product-category")
router.register(r"product-units", ProductUnitViewSet, basename="product-unit")
router.register(r"products", ProductViewSet, basename="product")

urlpatterns = [
    path("products/settings/", ProductSettingView.as_view(), name="product-setting"),
    path(
        "products/batch-reminders/",
        ProductBatchReminderListView.as_view(),
        name="product-batch-reminders",
    ),
    path("", include(router.urls)),
]
