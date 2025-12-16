import json
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from .models import (
    User,
    UserNotificationSettings,
    UserThemeSettings,
    UserPrivacySettings,
)


def get_user(request, pk: int):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    }
    return JsonResponse(data)


def update_user(request, pk: int):
    """
    Simple API to update a user by ID.
    Expects JSON body with any of: email, first_name, last_name.
    """
    if request.method not in ("PUT", "PATCH", "POST"):
        return HttpResponseBadRequest("Unsupported method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    # Update allowed fields if present
    for field in ("email", "first_name", "last_name"):
        if field in payload:
            setattr(user, field, payload[field])

    user.save()

    data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    }
    return JsonResponse(data)


def get_notification_settings(request, pk: int):
    """Get notification settings for a user by user ID."""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")
    
    # Get or create notification settings
    settings, created = UserNotificationSettings.objects.get_or_create(
        user=user,
        defaults={
            'push_messages': True,
            'push_comments': True,
            'push_reminders': True,
            'email_news': True,
            'email_messages': True,
            'email_reminders': True,
        }
    )
    
    data = {
        "user_id": settings.user.id,
        "push_messages": settings.push_messages,
        "push_comments": settings.push_comments,
        "push_reminders": settings.push_reminders,
        "email_news": settings.email_news,
        "email_messages": settings.email_messages,
        "email_reminders": settings.email_reminders,
    }
    return JsonResponse(data)


def update_notification_settings(request, pk: int):
    """
    Update notification settings for a user by user ID.
    Expects JSON body with any of: push_messages, push_comments, push_reminders,
    email_news, email_messages, email_reminders.
    """
    if request.method not in ("PUT", "PATCH", "POST"):
        return HttpResponseBadRequest("Unsupported method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")
    
    # Get or create notification settings
    settings, created = UserNotificationSettings.objects.get_or_create(
        user=user,
        defaults={
            'push_messages': True,
            'push_comments': True,
            'push_reminders': True,
            'email_news': True,
            'email_messages': True,
            'email_reminders': True,
        }
    )

    # Update allowed fields if present
    allowed_fields = (
        "push_messages", "push_comments", "push_reminders",
        "email_news", "email_messages", "email_reminders"
    )
    for field in allowed_fields:
        if field in payload:
            setattr(settings, field, bool(payload[field]))

    settings.save()

    data = {
        "user_id": settings.user.id,
        "push_messages": settings.push_messages,
        "push_comments": settings.push_comments,
        "push_reminders": settings.push_reminders,
        "email_news": settings.email_news,
        "email_messages": settings.email_messages,
        "email_reminders": settings.email_reminders,
    }
    return JsonResponse(data)


def get_theme_settings(request, pk: int):
    """Get theme settings for a user by user ID."""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")
    
    # Get or create theme settings
    settings, created = UserThemeSettings.objects.get_or_create(
        user=user,
        defaults={
            'skin': 'material',
            'primary_color': '#4b7bec',
            'font_family': 'system',
        }
    )
    
    data = {
        "user_id": settings.user.id,
        "skin": settings.skin,
        "primary_color": settings.primary_color,
        "font_family": settings.font_family,
    }
    return JsonResponse(data)


def update_theme_settings(request, pk: int):
    """
    Update theme settings for a user by user ID.
    Expects JSON body with any of: skin, primary_color, font_family.
    """
    if request.method not in ("PUT", "PATCH", "POST"):
        return HttpResponseBadRequest("Unsupported method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")
    
    # Get or create theme settings
    settings, created = UserThemeSettings.objects.get_or_create(
        user=user,
        defaults={
            'skin': 'material',
            'primary_color': '#4b7bec',
            'font_family': 'system',
        }
    )

    # Update allowed fields if present
    allowed_fields = ("skin", "primary_color", "font_family")
    for field in allowed_fields:
        if field in payload:
            setattr(settings, field, payload[field])

    settings.save()

    data = {
        "user_id": settings.user.id,
        "skin": settings.skin,
        "primary_color": settings.primary_color,
        "font_family": settings.font_family,
    }
    return JsonResponse(data)


def get_privacy_settings(request, pk: int):
    """Get privacy settings for a user by user ID."""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    # Get or create privacy settings
    settings, created = UserPrivacySettings.objects.get_or_create(
        user=user,
        defaults={
            'profile_visibility': 'public',
            'show_email': False,
            'data_sharing': True,
        }
    )

    data = {
        "user_id": settings.user.id,
        "profile_visibility": settings.profile_visibility,
        "show_email": settings.show_email,
        "data_sharing": settings.data_sharing,
    }
    return JsonResponse(data)


def update_privacy_settings(request, pk: int):
    """
    Update privacy settings for a user by user ID.
    Expects JSON body with any of: profile_visibility, show_email, data_sharing.
    """
    if request.method not in ("PUT", "PATCH", "POST"):
        return HttpResponseBadRequest("Unsupported method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    # Get or create privacy settings
    settings, created = UserPrivacySettings.objects.get_or_create(
        user=user,
        defaults={
            'profile_visibility': 'public',
            'show_email': False,
            'data_sharing': True,
        }
    )

    # Update allowed fields if present
    allowed_fields = ("profile_visibility", "show_email", "data_sharing")
    for field in allowed_fields:
        if field in payload:
            value = payload[field]
            # Cast booleans correctly for boolean fields
            if field in ("show_email", "data_sharing"):
                value = bool(value)
            setattr(settings, field, value)

    settings.save()

    data = {
        "user_id": settings.user.id,
        "profile_visibility": settings.profile_visibility,
        "show_email": settings.show_email,
        "data_sharing": settings.data_sharing,
    }
    return JsonResponse(data)
