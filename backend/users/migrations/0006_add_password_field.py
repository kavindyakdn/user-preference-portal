from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_add_profile_visibility_choices"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="password",
            field=models.CharField(
                max_length=128,
                blank=True,
                default="",
                help_text="Hashed password or placeholder; store securely.",
            ),
        ),
    ]

