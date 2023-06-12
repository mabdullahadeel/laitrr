from rest_framework.generics import ListAPIView, CreateAPIView
from .serializers import (
    EventSerializer,
    EventCreateSerializer,
    EventAnnouncementSerializer,
    EventAnnouncementCreateSerializer,
)
from core.pagination import WrappedLimitOffsetPagination
from .models import Event, EventAnnouncement
from core.mixins import WrappedResponseMixin


class EventsList(WrappedResponseMixin, ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    pagination_class = WrappedLimitOffsetPagination


class EventCreate(WrappedResponseMixin, CreateAPIView):
    serializer_class = EventCreateSerializer
    queryset = Event.objects.all()


class EventAnnouncementCreate(WrappedResponseMixin, CreateAPIView):
    serializer_class = EventAnnouncementCreateSerializer
    queryset = EventAnnouncement.objects.all()


class EventAnnouncementList(WrappedResponseMixin, ListAPIView):
    serializer_class = EventAnnouncementSerializer
    queryset = EventAnnouncement.objects.all()
    pagination_class = WrappedLimitOffsetPagination
