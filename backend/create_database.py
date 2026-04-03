"""
Create database using Python (no MySQL command line needed)
"""
import pymysql

# Database configuration
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'root',
    'password': 'Chemistry77+',
    'database': None  # Connect without database first
}

DB_NAME = 'village_water_system'

try:
    print("Connecting to MySQL server...")
    # Connect to MySQL server (without selecting a database)
    connection = pymysql.connect(
        host=DB_CONFIG['host'],
        port=DB_CONFIG['port'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password']
    )
    
    print("Creating database...")
    with connection.cursor() as cursor:
        # Create database
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"✅ Database '{DB_NAME}' created successfully!")
    
    connection.close()
    print("\n✅ Database setup complete!")
    print("Now you can run: python manage.py migrate")
    
except pymysql.Error as e:
    print(f"❌ Error: {e}")
    print("\nPlease check:")
    print("1. MySQL server is running")
    print("2. Username and password are correct")
    print("3. MySQL is accessible on port 3306")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

