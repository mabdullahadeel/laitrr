from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import UserFollow


@receiver(post_save, sender=UserFollow)
def create_user_follow(sender, instance: UserFollow, created, **kwargs):
    if not created:
        return

    from events.models import EventAlertPreference

    EventAlertPreference.objects.create(user_follow=instance, all_events=True)
