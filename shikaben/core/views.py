from django.shortcuts import render
from django.utils import timezone

def fekakomon_php(request):
    return render(request, "core/fekakomon.html")
