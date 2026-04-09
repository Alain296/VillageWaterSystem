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

# Copy your requirements file and install them
# Copy everything
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Start the Django server
# We run migrate and then gunicorn directly to avoid script issues
CMD python manage.py migrate --noinput && gunicorn VillageWaterSystem.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120