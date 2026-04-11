# Use Python
FROM python:3.10-slim

# Set the folder where code will live inside Docker
WORKDIR /app

# Install tools needed for MySQL to work
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else
COPY . .

# Run collectstatic to prepare for production
RUN python manage.py collectstatic --noinput

# Start the Django server
# Isolated Gunicorn to ensure port binding works
CMD gunicorn VillageWaterSystem.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --log-level debug