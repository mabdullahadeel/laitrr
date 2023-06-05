from . import views
from django.urls import path

urlpatterns = [
    path("social", views.SocialAuthView.as_view(), name="social_auth"),
]
