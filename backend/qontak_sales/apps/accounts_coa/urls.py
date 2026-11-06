from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountCOAViewSet

router = DefaultRouter()
router.register(r"coa", AccountCOAViewSet, basename="coa")

urlpatterns = [
    path("", include(router.urls)),
]
