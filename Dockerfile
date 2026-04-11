FROM python:3.10
WORKDIR /app
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
RUN python manage.py collectstatic --noinput
CMD gunicorn VillageWaterSystem.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120