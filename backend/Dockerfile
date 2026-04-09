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
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else from your backend folder
COPY . .

# Start the Django server using Gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn VillageWaterSystem.wsgi --bind 0.0.0.0:${PORT:-8000}"]