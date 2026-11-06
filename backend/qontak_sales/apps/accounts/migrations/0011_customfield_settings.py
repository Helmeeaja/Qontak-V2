import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_account_settings_models'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomField',
        ),
        migrations.CreateModel(
            name='CustomField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('page', models.CharField(choices=[('sales', 'Sales'), ('purchases', 'Purchases'), ('products', 'Products'), ('expenses', 'Expenses')], max_length=20)),
                ('sub_pages', models.JSONField(blank=True, default=list)),
                ('field_type', models.CharField(choices=[('text', 'Text'), ('number', 'Number'), ('date', 'Date'), ('dropdown', 'Dropdown')], max_length=20)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('deleted', 'Deleted')], default='active', max_length=10)),
                ('is_required', models.BooleanField(default=False)),
                ('show_in_print', models.BooleanField(default=False)),
                ('max_chars', models.PositiveIntegerField(blank=True, null=True)),
                ('use_decimal', models.BooleanField(default=False)),
                ('affix_type', models.CharField(choices=[('none', 'None'), ('prefix', 'Prefix'), ('suffix', 'Suffix')], default='none', max_length=10)),
                ('affix_text', models.CharField(blank=True, default='', max_length=30)),
                ('date_default', models.CharField(choices=[('none', 'Empty'), ('today', 'Today')], default='none', max_length=10)),
                ('allow_multiple', models.BooleanField(default=False)),
                ('options', models.JSONField(blank=True, default=list)),
                ('default_value', models.CharField(blank=True, max_length=100, null=True)),
                ('sort_order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_fields', to='accounts.company')),
            ],
            options={
                'ordering': ['sort_order', 'id'],
                'indexes': [models.Index(fields=['company', 'page', 'status'], name='accounts_cu_company_a0229f_idx')],
            },
        ),
    ]
