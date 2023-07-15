"""
Django settings for laitrr project.

Generated by 'django-admin startproject' using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from os import path
import environ
from datetime import timedelta
from auth.utils import AllowedAuthProviders

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
# move one directory abotu Base dir and find .env file
env_file_path = path.join(BASE_DIR, "../.env")
# reading .env file
env.read_env(env_file=env_file_path)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # third party apps
    "corsheaders",
    "rest_framework",
    "drf_spectacular",
    "django_extensions",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    # internal apps
    "users.apps.UsersConfig",
    "auth.apps.AuthConfig",
    "events.apps.EventsConfig",
]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "laitrr.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "laitrr.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_ASSETS_DIR = BASE_DIR / "static_assets"
STATIC_URL = "static/"
STATIC_ROOT = STATIC_ASSETS_DIR / "staticfiles"
STATICFILES_DIRS = [
    # BASE_DIR / "static",
]

MEDIA_URL = "/media/"
MEDIA_ROOT = STATIC_ASSETS_DIR / "media"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
        "OPTIONS": {
            "base_url": "http://localhost:8000" + MEDIA_URL,
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}

REST_AUTH = {
    "JWT_AUTH_REFRESH_COOKIE": "laitrr-refresh",
    "JWT_AUTH_COOKIE": "laitrr-access",
    "USE_JWT": True,
    "SESSION_LOGIN": False,
    "TOKEN_MODEL": None,
    "USER_DETAILS_SERIALIZER": "users.serializers.UserPublicSerializer",
    "JWT_AUTH_REFRESH_COOKIE_PATH": "/auth/refresh/",
    "JWT_AUTH_SECURE": False if DEBUG else True,
}

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": env.str("GOOGLE_OAUTH2_KEY"),
            "secret": env.str("GOOGLE_OAUTH2_SECRET"),
            "key": "",
            "scope": [
                "openid",
                "email",
                "profile",
            ],
        },
    },
}

SITE_ID = 1

SPECTACULAR_SETTINGS = {
    "TITLE": "Laitrr API",
    "DESCRIPTION": "Laitrr API for Laitrr App",
    "VERSION": "0.0.1",
}

ONE_DAY = 60 * 60 * 24

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=5 if not DEBUG else ONE_DAY * 7
    ),  # TODO: Determine this value
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=1 if not DEBUG else 365
    ),  # TODO: Determine this value
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

CORS_ALLOW_CREDENTIALS = True

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]

AUTH_USER_MODEL = "users.User"

ALLOWED_REDIRECT_URLS = [
    "http://localhost:3000/auth/google/callback/",
]


ALLOWED_AUTH_PROVIDERS = AllowedAuthProviders.get_auth_providers()

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = env.str("GOOGLE_OAUTH2_KEY")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = env.str("GOOGLE_OAUTH2_SECRET")
