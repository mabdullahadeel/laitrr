from rest_framework import status
from rest_framework.views import APIView
from rest_framework import permissions
from django.http import HttpRequest
from social_django.utils import load_strategy, load_backend
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from django.conf import settings
from core.response import Response
from social_core import exceptions as social_core_exceptions


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

    def _validate_state(self, value):
        request = self.context["request"]
        strategy = load_strategy(request)
        redirect_uri = strategy.session_get("redirect_uri")

        backend_name = self.context["view"].kwargs["provider"]
        backend = load_backend(strategy, backend_name, redirect_uri=redirect_uri)

        try:
            backend.validate_state()
        except social_core_exceptions.AuthMissingParameter:
            raise serializers.ValidationError(
                "State could not be found in request data."
            )
        except social_core_exceptions.AuthStateMissing:
            raise serializers.ValidationError(
                "State could not be found in server-side session data."
            )
        except social_core_exceptions.AuthStateForbidden:
            raise serializers.ValidationError("Invalid state has been provided.")

        return value

    def post(self, request: HttpRequest):
        if "state" in request.GET:
            self._validate_state(request.GET["state"])

        strategy = load_strategy(request)
        redirect_uri = strategy.session_get("redirect_uri")

        backend_name = "google-oauth2"
        backend = load_backend(strategy, backend_name, redirect_uri=redirect_uri)

        try:
            user = backend.auth_complete()
            return Response.success(data=user)
        except social_core_exceptions.AuthException as e:
            print(e)
            return Response.error(error=str(e))
