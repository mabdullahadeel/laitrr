from rest_framework import status
from rest_framework.views import APIView
from rest_framework import permissions
from django.http import HttpRequest
from social_django.utils import load_strategy, load_backend
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from django.conf import settings
from core.response import Response


class SocialAuthResponseSerializer(serializers.Serializer):
    authorization_url = serializers.CharField(read_only=True)


class SocialAuthQueryParamValidationSerializer(serializers.Serializer):
    redirect_url = serializers.URLField(required=True, write_only=True)
    provider = serializers.ChoiceField(
        required=True,
        write_only=True,
        choices=["google-oauth2"],
    )

    def validate(self, attrs):
        redirect_url: str = attrs.get("redirect_url")
        provider: str = attrs.get("provider")
        if redirect_url not in getattr(settings, "ALLOWED_REDIRECT_URLS", []):
            raise serializers.ValidationError("redirect_url is not allowed")
        if provider not in getattr(settings, "ALLOWED_AUTH_PROVIDERS", []):
            raise serializers.ValidationError("provider is not allowed")

        return super().validate(attrs)


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
        strategy = load_strategy(request)
        backend = load_backend(
            strategy=strategy,
            name=serializer.validated_data.get("provider"),
            redirect_uri=serializer.validated_data.get("redirect_url"),
        )
        authorization_url = backend.auth_url()
        return Response.success(
            status=status.HTTP_200_OK, data={"authorization_url": authorization_url}
        )
