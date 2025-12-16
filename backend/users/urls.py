from django.urls import path
from .views import (
    get_user,
    update_user,
    update_profile_picture,
    get_notification_settings,
    update_notification_settings,
    get_theme_settings,
    update_theme_settings,
    get_privacy_settings,
    update_privacy_settings,
)

urlpatterns = [
    path("<int:pk>/", get_user, name="get_user"),
    path("<int:pk>/update/", update_user, name="update_user"),
    path("<int:pk>/profile-picture/", update_profile_picture, name="update_profile_picture"),
    path("<int:pk>/notifications/", get_notification_settings, name="get_notification_settings"),
    path("<int:pk>/notifications/update/", update_notification_settings, name="update_notification_settings"),
    path("<int:pk>/theme/", get_theme_settings, name="get_theme_settings"),
    path("<int:pk>/theme/update/", update_theme_settings, name="update_theme_settings"),
    path("<int:pk>/privacy/", get_privacy_settings, name="get_privacy_settings"),
    path("<int:pk>/privacy/update/", update_privacy_settings, name="update_privacy_settings"),
]

