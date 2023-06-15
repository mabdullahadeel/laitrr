# Generated by Django 4.2.1 on 2023-06-15 02:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0004_userfollow"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="userfollow",
            constraint=models.UniqueConstraint(
                fields=("user", "follower"), name="unique_user_follower"
            ),
        ),
    ]
