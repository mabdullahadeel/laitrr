from core.db import generate_uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


def profile_image_path(instance: "Account", filename: str):
    return f"profile_images/{instance.user.id}.{filename.split('.')[-1]}"


class Account(models.Model):
    id = models.CharField(
        primary_key=True, default=generate_uuid, editable=False, max_length=36
    )
    profile_image = models.ImageField(
        upload_to=profile_image_path, blank=True, null=True
    )

    class Meta:
        verbose_name = "account"
        verbose_name_plural = "accounts"
        db_table = "accounts"

    def __str__(self) -> str:
        return self.id


class User(AbstractUser):
    id = models.CharField(
        primary_key=True, default=generate_uuid, editable=False, max_length=36
    )
    email = models.EmailField(unique=True)
    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="user",
    )
    updated_at = models.DateTimeField(auto_now=True)
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        db_table = "users"

    def __str__(self):
        return f"{self.id} - {self.email}"

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email.split("@")[0].replace(".", "_")
        super().save(*args, **kwargs)


class UserFollow(models.Model):
    id = models.CharField(
        primary_key=True, default=generate_uuid, editable=False, max_length=36
    )
    # user who is being followed
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    # user who is following
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "user follow"
        verbose_name_plural = "user follows"
        db_table = "user_follow"
        unique_together = ("user", "follower")

    def __str__(self):
        return f"{self.follower} ----> {self.user}"

    def save(self, *args, **kwargs):
        if self.user == self.follower:
            raise Exception("You cannot follow yourself")
        super().save(*args, **kwargs)
