import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customers', '0002_customer_city_customer_district_customer_postal_code_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SalesFormSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preferred_sales_term', models.CharField(choices=[('net_15', 'Net 15'), ('net_30', 'Net 30'), ('net_60', 'Net 60'), ('cod', 'Cash On Delivery'), ('custom', 'Custom')], default='net_30', max_length=20)),
                ('use_sales_shipping', models.BooleanField(default=False)),
                ('use_sales_discount', models.BooleanField(default=False)),
                ('use_sales_discount_per_line', models.BooleanField(default=False)),
                ('use_discount_account_per_product', models.BooleanField(default=False)),
                ('use_sales_deposit', models.BooleanField(default=False)),
                ('show_profit_margin_on_invoice', models.BooleanField(default=False)),
                ('block_sale_if_stock_insufficient', models.BooleanField(default=False)),
                ('lock_price_by_price_rule', models.BooleanField(default=False)),
                ('default_invoice_message', models.TextField(blank=True, default='')),
                ('default_delivery_slip_message', models.TextField(blank=True, default='')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InvoiceReminder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_enabled', models.BooleanField(default=False)),
                ('invoice_type', models.CharField(choices=[('sales_invoice', 'Invoice penjualan'), ('sales_order', 'Pesanan penjualan'), ('both', 'Keduanya')], default='sales_invoice', max_length=20)),
                ('exempt_by_amount', models.BooleanField(default=False)),
                ('exempt_amount_under', models.DecimalField(blank=True, decimal_places=2, max_digits=18, null=True)),
                ('exempt_by_customer', models.BooleanField(default=False)),
                ('exempt_by_invoice', models.BooleanField(default=False)),
                ('exempt_by_order', models.BooleanField(default=False)),
                ('exempt_customers', models.ManyToManyField(blank=True, related_name='exempt_from_reminders', to='customers.customer')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InvoiceReminderInterval',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('days', models.PositiveIntegerField()),
                ('timing', models.CharField(choices=[('before_due', 'Sebelum jatuh tempo'), ('after_due', 'Sesudah jatuh tempo')], default='before_due', max_length=10)),
                ('email_subject', models.CharField(max_length=255)),
                ('email_body', models.TextField()),
                ('include_pdf', models.BooleanField(default=True)),
                ('reminder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='intervals', to='sales.invoicereminder')),
            ],
            options={
                'ordering': ['timing', 'days'],
            },
        ),
    ]
