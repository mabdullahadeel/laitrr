from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from users.models import UserFollow, User, Account


@receiver(post_save, sender=UserFollow)
def create_user_follow(sender, instance: UserFollow, created, **kwargs):
    if not created:
        return

    from events.models import EventAlertPreference

    EventAlertPreference.objects.create(user_follow=instance, all_events=True)


@receiver(pre_save, sender=User)
def create_user_account(sender, instance: User, **kwargs):
    """Create an account for the user if it doesn't exist"""
    if not instance.account:
        instance.account = Account.objects.create()


@receiver(pre_save, sender=Account)
def delete_old_profile_image(sender, instance: Account, **kwargs):
    """Delete old profile image if it exists"""
    if instance.pk:
        old_image = Account.objects.get(pk=instance.pk).profile_image
        if old_image:
            old_image.delete(save=False)
