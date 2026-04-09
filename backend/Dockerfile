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

# Install dos2unix to fix line endings from Windows
RUN apt-get update && apt-get install -y dos2unix && rm -rf /var/lib/apt/lists/*
RUN dos2unix start.sh && chmod +x start.sh

# Start the Django server using the startup script
# We use 'sh start.sh' to be safe
CMD ["sh", "start.sh"]