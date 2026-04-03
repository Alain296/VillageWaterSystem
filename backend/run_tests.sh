#!/bin/bash
echo "========================================"
echo "Village Water System - Test Suite"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Running Django tests..."
echo ""

python manage.py test api.tests --verbosity=2

echo ""
echo "========================================"
echo "Test execution completed!"
echo "========================================"

