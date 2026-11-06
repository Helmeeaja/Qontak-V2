from django.urls import path

from .views import (
    CityListView,
    DistrictListView,
    PostalCodeListView,
    ProvinceListView,
    VillageListView,
)

urlpatterns = [
    path("provinces/", ProvinceListView.as_view(), name="province-list"),
    path("cities/", CityListView.as_view(), name="city-list"),
    path("districts/", DistrictListView.as_view(), name="district-list"),
    path("villages/", VillageListView.as_view(), name="village-list"),
    path("postal-codes/", PostalCodeListView.as_view(), name="postalcode-list"),
]
