from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from users.serializers import UserPublicSerializer
from .models import Event, EventAnnouncement


class EventSerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
        ]


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "title",
            "description",
        ]
        depth = 1


class EventAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAnnouncement
        fields = [
            "id",
            "title",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "event",
            "created_at",
            "updated_at",
        ]


class EventAnnouncementCreateSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = EventAnnouncement
        fields = ["title", "description", "event"]

    def create(self, validated_data):
        event = Event.objects.get(id=self.context["view"].kwargs["event_id"])
        validated_data["event"] = event

        if event.owner != self.context["request"].user:
            raise PermissionDenied("User is not the owner of the event")

        return super().create(validated_data)
