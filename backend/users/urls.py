from django.urls import path
from .views import get_user, update_user

urlpatterns = [
    path("<int:pk>/", get_user, name="get_user"),
    path("<int:pk>/update/", update_user, name="update_user"),
]

