import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_invitation'),
    ]

    operations = [
        migrations.CreateModel(
            name='TemplateSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=50)),
                ('data', models.JSONField(blank=True, default=dict)),
                ('signature_image', models.ImageField(blank=True, null=True, upload_to='template_signatures/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='template_settings', to='accounts.company')),
            ],
            options={
                'ordering': ['key'],
                'unique_together': {('company', 'key')},
            },
        ),
    ]
