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

# Expose port (for Gunicorn or Django runserver if needed)
EXPOSE 8000

# Command to start app (use gunicorn for production ideally)
CMD ["gunicorn", "nextshopsphere.wsgi:application", "--bind", "0.0.0.0:8000"]
