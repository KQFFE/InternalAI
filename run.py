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
    """Initialize database tables and run migrations on startup"""
    try:
        from backend.database import db
        
        with app.app_context():
            # Check if we're using a database (not SQLite file for local dev)
            database_url = os.environ.get('DATABASE_URL')
            
            if database_url and ('mssql' in database_url or 'postgresql' in database_url):
                print("🗄️  Initializing production database...")
                
                # Create tables if they don't exist
                db.create_all()
                
                # Check if we need to seed data
                from backend.models import TeamMember
                if TeamMember.query.count() == 0:
                    print("📊 Seeding database with initial data...")
                    from backend.seed import seed_database
                    seed_database()
                
                print("✅ Database initialization complete")
            else:
                print("🛠️  Using local SQLite database - skipping auto-migration")
                
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        # Don't crash the app - log error and continue
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