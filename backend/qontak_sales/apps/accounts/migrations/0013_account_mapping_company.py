import django.db.models.deletion
from django.db import migrations, models


def assign_company(apps, schema_editor):
    AccountMapping = apps.get_model("accounts", "AccountMapping")
    Company = apps.get_model("accounts", "Company")
    company = Company.objects.order_by("id").first()
    if company is None:
        AccountMapping.objects.all().delete()
        return
    AccountMapping.objects.filter(company__isnull=True).update(company=company)


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0012_alter_accountmapping_account_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="accountmapping",
            name="company",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="account_mappings",
                to="accounts.company",
            ),
        ),
        migrations.AlterField(
            model_name="accountmapping",
            name="account_code",
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name="accountmapping",
            name="target_type",
            field=models.CharField(default="company", max_length=100),
        ),
        migrations.AlterUniqueTogether(
            name="accountmapping",
            unique_together=set(),
        ),
        migrations.RunPython(assign_company, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="accountmapping",
            name="company",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="account_mappings",
                to="accounts.company",
            ),
        ),
        migrations.AlterModelOptions(
            name="accountmapping",
            options={"ordering": ["account_type", "target_id"]},
        ),
        migrations.AlterUniqueTogether(
            name="accountmapping",
            unique_together={("company", "account_type", "target_type", "target_id")},
        ),
    ]
