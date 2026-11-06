from rest_framework import serializers

from .models import City, District, Province, Village


class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = ["id", "code", "name", "postal_code", "district"]


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "code", "name", "city"]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "code", "name", "province"]


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ["id", "code", "name"]
