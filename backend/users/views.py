from django.http import JsonResponse, Http404
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

# Create your views here.
