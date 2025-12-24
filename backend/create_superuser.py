# backend/auto_create_superuser.py

import os
import django

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nextshopsphere.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Read superuser credentials from environment variables, with defaults
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'claraberi63@gmail.com')
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'clara')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'cla19980')

# Check if user exists by email
try:
    user = User.objects.get(email=email)
    # User exists, update password
    user.set_password(password)
    user.save()
    print(f'Superuser {username} password updated!')
except User.DoesNotExist:
    # User does not exist, create superuser
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created!')
