from django.db.models import Q
from rest_framework import serializers

from qontak_sales.apps.customers.models import Customer

from .models import InvoiceReminder, InvoiceReminderInterval, SalesFormSetting

MAX_REMINDER_INTERVALS = 5


class SalesFormSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesFormSetting
        exclude = ["id"]


class InvoiceReminderIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceReminderInterval
        fields = ["id", "days", "timing", "email_subject", "email_body", "include_pdf"]

    def validate_days(self, value):
        if value < 1:
            raise serializers.ValidationError("Minimal 1 hari.")
        return value

    def validate(self, attrs):
        current = self.instance
        reminder = InvoiceReminder.load()
        if (
            current is None
            and InvoiceReminderInterval.objects.filter(reminder=reminder).count()
            >= MAX_REMINDER_INTERVALS
        ):
            raise serializers.ValidationError(
                f"Maksimal {MAX_REMINDER_INTERVALS} interval pengingat."
            )
        days = attrs.get("days", current.days if current else None)
        timing = attrs.get("timing", current.timing if current else None)
        duplicates = InvoiceReminderInterval.objects.filter(
            reminder=reminder, days=days, timing=timing
        )
        if current:
            duplicates = duplicates.exclude(pk=current.pk)
        if duplicates.exists():
            raise serializers.ValidationError({"days": "Hari sudah digunakan."})
        return attrs


class InvoiceReminderSerializer(serializers.ModelSerializer):
    intervals = InvoiceReminderIntervalSerializer(many=True, read_only=True)
    exempt_customers = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Customer.objects.none(), required=False
    )

    class Meta:
        model = InvoiceReminder
        exclude = ["id"]

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        if request is not None:
            fields["exempt_customers"].child_relation.queryset = Customer.objects.filter(
                Q(agent__company=request.user.company) | Q(agent__isnull=True)
            )
        return fields

    def validate(self, attrs):
        current = self.instance
        by_amount = attrs.get("exempt_by_amount", current.exempt_by_amount if current else False)
        amount = attrs.get("exempt_amount_under", current.exempt_amount_under if current else None)
        if by_amount and amount is None:
            raise serializers.ValidationError(
                {"exempt_amount_under": "Isi nominal batas untuk menonaktifkan pengingat."}
            )
        return attrs
