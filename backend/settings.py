"""
Django settings for the AI Resume Analyzer backend project.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from backend/.env (GEMINI_API_KEY, etc.)
load_dotenv(BASE_DIR / "backend" / ".env")

# Prefer DJANGO_SECRET_KEY; SECRET_KEY is accepted for Render compatibility
_INSECURE_DEV_FALLBACK = "django-insecure-*jgsnv_x#9pw-1ef(nhi2e7pt4lhv#(tv1*eyoqh&xxa=3=1q6"
SECRET_KEY = (
    os.environ.get("DJANGO_SECRET_KEY")
    or os.environ.get("SECRET_KEY")
    or _INSECURE_DEV_FALLBACK
)

DEBUG = os.environ.get("DJANGO_DEBUG", "True").lower() in ("true", "1", "yes")

if not DEBUG and SECRET_KEY == _INSECURE_DEV_FALLBACK:
    raise ValueError(
        "DJANGO_SECRET_KEY (or SECRET_KEY) must be set in production. "
        "Add it to Render environment variables."
    )

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        "DJANGO_ALLOWED_HOSTS",
        "localhost,127.0.0.1,hello-ats-ai.onrender.com",
    ).split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "corsheaders",
    # Local
    "analyzer",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

# ---------------------------------------------------------------------------
# CORS — local dev + production frontends (Vercel, etc.)
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,"
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

# Vercel preview & production URLs (e.g. *.vercel.app)
CORS_ALLOWED_ORIGIN_REGEXES = [
    regex.strip()
    for regex in os.environ.get(
        "CORS_ALLOWED_ORIGIN_REGEXES",
        r"^https://.*\.vercel\.app$",
    ).split(",")
    if regex.strip()
]

CORS_ALLOW_CREDENTIALS = True

# Django 4+ — required if using session/cookie auth across origins
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
] + [o for o in CORS_ALLOWED_ORIGINS if o.startswith("https://")]

# ---------------------------------------------------------------------------
# Resume upload constraints (PRD §15 — Security)
# ---------------------------------------------------------------------------
MAX_RESUME_UPLOAD_SIZE_MB = int(os.environ.get("MAX_RESUME_UPLOAD_SIZE_MB", "5"))
MAX_RESUME_UPLOAD_SIZE_BYTES = MAX_RESUME_UPLOAD_SIZE_MB * 1024 * 1024
ALLOWED_RESUME_CONTENT_TYPES = ("application/pdf",)
ALLOWED_RESUME_EXTENSIONS = (".pdf",)

# ---------------------------------------------------------------------------
# Google Gemini AI (PRD §5.3)
# ---------------------------------------------------------------------------
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
MAX_RESUME_TEXT_CHARS = int(os.environ.get("MAX_RESUME_TEXT_CHARS", "30000"))
