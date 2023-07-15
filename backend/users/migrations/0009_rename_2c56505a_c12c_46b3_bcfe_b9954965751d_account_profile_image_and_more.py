# Generated by Django 4.2.1 on 2023-07-14 22:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0008_account"),
    ]

    operations = [
        migrations.RenameField(
            model_name="account",
            old_name="2c56505a-c12c-46b3-bcfe-b9954965751d",
            new_name="profile_image",
        ),
        migrations.AddField(
            model_name="user",
            name="account",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user",
                to="users.account",
            ),
        ),
    ]