from rest_framework import serializers

from .models import PurchaseSetting


class PurchaseSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseSetting
        exclude = ["id"]
