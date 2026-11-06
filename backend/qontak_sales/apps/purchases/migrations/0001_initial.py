from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PurchaseSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preferred_purchase_term', models.CharField(choices=[('net_15', 'Net 15'), ('net_30', 'Net 30'), ('net_60', 'Net 60'), ('cod', 'Cash On Delivery'), ('custom', 'Custom')], default='net_30', max_length=20)),
                ('enable_supplier_in_purchase_request', models.BooleanField(default=False)),
                ('use_purchase_shipping', models.BooleanField(default=False)),
                ('use_purchase_discount', models.BooleanField(default=False)),
                ('use_purchase_discount_per_line', models.BooleanField(default=False)),
                ('use_purchase_deposit', models.BooleanField(default=False)),
                ('default_purchase_order_message', models.TextField(blank=True, default='')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
