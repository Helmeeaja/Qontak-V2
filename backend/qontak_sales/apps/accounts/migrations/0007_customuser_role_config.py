from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_alter_customuser_access_time_limit"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="role_config",
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
    