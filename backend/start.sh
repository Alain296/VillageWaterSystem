#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Village Water System Backend..."

# Run migrations
echo "⚙️ Running database migrations..."
python manage.py makemigrations api --noinput
python manage.py migrate --noinput

# Start Gunicorn
echo "🌐 Starting Gunicorn on port $PORT..."
gunicorn VillageWaterSystem.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120
