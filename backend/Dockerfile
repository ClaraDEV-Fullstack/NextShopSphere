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

# Create logs directory
RUN mkdir -p logs

# Expose port for Render
EXPOSE 8000

# Run migrations, collect static files, then start Gunicorn
CMD sh -c "
    python manage.py migrate --noinput &&
    python manage.py collectstatic --noinput &&
    gunicorn nextshopsphere.wsgi:application --bind 0.0.0.0:8000 --workers 3
"
