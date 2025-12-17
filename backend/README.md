# Backend (Django)

## Prerequisites

- Python 3.12+
- (Optional) Virtualenv: `python -m venv venv`

## Setup

```bash
cd backend
./venv/Scripts/activate  # or source venv/bin/activate on Unix
pip install -r requirements.txt  # if present; otherwise install Django as needed
python manage.py migrate
```

## Running

```bash
python manage.py runserver
```

Media files (profile pictures) are served in development via `settings.DEBUG` with `MEDIA_URL`/`MEDIA_ROOT`.

## Key Endpoints (no auth applied)

- `GET /api/users/<id>/` — get user
- `PUT /api/users/<id>/update/` — update email/first/last
- `PUT /api/users/<id>/password/update/` — update password (requires `current_password`, `new_password`, `confirm_password`)
- `POST /api/users/<id>/profile-picture/` — upload image (`upload`/`file`/`profile_picture` field)
- Notifications: `GET /api/users/<id>/notifications/`, `PUT /api/users/<id>/notifications/update/`
- Theme: `GET /api/users/<id>/theme/`, `PUT /api/users/<id>/theme/update/`
- Privacy: `GET /api/users/<id>/privacy/`, `PUT /api/users/<id>/privacy/update/`

## Testing

```bash
cd backend
./venv/Scripts/python.exe manage.py test users.tests.test_views
# or all app tests
./venv/Scripts/python.exe manage.py test users
```

Tests cover user update, password update, notifications/theme/privacy get/update, and profile picture upload.

## Notes

- Passwords are hashed with `make_password`; `check_password` validates.
- Error responses are structured: `{"error": {"message": "...", "code": "...", "fields": {}}}`.
- No authentication/authorization is implemented in this app.
