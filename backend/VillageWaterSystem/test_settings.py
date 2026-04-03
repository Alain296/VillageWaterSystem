"""
Test settings - Uses SQLite for faster testing
This avoids MySQL database conflicts during testing
"""
import os
import sys

# Import settings but override database
from pathlib import Path
from datetime import timedelta

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Import everything from main settings except database
from .settings import *

# Override database to use SQLite for tests (no MySQL needed)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',  # Use in-memory database for fastest tests
    }
}

# Disable migrations for faster test setup
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()
