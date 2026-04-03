#!/bin/bash

echo "=== Installing Backend Dependencies ==="
cd backend
pip install -r requirements.txt

echo "=== Running Django Migrations ==="
python manage.py migrate

echo "=== Installing Frontend Dependencies ==="
cd ../frontend
npm install

echo "=== Starting Services ==="
cd ..

# Start backend in background
echo "Starting Django Backend on port 8000..."
cd backend
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Start frontend
echo "Starting React Frontend on port 3000..."
cd ../frontend
npm start

# Kill backend when frontend stops
kill $BACKEND_PID
