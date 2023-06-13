from . import views
from django.urls import path

app_name = "events"

urlpatterns = [
    path("", views.EventsList.as_view(), name="events-list"),
    path("create/", views.EventCreate.as_view(), name="event-create"),
    path(
        "<str:event_id>/announcements/",
        views.EventAnnouncementList.as_view(),
        name="event-announcements-list",
    ),
    path(
        "<str:event_id>/announcements/create/",
        views.EventAnnouncementCreate.as_view(),
        name="event-announcement-create",
    ),
    path(
        "<str:event_id>/update/",
        views.EventUpdate.as_view(),
        name="event-update",
    ),
    path(
        "<uuid:event_id>/delete/",
        views.EventDelete.as_view(),
        name="event-delete",
    ),
]
