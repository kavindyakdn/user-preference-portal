import json
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from .models import User, UserNotificationSettings


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
