from core.mixins import WrappedResponseMixin
from core.pagination import WrappedLimitOffsetPagination
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

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
    def destroy(self, request, *_, **kwargs):
        success = Event.objects.delete_event(request, kwargs["event_id"])
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class EventAnnouncementCreate(WrappedResponseMixin, generics.CreateAPIView):
    serializer_class = event_serializers.EventAnnouncementCreateSerializer
    queryset = EventAnnouncement.objects.all()


class EventAnnouncementList(WrappedResponseMixin, generics.ListAPIView):
    serializer_class = event_serializers.EventAnnouncementSerializer
    queryset = EventAnnouncement.objects.all()
    pagination_class = WrappedLimitOffsetPagination
