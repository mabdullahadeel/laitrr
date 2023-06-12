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
]
