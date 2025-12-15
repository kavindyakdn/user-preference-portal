import json
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from .models import User


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
