import json
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.contrib.auth.hashers import check_password, make_password
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .models import User, UserNotificationSettings, UserThemeSettings, UserPrivacySettings


def bad_request(message: str, code: str = None, fields: dict = None):
    return JsonResponse(
        {
            "error": {
                "message": message,
                "code": code,
                "fields": fields or {},
            }
        },
        status=400,
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
        return bad_request("Unsupported method", code="unsupported_method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return bad_request("Invalid JSON", code="invalid_json")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    # Update allowed fields if present
    for field in ("email", "first_name", "last_name"):
        if field in payload:
            if field == "email":
                validator = EmailValidator()
                try:
                    validator(payload[field])
                except ValidationError:
                    return bad_request("Invalid email address", code="invalid_email")
            setattr(user, field, payload[field])

    try:
        user.save()
    except IntegrityError:
        return bad_request("Email already in use", code="duplicate_email")

    data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    }
    return JsonResponse(data)


def update_profile_picture(request, pk: int):
    """
    Update profile picture for a user by user ID.
    Expects multipart/form-data with 'profile_picture' file field.
    """
    if request.method not in ("POST", "PUT", "PATCH"):
        return bad_request("Unsupported method", code="unsupported_method")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    # Check if file was uploaded (Webix uploader sends as "upload" by default)
    if "upload" in request.FILES:
        user.profile_picture = request.FILES["upload"]
    elif "file" in request.FILES:
        user.profile_picture = request.FILES["file"]
    elif "profile_picture" in request.FILES:
        user.profile_picture = request.FILES["profile_picture"]
    else:
        return bad_request("No file uploaded", code="missing_file")

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
        return bad_request("Unsupported method", code="unsupported_method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return bad_request("Invalid JSON", code="invalid_json")

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
        return bad_request("Unsupported method", code="unsupported_method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return bad_request("Invalid JSON", code="invalid_json")

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
            'data_sharing': False,
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
        return bad_request("Unsupported method", code="unsupported_method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return bad_request("Invalid JSON", code="invalid_json")

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
            'data_sharing': False,
        }
    )

    # Update allowed fields if present
    if "profile_visibility" in payload:
        profile_visibility = payload["profile_visibility"]
        # Validate the value is one of the allowed choices
        valid_choices = ['public', 'friends', 'private']
        if profile_visibility in valid_choices:
            settings.profile_visibility = profile_visibility
    
    if "show_email" in payload:
        settings.show_email = bool(payload["show_email"])
    
    if "data_sharing" in payload:
        settings.data_sharing = bool(payload["data_sharing"])

    settings.save()

    data = {
        "user_id": settings.user.id,
        "profile_visibility": settings.profile_visibility,
        "show_email": settings.show_email,
        "data_sharing": settings.data_sharing,
    }
    return JsonResponse(data)


def update_password(request, pk: int):
    """
    Update a user's password.
    Expects JSON body with: current_password, new_password, confirm_password.
    Validates current password and matching new/confirm.
    """
    if request.method not in ("PUT", "PATCH", "POST"):
        return HttpResponseBadRequest("Unsupported method")

    try:
        body = request.body.decode() or "{}"
        payload = json.loads(body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON")

    required_fields = ("current_password", "new_password", "confirm_password")
    if not all(field in payload and payload[field] for field in required_fields):
        return HttpResponseBadRequest("Missing password fields")

    current_password = payload["current_password"]
    new_password = payload["new_password"]
    confirm_password = payload["confirm_password"]

    if new_password != confirm_password:
        return HttpResponseBadRequest("New password and confirmation do not match")

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise Http404("User not found")

    if not user.password:
        return bad_request("No existing password set", code="no_password")

    if not check_password(current_password, user.password):
        return bad_request("Current password is incorrect", code="incorrect_current_password")

    user.password = make_password(new_password)
    user.save()

    return JsonResponse({"id": user.id, "message": "Password updated"})
