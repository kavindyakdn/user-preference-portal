import os
import django


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()

    from users.models import User

    obj, created = User.objects.get_or_create(
        email="demo@example.com",
        defaults={
            "first_name": "Demo",
            "last_name": "User",
        },
    )
    if created:
        print("Created user:", obj.email)
    else:
        print("User already exists:", obj.email)


if __name__ == "__main__":
    main()

