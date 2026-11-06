from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    agent_name = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "company_name",
            "email",
            "phone",
            "address",
            "province",
            "city",
            "district",
            "village",
            "postal_code",
            "status",
            "agent",
            "agent_name",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "agent_name", "created_at", "updated_at"]

    def get_agent_name(self, obj):
        if obj.agent:
            return f"{obj.agent.first_name} {obj.agent.last_name}".strip()
        return None