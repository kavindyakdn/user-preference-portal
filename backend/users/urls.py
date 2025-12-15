from django.urls import path
from .views import (
    get_user,
    update_user,
    get_notification_settings,
    update_notification_settings,
)

urlpatterns = [
    path("<int:pk>/", get_user, name="get_user"),
    path("<int:pk>/update/", update_user, name="update_user"),
    path("<int:pk>/notifications/", get_notification_settings, name="get_notification_settings"),
    path("<int:pk>/notifications/update/", update_notification_settings, name="update_notification_settings"),
]

