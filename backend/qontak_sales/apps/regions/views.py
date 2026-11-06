from rest_framework import generics, permissions

from .models import City, District, Province, Village
from .serializers import (
    CitySerializer,
    DistrictSerializer,
    ProvinceSerializer,
    VillageSerializer,
)


class ProvinceListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProvinceSerializer
    queryset = Province.objects.all()


class CityListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CitySerializer

    def get_queryset(self):
        qs = City.objects.all()
        province_code = self.request.query_params.get("province_code")
        if province_code:
            qs = qs.filter(province__code=province_code)
        return qs


class DistrictListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DistrictSerializer

    def get_queryset(self):
        qs = District.objects.all()
        city_code = self.request.query_params.get("city_code")
        if city_code:
            qs = qs.filter(city__code=city_code)
        return qs


class VillageListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VillageSerializer

    def get_queryset(self):
        qs = Village.objects.all()
        district_code = self.request.query_params.get("district_code")
        if district_code:
            qs = qs.filter(district__code=district_code)
        return qs


class PostalCodeListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        from rest_framework.response import Response
        city_code = request.query_params.get("city_code")
        if not city_code:
            return Response([])
        qs = Village.objects.filter(district__city__code=city_code).exclude(
            postal_code=""
        )
        codes = list(
            qs.values_list("postal_code", flat=True).order_by("postal_code").distinct()
        )
        return Response([{"id": idx, "code": c} for idx, c in enumerate(codes)])
