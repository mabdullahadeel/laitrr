from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from dj_rest_auth.jwt_auth import CookieTokenRefreshSerializer
from dj_rest_auth.views import LogoutView
from rest_framework.decorators import api_view
from rest_framework.response import Response


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


class GoogleLogin(
    SocialLoginView
):  # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/google/callback/"
    client_class = OAuth2Client


@api_view(["POST"])
def refresh_token(request):
    d = CookieTokenRefreshSerializer(context={"request": request}).validate(
        request.data
    )
    return Response(d, status=200)


urlpatterns = [
    path("admin/", admin.site.urls),
    # path("dj-rest-auth/", include("dj_rest_auth.urls")),
    # path("dj-rest-auth/", include("dj_rest_auth.urls")),
    # path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("auth/", include("auth.urls")),
    path(
        "api/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("dj-rest-auth/google/", GoogleLogin.as_view(), name="google_login"),
    path("test-auth/refresh/", refresh_token, name="refresh_token"),
    path("test-auth/logout/", LogoutView.as_view(), name="rest_logout"),
]
