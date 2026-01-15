from django.urls import path
from . import views

urlpatterns = [
    path("fekakomon.php", views.fekakomon_php, name="fekakomon_php"),
]
