import os
import django


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()

    from users.models import User, UserNotificationSettings

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
    
    # Create notification settings for the user
    settings, settings_created = UserNotificationSettings.objects.get_or_create(
        user=obj,
        defaults={
            'push_messages': True,
            'push_comments': True,
            'push_reminders': True,
            'email_news': True,
            'email_messages': True,
            'email_reminders': True,
        }
    )
    if settings_created:
        print("Created notification settings for user:", obj.email)
    else:
        print("Notification settings already exist for user:", obj.email)


if __name__ == "__main__":
    main()

