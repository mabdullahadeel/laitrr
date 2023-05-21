from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractUser


def get_id():
    return str(uuid4())


class User(AbstractUser):
    id = models.CharField(
        primary_key=True, default=get_id, editable=False, max_length=36
    )
    email = models.EmailField(unique=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        db_table = "users"

    def __str__(self):
        return self.email
