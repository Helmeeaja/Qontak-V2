from rest_framework import serializers
from .models import Contact, ContactGroup, ContactBankAccount


class ContactGroupSerializer(serializers.ModelSerializer):
    contact_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ContactGroup
        fields = ["id", "name", "contact_count", "created_at", "updated_at"]

    def get_contact_count(self, obj):
        return obj.contacts.count()


class ContactBankAccountSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = ContactBankAccount
        fields = ["id", "bank_name", "branch", "holder_name", "account_number"]


class ContactSerializer(serializers.ModelSerializer):
    bank_accounts = ContactBankAccountSerializer(many=True, required=False)
    group_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ContactGroup.objects.all(),
        source="groups",
        required=False,
    )
    group_names = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Contact
        fields = [
            "id",
            "company",
            "display_name",
            "contact_types",
            "group_ids",
            "group_names",
            "title",
            "first_name",
            "middle_name",
            "last_name",
            "full_name",
            "identity_type",
            "identity_number",
            "emails",
            "company_name",
            "phone",
            "telephone",
            "fax",
            "billing_address",
            "billing_number",
            "billing_rt_rw",
            "billing_hamlet",
            "billing_village",
            "billing_sub_district",
            "billing_district",
            "billing_province",
            "billing_postal_code",
            "same_as_billing",
            "shipping_address",
            "other_info",
            "citizenship",
            "npwp",
            "nitku",
            "tin",
            "receivable_account_id",
            "payable_account_id",
            "has_max_receivable",
            "max_receivable_amount",
            "payment_term",
            "balance",
            "is_archived",
            "bank_accounts",
            "created_at",
            "updated_at",
        ]

    def get_group_names(self, obj):
        return [g.name for g in obj.groups.all()]

    def get_full_name(self, obj):
        parts = [obj.title, obj.first_name, obj.middle_name, obj.last_name]
        return " ".join([p for p in parts if p]).strip()

    def create(self, validated_data):
        bank_accounts_data = validated_data.pop("bank_accounts", [])
        groups = validated_data.pop("groups", [])
        contact = Contact.objects.create(**validated_data)
        if groups:
            contact.groups.set(groups)
        for bank_data in bank_accounts_data:
            bank_data.pop("id", None)
            ContactBankAccount.objects.create(contact=contact, **bank_data)
        return contact

    def update(self, instance, validated_data):
        bank_accounts_data = validated_data.pop("bank_accounts", None)
        groups = validated_data.pop("groups", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if groups is not None:
            instance.groups.set(groups)

        if bank_accounts_data is not None:
            # Replace bank accounts
            instance.bank_accounts.all().delete()
            for bank_data in bank_accounts_data:
                bank_data.pop("id", None)
                ContactBankAccount.objects.create(contact=instance, **bank_data)

        return instance
