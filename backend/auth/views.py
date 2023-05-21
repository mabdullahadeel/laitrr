from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.http import HttpRequest
from social_django.utils import load_strategy, load_backend


class SocialAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request: HttpRequest):
        redirect_url = "http://localhost:3000/auth"
        strategy = load_strategy(request)
        strategy.session_set("redirect_url", redirect_url)
        backend_name = "google-oauth2"
        backend = load_backend(strategy, backend_name, redirect_url)
        authorization_url = backend.auth_url()
        return Response(status=status.HTTP_200_OK, data={"url": authorization_url})
