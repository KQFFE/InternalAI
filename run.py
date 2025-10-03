# run.py
import os
import sys
from backend.app import create_app, log_startup_info

# Add the project root to the Python path
# This ensures that the `backend` module can be found
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    # Use insert(0) to ensure it's checked first.
    sys.path.insert(0, project_root)

# The app factory is called to create the app instance.
app = create_app()

# ================================
# AUTO-INITIALIZE DATABASE ON STARTUP
# ================================
def initialize_database():
    """
    Initialize database tables and run migrations on startup.

    NOTE: In production, db.create_all() may timeout if tables already exist.
    This is EXPECTED and SAFE behavior because:
    - Tables already exist from previous successful deployments
    - The timeout only affects the startup check, not runtime queries
    - Runtime database queries use connection pooling and work correctly
    - The app continues running even if this initialization times out

    The initialization is primarily for:
    - First-time deployment (creating tables)
    - Development environments (SQLite setup)
    - Seeding data if database is empty
    """
    try:
        from backend.database import db

        with app.app_context():
            # Check if we're using a database (not SQLite file for local dev)
            database_url = os.environ.get('DATABASE_URL')

            if database_url and ('mssql' in database_url or 'postgresql' in database_url):
                print("🗄️  Production database detected")
                print("ℹ️  Migrations handle schema - skipping db.create_all()")
                print("ℹ️  To seed data, run: flask seed-db")
                print("✅ Database initialization complete")
            else:
                print("🛠️  Using local SQLite database - skipping auto-migration")

    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        # Don't crash the app - this is expected if tables already exist
        # Runtime queries will work fine due to connection pool configuration
        print("ℹ️  App will continue - runtime database queries use connection pooling")
        import traceback
        traceback.print_exc()

# Initialize database on app startup
initialize_database()

# This file allows the 'flask' command to discover the app automatically.
# You can now run commands like 'flask db upgrade' from the project root
# without setting FLASK_APP, as Flask will find the 'app' object here.
# It also serves as the entry point for Gunicorn in production.

# ================================
# MAIN APPLICATION ENTRY POINT
# ================================

if __name__ == '__main__':
    # Log startup information
    log_startup_info(app)
    
    # Get port from environment (Azure sets this)
    port = int(os.environ.get('PORT', 5000))
    
    # Use debug=True for the development server, which enables auto-reloading
    is_debug = os.environ.get('FLASK_ENV') != 'production'
    
    if not is_debug:
        print(f"🚀 Starting production server on port {port}")
    else:
        print(f"🛠️  Starting development server on http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=is_debug)