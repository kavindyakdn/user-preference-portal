from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


class UserNotificationSettings(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_settings'
    )
    
    # Push notification settings
    push_messages = models.BooleanField(default=True)
    push_comments = models.BooleanField(default=True)
    push_reminders = models.BooleanField(default=True)
    
    # Email notification settings
    email_news = models.BooleanField(default=True)
    email_messages = models.BooleanField(default=True)
    email_reminders = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification settings for {self.user.email}"


class UserThemeSettings(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='theme_settings'
    )
    
    skin = models.CharField(
        max_length=20,
        choices=[
            ('material', 'Material'),
            ('mini', 'Mini'),
            ('flat', 'Flat'),
            ('compact', 'Compact'),
            ('contrast', 'Contrast'),
            ('willow', 'Willow'),
        ],
        default='material'
    )
    
    primary_color = models.CharField(
        max_length=7,  # Hex color code like #4b7bec
        default='#4b7bec'
    )
    
    font_family = models.CharField(
        max_length=20,
        choices=[
            ('system', 'System default'),
            ('sans', 'Sans Serif'),
            ('serif', 'Serif'),
            ('mono', 'Monospace'),
        ],
        default='system'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Theme settings for {self.user.email}"
