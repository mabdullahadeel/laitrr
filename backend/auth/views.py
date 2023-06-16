from rest_framework import status
from rest_framework.views import APIView
from rest_framework import permissions
from django.http import HttpRequest
from drf_spectacular.utils import extend_schema
from core.response import Response
from dj_rest_auth.jwt_auth import CookieTokenRefreshSerializer
from rest_framework.decorators import api_view, permission_classes
from .utils import AllowedAuthProviders, GoogleOAuthUrl
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from .serializers import (
    SocialAuthQueryParamValidationSerializer,
    SocialAuthResponseSerializer,
)


class SocialAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            SocialAuthQueryParamValidationSerializer,
        ],
        request=None,
        responses={200: SocialAuthResponseSerializer},
    )
    def get(self, request: HttpRequest):
        serializer = SocialAuthQueryParamValidationSerializer(data=request.GET)
        if not serializer.is_valid():
            return Response.error(
                status=status.HTTP_400_BAD_REQUEST,
                error=serializer.errors,
            )

        provider = serializer.validated_data.get("provider")

        if provider == AllowedAuthProviders.GOOGLE_OAUTH2:
            url = GoogleOAuthUrl().get_auth_url(serializer)
            return Response.success(data={"authorization_url": url})

        return Response.error(error="Invalid payload")


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/google/callback/"
    client_class = OAuth2Client


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def refresh_token(request):
    d = CookieTokenRefreshSerializer(context={"request": request}).validate(
        request.data
    )
    return Response.success(data=d)
