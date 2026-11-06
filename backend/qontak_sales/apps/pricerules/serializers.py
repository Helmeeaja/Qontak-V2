from rest_framework import serializers
from .models import PriceRule, PriceRuleContact, PriceRuleProduct


class PriceRuleContactSerializer(serializers.ModelSerializer):
    contact_name = serializers.ReadOnlyField(source="contact.display_name")
    group_name = serializers.ReadOnlyField(source="group.name")

    class Meta:
        model = PriceRuleContact
        fields = ["id", "contact", "contact_name", "group", "group_name"]


class PriceRuleProductSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = PriceRuleProduct
        fields = ["id", "product", "product_name", "category", "category_name"]


class PriceRuleSerializer(serializers.ModelSerializer):
    target_contacts = PriceRuleContactSerializer(many=True, required=False)
    target_products = PriceRuleProductSerializer(many=True, required=False)

    class Meta:
        model = PriceRule
        fields = [
            "id",
            "company",
            "name",
            "start_date",
            "end_date",
            "rule_type",
            "value",
            "is_active",
            "apply_to_all_contacts",
            "apply_to_all_products",
            "target_contacts",
            "target_products",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        contacts_data = validated_data.pop("target_contacts", [])
        products_data = validated_data.pop("target_products", [])
        rule = PriceRule.objects.create(**validated_data)
        for c in contacts_data:
            PriceRuleContact.objects.create(price_rule=rule, **c)
        for p in products_data:
            PriceRuleProduct.objects.create(price_rule=rule, **p)
        return rule

    def update(self, instance, validated_data):
        contacts_data = validated_data.pop("target_contacts", None)
        products_data = validated_data.pop("target_products", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if contacts_data is not None:
            instance.target_contacts.all().delete()
            for c in contacts_data:
                PriceRuleContact.objects.create(price_rule=instance, **c)

        if products_data is not None:
            instance.target_products.all().delete()
            for p in products_data:
                PriceRuleProduct.objects.create(price_rule=instance, **p)

        return instance
