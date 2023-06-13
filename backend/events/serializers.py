from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from users.serializers import UserPublicSerializer
from .models import Event, EventAnnouncement, EventType


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
    type = serializers.PrimaryKeyRelatedField(
        required=False,
        queryset=EventType.objects.all(),
    )
    owner = serializers.HiddenField(
        default=serializers.CurrentUserDefault(),
    )

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "type",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data: dict):
        validated_data.setdefault("type", EventType.default_event_type())
        return super().create(validated_data)


class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "title",
            "description",
        ]

    def update(self, instance: Event, validated_data: dict):
        if serializers.CurrentUserDefault() != instance.owner:
            raise PermissionDenied({"message": "User is not the owner of the event"})

        return super().update(instance, validated_data)


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
            raise PermissionDenied({"message": "User is not the owner of the event"})

        return super().create(validated_data)
