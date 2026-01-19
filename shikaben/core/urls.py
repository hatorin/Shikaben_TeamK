from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect

def root(request):
    return redirect("/fekakomon.php")

urlpatterns = [
    path("", root, name="root"),
    path("fekakomon.php", views.fekakomon_php, name="fekakomon_php"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]
