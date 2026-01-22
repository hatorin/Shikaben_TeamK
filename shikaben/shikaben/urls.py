from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from core import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("core.urls")),
    path("accounts/login/", views.kakomon_login, name="login"),
    path("signup/", views.signup_api, name="signup"),
    path("accounts/", include("django.contrib.auth.urls")),
    path('doujouManual.html', TemplateView.as_view(template_name='core/doujouManual.html'), name='manual'),
]
