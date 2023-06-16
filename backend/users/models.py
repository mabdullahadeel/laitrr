from core.db import generate_uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    id = models.CharField(
        primary_key=True, default=generate_uuid, editable=False, max_length=36
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
