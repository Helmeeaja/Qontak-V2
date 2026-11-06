import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_templatesetting'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('label', models.CharField(max_length=255)),
                ('field_type', models.CharField(choices=[('text', 'Text'), ('number', 'Number'), ('date', 'Date'), ('dropdown', 'Dropdown'), ('boolean', 'Boolean'), ('textarea', 'Textarea')], max_length=20)),
                ('is_required', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('description', models.TextField(blank=True, default='')),
                ('options', models.JSONField(blank=True, null=True)),
                ('default_value', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='AccountMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account_type', models.CharField(choices=[('bank', 'Bank'), ('cash', 'Cash'), ('credit_card', 'Credit Card'), ('account_receivable', 'Account Receivable'), ('account_payable', 'Account Payable')], max_length=50)),
                ('target_type', models.CharField(max_length=100)),
                ('target_id', models.CharField(max_length=100)),
                ('account_code', models.CharField(max_length=50, unique=True)),
                ('account_name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('mapping_options', models.JSONField(blank=True, null=True)),
            ],
            options={
                'unique_together': {('account_type', 'target_type', 'target_id')},
            },
        ),
        migrations.CreateModel(
            name='ApprovalRule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, default='')),
                ('rule_type', models.CharField(choices=[('amount_based', 'Amount Based'), ('role_based', 'Role Based'), ('user_based', 'User Based'), ('workflow', 'Workflow')], max_length=50)),
                ('amount_threshold', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('condition', models.JSONField(blank=True, null=True)),
                ('notification_template', models.TextField(blank=True, default='')),
                ('approver_role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='approval_rules', to='accounts.role')),
                ('approver_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='approval_rules', to=settings.AUTH_USER_MODEL)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='approval_rules', to='accounts.company')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Billing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invoice_number', models.CharField(max_length=100, unique=True)),
                ('invoice_date', models.DateField()),
                ('due_date', models.DateField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('tax_amount', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('sent', 'Sent'), ('paid', 'Paid'), ('overdue', 'Overdue'), ('canceled', 'Canceled')], default='draft', max_length=20)),
                ('payment_method', models.CharField(blank=True, choices=[('cash', 'Cash'), ('bank_transfer', 'Bank Transfer'), ('credit_card', 'Credit Card'), ('check', 'Check'), ('online', 'Online Payment')], default='', max_length=50)),
                ('billing_period', models.CharField(max_length=100)),
                ('notes', models.TextField(blank=True, default='')),
                ('paid_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='billings', to='accounts.company')),
            ],
            options={
                'ordering': ['-invoice_date'],
            },
        ),
        migrations.CreateModel(
            name='TaggingRule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, default='')),
                ('tag_type', models.CharField(choices=[('transaction', 'Transaction'), ('customer', 'Customer'), ('product', 'Product'), ('employee', 'Employee')], max_length=50)),
                ('transaction_type', models.CharField(max_length=100)),
                ('tag_mapping', models.JSONField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('default_tag', models.CharField(blank=True, default='', max_length=100)),
                ('tag_set', models.JSONField(blank=True, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='tagging_rules', to='accounts.company')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
    ]
