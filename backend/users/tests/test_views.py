import json
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.hashers import make_password, check_password

from users.models import (
    User,
    UserNotificationSettings,
    UserThemeSettings,
    UserPrivacySettings,
)


class UserViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="demo@example.com",
            first_name="Demo",
            last_name="User",
            password=make_password("oldpass123"),
        )
        self.other = User.objects.create(
            email="other@example.com",
            first_name="Other",
            last_name="User",
            password=make_password("somepass456"),
        )

    def test_update_user_invalid_email(self):
        url = reverse("update_user", args=[self.user.id])
        resp = self.client.put(
            url,
            data=json.dumps({"email": "bad-email"}),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("invalid_email", resp.json()["error"]["code"])

    def test_update_user_duplicate_email(self):
        url = reverse("update_user", args=[self.user.id])
        resp = self.client.put(
            url,
            data=json.dumps({"email": "other@example.com"}),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["error"]["code"], "duplicate_email")

    def test_update_user_success(self):
        url = reverse("update_user", args=[self.user.id])
        resp = self.client.put(
            url,
            data=json.dumps(
                {
                    "email": "new@example.com",
                    "first_name": "New",
                    "last_name": "Name",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200)
        payload = resp.json()
        self.assertEqual(payload["email"], "new@example.com")
        self.assertEqual(payload["first_name"], "New")
        self.assertEqual(payload["last_name"], "Name")

    def test_update_password_mismatch(self):
        url = reverse("update_password", args=[self.user.id])
        resp = self.client.put(
            url,
            data=json.dumps(
                {
                    "current_password": "oldpass123",
                    "new_password": "onepass",
                    "confirm_password": "otherpass",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)

    def test_update_password_incorrect_current(self):
        url = reverse("update_password", args=[self.user.id])
        resp = self.client.put(
            url,
            data=json.dumps(
                {
                    "current_password": "wrong",
                    "new_password": "newpass123",
                    "confirm_password": "newpass123",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            resp.json()["error"]["code"], "incorrect_current_password"
        )

    def test_update_password_success(self):
        url = reverse("update_password", args=[self.user.id])
        resp = self.client.put(
            url,
            data=json.dumps(
                {
                    "current_password": "oldpass123",
                    "new_password": "newpass123",
                    "confirm_password": "newpass123",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(check_password("newpass123", self.user.password))

    def test_update_profile_picture_missing_file(self):
        url = reverse("update_profile_picture", args=[self.user.id])
        resp = self.client.post(url, {})
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["error"]["code"], "missing_file")

    def test_update_profile_picture_success(self):
        url = reverse("update_profile_picture", args=[self.user.id])
        upload = SimpleUploadedFile(
            "test.png", b"\x89PNG\r\n\x1a\n", content_type="image/png"
        )
        resp = self.client.post(url, {"upload": upload})
        self.assertEqual(resp.status_code, 200)
        payload = resp.json()
        self.assertIn("profile_picture", payload)

    def test_notifications_get_creates_defaults(self):
        url = reverse("get_notification_settings", args=[self.user.id])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["push_messages"])
        self.assertTrue(
            UserNotificationSettings.objects.filter(user=self.user).exists()
        )

    def test_notifications_update(self):
        url = reverse("update_notification_settings", args=[self.user.id])
        payload = {
            "push_messages": False,
            "push_comments": True,
            "push_reminders": False,
            "email_news": False,
            "email_messages": True,
            "email_reminders": False,
        }
        resp = self.client.put(
            url, data=json.dumps(payload), content_type="application/json"
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertFalse(data["push_messages"])
        self.assertTrue(data["push_comments"])

    def test_theme_get_creates_defaults(self):
        url = reverse("get_theme_settings", args=[self.user.id])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["skin"], "material")
        self.assertTrue(
            UserThemeSettings.objects.filter(user=self.user).exists()
        )

    def test_theme_update(self):
        url = reverse("update_theme_settings", args=[self.user.id])
        payload = {
            "skin": "contrast",
            "primary_color": "#123abc",
            "font_family": "serif",
        }
        resp = self.client.put(
            url, data=json.dumps(payload), content_type="application/json"
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["skin"], "contrast")
        self.assertEqual(data["primary_color"], "#123abc")
        self.assertEqual(data["font_family"], "serif")

    def test_privacy_get_creates_defaults(self):
        url = reverse("get_privacy_settings", args=[self.user.id])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["profile_visibility"], "public")
        self.assertTrue(
            UserPrivacySettings.objects.filter(user=self.user).exists()
        )

    def test_privacy_update_valid_choice(self):
        url = reverse("update_privacy_settings", args=[self.user.id])
        payload = {
            "profile_visibility": "private",
            "show_email": True,
            "data_sharing": True,
        }
        resp = self.client.put(
            url, data=json.dumps(payload), content_type="application/json"
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["profile_visibility"], "private")
        self.assertTrue(data["show_email"])

