from django.db import models
from core.db import generate_uuid

from django.contrib.auth import get_user_model

from users.models import User as CustomUser
from django_stubs_ext.db.models import TypedModelMeta

User: CustomUser = get_user_model()


class EventType(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    heading = models.CharField(max_length=255, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    DEFAULT_HEADING = "Other"

    @classmethod
    def default_event_type(cls):
        return cls.objects.get_or_create(heading=cls.DEFAULT_HEADING)[0]

    class Meta(TypedModelMeta):
        db_table = "event_types"
        verbose_name = "Event Type"
        verbose_name_plural = "Event Types"
        ordering = ["-create_at"]

    def __str__(self):
        return self.heading


class Event(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="events")
    type = models.ForeignKey(
        to=EventType, on_delete=models.CASCADE, related_name="events"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(TypedModelMeta):
        db_table = "events"
        ordering = ["-created_at"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.title


class EventAnnouncement(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    event = models.ForeignKey(
        to=Event, on_delete=models.CASCADE, related_name="announcements"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(TypedModelMeta):
        db_table = "event_announcements"
        verbose_name = "Event Announcement"
        verbose_name_plural = "Event Announcements"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class EventAlertPreference(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=generate_uuid)
    event_types = models.ManyToManyField(to=EventType, related_name="event_alerts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(TypedModelMeta):
        db_table = "event_alert_preferences"
        verbose_name = "Event Alert Preference"
        verbose_name_plural = "Event Alert Preferences"
        ordering = ["-created_at"]

    def __str__(self):
        return self.id
