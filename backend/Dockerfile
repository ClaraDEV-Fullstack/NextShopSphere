# backend/Dockerfile - PRODUCTION
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create necessary directories
RUN mkdir -p logs staticfiles

# Collect static files (optional but recommended)
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000
# Run migrations, create superuser, then start server
CMD python manage.py migrate --noinput && python create_superuser.py && gunicorn nextshopsphere.wsgi:application --bind 0.0.0.0:8000