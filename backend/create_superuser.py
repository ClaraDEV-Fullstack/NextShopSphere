import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nextshopsphere.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'claraberi63@gmail.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'cla19980')
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'clara')

# Check if user exists by email or username
if not User.objects.filter(email=email).exists() and not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created!')
else:
    print(f'Superuser already exists.')