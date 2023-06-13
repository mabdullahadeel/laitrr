from core.mixins import WrappedResponseMixin
from core.pagination import WrappedLimitOffsetPagination
from rest_framework import generics
from rest_framework.exceptions import NotFound, PermissionDenied

from . import serializers as event_serializers
from .models import Event, EventAnnouncement


class EventsList(WrappedResponseMixin, generics.ListAPIView):
    serializer_class = event_serializers.EventSerializer
    queryset = Event.objects.all()
    pagination_class = WrappedLimitOffsetPagination


class EventCreate(WrappedResponseMixin, generics.CreateAPIView):
    serializer_class = event_serializers.EventCreateSerializer
    queryset = Event.objects.all()


class EventUpdate(WrappedResponseMixin, generics.UpdateAPIView):
    serializer_class = event_serializers.EventCreateSerializer
    queryset = Event.objects.all()


class EventDelete(WrappedResponseMixin, generics.DestroyAPIView):
    def get_object(self):
        return Event.objects.filter(id=self.kwargs["event_id"]).first()

    def perform_destroy(self, instance: Event):
        if instance is None:
            raise NotFound({"event_id": "Event does not exist"})

        if instance.owner != self.request.user:
            raise PermissionDenied({"message": "User is not the owner of the event"})

        instance.delete()


class EventAnnouncementCreate(WrappedResponseMixin, generics.CreateAPIView):
    serializer_class = event_serializers.EventAnnouncementCreateSerializer
    queryset = EventAnnouncement.objects.all()


class EventAnnouncementList(WrappedResponseMixin, generics.ListAPIView):
    serializer_class = event_serializers.EventAnnouncementSerializer
    queryset = EventAnnouncement.objects.all()
    pagination_class = WrappedLimitOffsetPagination
