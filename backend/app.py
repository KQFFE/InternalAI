import os
import logging
import sys
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pathlib import Path
from flask import Flask, render_template, jsonify, send_from_directory, request, session
from flask_cors import CORS
from functools import wraps
import json
import werkzeug
from werkzeug.utils import secure_filename
from backend.database import db
from backend.models import TeamMember
from flask_migrate import Migrate
from flask_swagger_ui import get_swaggerui_blueprint

# Load environment variables from .env file
load_dotenv()

def get_flask_version():
    """Get Flask version using the recommended method"""
    try:
        import importlib.metadata
        return importlib.metadata.version("flask")
    except Exception:
        # Fallback for older Python versions
        try:
            import flask
            return getattr(flask, '__version__', 'unknown')
        except Exception:
            return 'unknown'

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def sort_team_data(team_data):
    """Sort team data by role priority then by first name"""
    role_order = {
        "Tester": 1,
        "Business Analyst": 2,
        "Business Analyst & Product Owner": 2,
        "Manager": 3
    }
    
    return sorted(team_data, key=lambda x: (
        role_order.get(x.get('role', ''), 99),
        x.get('name', '').split()[0] if x.get('name') else ''  # Sort by first name
    ))

def allowed_file(filename, allowed_extensions):
    """Check if uploaded file has allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_safe_filename(name, file_extension):
    """Generate safe filename that retains special characters but is URL-friendly."""
    safe_name = name.lower().replace(' ', '-')
    return f"{safe_name}.{file_extension}"

def get_team_data_from_db():
    """Load team data from the database."""
    members = TeamMember.query.all()
    return [member.to_dict() for member in members]

def create_app(config_overrides=None):
    """Application factory."""
    # Calculate absolute paths to avoid Flask path resolution issues
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)

    app = Flask(__name__,
                static_folder=os.path.join(project_root, 'static'),
                template_folder=os.path.join(project_root, 'templates'),
                static_url_path='/static')

    # ================================
    # Configuration
    # ================================
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['DEBUG'] = os.environ.get('FLASK_ENV') != 'production'
    app.config['SESSION_PERMANENT'] = False
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)

    # Use an absolute path for the database to avoid ambiguity.
    # This ensures that 'flask db' and the app itself always use the same file.
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    default_db_path = os.path.join(project_root, 'instance', 'app.db')
    database_url = os.environ.get('DATABASE_URL', f'sqlite:///{default_db_path}')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Connection pool configuration for Azure SQL to prevent timeout issues
    # SQLite doesn't support connection pooling, only apply for production databases
    if not database_url.startswith('sqlite'):
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
            'pool_size': 5,           # Number of connections to maintain in pool
            'max_overflow': 10,       # Maximum overflow connections beyond pool_size
            'pool_timeout': 30,       # Seconds to wait for connection from pool
            'pool_recycle': 3600,     # Recycle connections after 1 hour
            'pool_pre_ping': True,    # Verify connections are alive before using them
        }

    # Admin authentication configuration
    app.config['ADMIN_PASSWORD'] = os.environ.get('ADMIN_PASSWORD')
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['UPLOAD_FOLDER'] = os.path.join(basedir, '..', 'frontend', 'public', 'img')
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

    # Apply overrides for testing
    if config_overrides:
        app.config.update(config_overrides)

    # Ensure the instance folder exists for the database.
    os.makedirs(os.path.dirname(default_db_path), exist_ok=True)

    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    # Explicitly set the migrations directory to be in the 'backend' folder
    # This allows 'flask db' commands to be run from the project root.
    migrations_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'migrations')
    Migrate(app, db, directory=migrations_dir)
    CORS(app, origins=['*'], supports_credentials=True)

    # ================================
    # SWAGGER CONFIGURATION
    # ================================
    SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI
    API_URL = '/api/swagger.json'  # URL for exposing the swagger spec

    # Create swagger blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "InternalAI API Documentation"
        }
    )
    app.register_blueprint(swaggerui_blueprint)

    @app.route('/api/swagger.json')
    def swagger_spec():
        """Serve the OpenAPI specification"""
        spec_path = os.path.join(os.path.dirname(__file__), 'swagger.json')
        return send_from_directory(os.path.dirname(spec_path), os.path.basename(spec_path))

    def save_team_data(team_data):
        """This function is now a no-op as data is saved directly to the DB."""
        logger.info("save_team_data called, but database is now the source of truth.")
        return True

    # Register routes and other app logic within the factory
    with app.app_context():
        register_routes(app)
        register_error_handlers(app)
        register_cli_commands(app)

    # Log startup information for debugging
    log_startup_info(app)

    return app

def log_startup_info(app_instance):
    """Log startup information"""
    logger.info("="*60)
    logger.info("🚀 InternalAI Full-Stack Application Starting")
    logger.info(f"📅 Start time: {datetime.now().isoformat()}")
    logger.info(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    logger.info(f"🐍 Python version: {os.sys.version}")
    logger.info(f"📁 Working directory: {os.getcwd()}")
    logger.info(f"📊 Template folder: {app_instance.template_folder}")
    logger.info(f"📊 Static folder: {app_instance.static_folder}")
    logger.info(f"🔍 Static folder exists: {os.path.exists(app_instance.static_folder)}")
    if os.path.exists(app_instance.static_folder):
        logger.info(f"📄 Files in static: {os.listdir(app_instance.static_folder)[:10]}")
    logger.info("⚛️  Frontend: React SPA with routing")
    logger.info("🔗 Backend: Flask REST API")
    logger.info("="*60)

def register_cli_commands(app):
    @app.cli.command("seed-db")
    def seed_db_command():
        """Seeds the database with initial data."""
        # The run.py script adds the project root to sys.path,
        # so this direct import will now work correctly.
        try:
            # With the app now being run directly, we need to ensure the project root
            # is on the path for this import to be resolved.
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            if project_root not in sys.path:
                sys.path.insert(0, project_root)
            from backend.seed import seed_database
            seed_database()
            logger.info("Database seeded successfully.")

        except Exception as e:
            logger.error(f"Failed to seed database: {e}", exc_info=True)

def register_routes(app):
    # All your @app.route decorators go here.
    # This pattern keeps routes organized and tied to the app instance.

    # Get constants from app config
    UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']
    ADMIN_PASSWORD = app.config['ADMIN_PASSWORD']

    # ================================
    # AUTHENTICATION DECORATOR
    # ================================

    def require_admin(f):
        """Decorator to require admin authentication for routes"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('admin_authenticated', False):
                return jsonify({'error': 'Admin authentication required'}), 401
            return f(*args, **kwargs)
        return decorated_function

    # ================================
    # MAIN ROUTES - SERVE REACT APP
    # ================================

    @app.route('/')
    def home():
        """Serve the React app's index.html for the root route"""
        logger.info("Serving React app home page")
        try:
            return render_template('index.html')
        except Exception as e:
            logger.error(f"Error serving home page: {e}")
            return jsonify({'error': 'Application error', 'message': str(e)}), 500

    @app.route('/debug/static')
    def debug_static():
        """Debug route to see static files"""
        import os
        try:
            static_info = {
                'static_directory_exists': os.path.exists('static'),
                'current_directory': os.getcwd(),
                'directory_contents': os.listdir('.') if os.path.exists('.') else [],
            }
            
            if os.path.exists('static'):
                static_info['static_files'] = os.listdir('static')
                # Check for team photos specifically
                if os.path.exists('static/img'):
                    static_info['img_files'] = os.listdir('static/img')
            
            return jsonify(static_info)
        except Exception as e:
            return jsonify({'error': str(e)})

    
    @app.route('/<path:path>')
    def serve_react_routes(path):
        """
        Handle React Router routes and static files
        This ensures React's client-side routing works properly in full-stack setup
        """
        logger.info(f"Handling path: {path}")
        
        # Handle static files with extensions (favicon, images, etc.)
        if '.' in path and not path.startswith('api/') and not path.startswith('static/'):
            try:
                return send_from_directory(app.static_folder, path)
            except:
                logger.error(f"Static file not found: {path}")

        # Handle static files directly
        if path.startswith('static/'):
            static_path = path[7:]  # Remove 'static/' prefix
            try:
                return send_from_directory(app.static_folder, static_path)
            except Exception as e:
                logger.error(f"Error serving static file {static_path}: {e}")
                return jsonify({'error': 'File not found'}), 404
        
        # Handle unknown API routes only
        if path.startswith('api/'):
            logger.warning(f"API endpoint not found: {path}")
            return jsonify({
                'error': 'API endpoint not found',
                'path': path,
                'available_endpoints': [
                    '/api/health',
                    '/api/info',
                    '/api/team',
                    '/api/contact'
                ]
            }), 404
        
        # Handle common static files in root
        common_files = ['favicon.ico', 'robots.txt', 'manifest.json', 'team.json']
        if path in common_files:
            try:
                return send_from_directory(app.static_folder, path)
            except Exception as e:
                logger.error(f"Error serving {path}: {e}")
                return jsonify({'error': 'File not found'}), 404
        
        # For all other routes, serve the React app (SPA routing)
        try:
            return render_template('index.html')
        except Exception as e:
            logger.error(f"Error serving React app for path {path}: {e}")
            return jsonify({'error': 'Application error'}), 500


    # ================================
    # API ROUTES
    # ================================

    @app.route('/api/health')
    def health_check():
        """Health check endpoint for monitoring"""
        return jsonify({
            'status': 'healthy',
            'message': 'InternalAI Full-Stack API is running',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0',
            'components': {
                'backend': 'Flask',
                'frontend': 'React',
                'deployment': 'Azure App Service'
            }
        })

    @app.route('/api/info')
    def app_info():
        """Application information endpoint"""
        return jsonify({
            'app_name': 'InternalAI',
            'description': 'Full-stack React + Flask application',
            'version': '1.0.0',
            'architecture': 'SPA with REST API',
            'environment': os.environ.get('FLASK_ENV', 'development'),
            'python_version': os.sys.version,
            'flask_version': get_flask_version(),
            'features': [
                'React frontend with routing',
                'Flask REST API',
                'Team management',
                'Contact form',
                'Azure deployment'
            ],
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/api/team')
    def get_team_api():
        """API endpoint to get team data"""
        try:
            team_data = get_team_data_from_db()
            
            if not team_data:
                return jsonify({
                    'status': 'error',
                    'message': 'No team data available',
                    'data': [],
                    'count': 0,
                    'timestamp': datetime.now().isoformat()
                }), 404
            
            # Filter active members
            active_members = [member for member in team_data if member.get('active', False)]
            
            return jsonify({
                'status': 'success',
                'message': 'Team data retrieved successfully',
                'data': active_members,
                'count': len(active_members),
                'total_members': len(team_data),
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error in team API: {e}")
            return jsonify({
                'status': 'error',
                'message': 'Failed to load team data',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }), 500

    @app.route('/api/team/<int:member_id>')
    def get_team_member(member_id):
        """Get specific team member by ID"""
        try:
            member = db.session.get(TeamMember, member_id)
            
            if not member or not member.active:
                return jsonify({
                    'status': 'error',
                    'message': 'Team member not found or is not active',
                    'timestamp': datetime.now().isoformat()
                }), 404
            
            return jsonify({
                'status': 'success',
                'data': member.to_dict(),
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error getting team member {member_id}: {e}")
            return jsonify({
                'status': 'error',
                'message': 'Failed to get team member',
                'timestamp': datetime.now().isoformat()
            }), 500

    @app.route('/api/contact', methods=['POST'])
    def contact_form():
        """Handle contact form submissions"""
        try:
            data = request.get_json()
            
            # Validate request data
            if not data:
                return jsonify({
                    'status': 'error',
                    'message': 'No data provided'
                }), 400
            
            # Basic validation
            required_fields = ['name', 'email', 'message']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'status': 'error',
                        'message': f'Missing required field: {field}'
                    }), 400
            
            # Basic email validation
            email = data.get('email', '')
            if '@' not in email or '.' not in email:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid email format'
                }), 400
            
            # Log the contact form submission
            logger.info(f"Contact form submitted by {data['name']} ({data['email']})")
            logger.info(f"Message: {data['message'][:100]}...")  # Log first 100 chars
            
            # In a real application, you would:
            # 1. Save to database
            # 2. Send email notification
            # 3. Add to CRM system
            # 4. Validate against spam
            
            return jsonify({
                'status': 'success',
                'message': 'Thank you for your message! We will get back to you soon.',
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error processing contact form: {e}")
            return jsonify({
                'status': 'error',
                'message': 'Failed to process contact form',
                'timestamp': datetime.now().isoformat()
            }), 500

    # ================================
    # AUTHENTICATION ROUTES
    # ================================

    @app.route('/api/admin/login', methods=['POST'])
    def admin_login():
        """Admin login endpoint with proper session management"""
        try:
            # Validate content type
            if not request.is_json:
                return jsonify({
                    'success': False,
                    'error': 'Content-Type must be application/json'
                }), 400
            
            # Handle JSON decode errors specifically
            try:
                data = request.get_json()
            except Exception as json_error:
                logger.warning(f"Invalid JSON in admin login: {json_error}")
                return jsonify({
                    'success': False,
                    'error': 'Invalid JSON format'
                }), 400

            if data is None:
                return jsonify({
                    'success': False,
                    'error': 'Invalid JSON data'
                }), 400
            
            password = data.get('password', '').strip()
            
            # Validate password
            if not password:
                return jsonify({
                    'success': False,
                    'error': 'Password is required'
                }), 400
            
            if len(password) < 3:
                return jsonify({
                    'success': False,
                    'error': 'Password must be at least 3 characters'
                }), 400
            
            # Check environment variable
            admin_password = app.config.get('ADMIN_PASSWORD')
            if not admin_password:
                # This is a critical server misconfiguration.
                # Log an error and return a generic server error to the client.
                logger.error(
                    "CRITICAL: ADMIN_PASSWORD is not set in the environment."
                    " The application cannot authenticate administrators."
                    " Please set the ADMIN_PASSWORD environment variable."
                )
                logger.error("ADMIN_PASSWORD not set in environment")
                return jsonify({
                    'success': False,
                    'error': 'Server configuration error'
                }), 500
            
            # Authenticate
            if password == admin_password:
                session['admin_authenticated'] = True
                session.permanent = True  # Make session persistent
                logger.info(f"Admin login successful from {request.remote_addr}")
                return jsonify({
                    'success': True,
                    'message': 'Login successful'
                })
            else:
                logger.warning(f"Failed admin login attempt from {request.remote_addr}")
                return jsonify({
                    'success': False,
                    'error': 'Invalid password'
                }), 401
                
        except Exception as e:
            logger.error(f"Error in admin login: {e}")
            return jsonify({
                'success': False,
                'error': 'Login failed due to server error'
            }), 500

    @app.route('/api/admin/logout', methods=['POST'])
    def admin_logout():
        """Admin logout endpoint"""
        try:
            was_authenticated = session.get('admin_authenticated', False)
            session.pop('admin_authenticated', None)
            session.clear()  # Clear entire session for security
            
            if was_authenticated:
                logger.info(f"Admin logged out from {request.remote_addr}")
            
            return jsonify({
                'success': True,
                'message': 'Logged out successfully'
            })
        except Exception as e:
            logger.error(f"Error in admin logout: {e}")
            return jsonify({
                'success': True,
                'message': 'Logged out'
            })  # Still return success even if there was an error

    @app.route('/api/admin/check', methods=['GET'])
    def check_admin():
        """Check admin authentication status (DEPRECATED - use /api/admin/status)"""
        logger.warning("Deprecated endpoint /api/admin/check called - use /api/admin/status")
        authenticated = session.get('admin_authenticated', False)
        return jsonify({'authenticated': authenticated})

    @app.route('/api/admin/status', methods=['GET'])
    def admin_status():
        """Check admin authentication status - matches frontend expectations"""
        try:
            authenticated = session.get('admin_authenticated', False)
            return jsonify({
                'isAuthenticated': authenticated,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            logger.error(f"Error checking admin status: {e}")
            return jsonify({
                'isAuthenticated': False,
                'error': 'Status check failed',
                'timestamp': datetime.now().isoformat()
            }), 500

    # ================================
    # TEAM MANAGEMENT ROUTES
    # ================================

    @app.route('/api/admin/team', methods=['GET'])
    @require_admin
    def get_admin_team():
        """Get all team members for admin (including inactive)"""
        try:
            team_data = get_team_data_from_db()
            return jsonify({
                'success': True,
                'members': team_data,
                'count': len(team_data),
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            logger.error(f"Error getting admin team data: {e}")
            return jsonify({'error': 'Failed to load team data'}), 500

    @app.route('/api/admin/team/add', methods=['POST'])
    @require_admin
    def add_team_member():
        """Add new team member with optional image upload"""
        try:
            # Get form data
            name = request.form.get('name', '').strip()
            role = request.form.get('role', '').strip()
            linkedin_url = request.form.get('linkedinUrl', '').strip()
            active = request.form.get('active', 'true').lower() == 'true'
            
            # Validate required fields
            if not name or not role or not linkedin_url:
                return jsonify({
                    'success': False,
                    'error': 'Validation Error',
                    'message': 'Name, role, and LinkedIn URL are required fields.'
                }), 400
            
            # Handle file upload
            image_filename = '/img/fallback-knowit.png'  # Default fallback image
            
            if 'image' in request.files:
                file = request.files['image']
                if file and allowed_file(file.filename, app.config['ALLOWED_EXTENSIONS']):
                    try:
                        # Extract the file extension from the original filename
                        file_extension = file.filename.rsplit('.', 1)[1].lower()
                        # Generate safe filename based on person's name
                        filename = generate_safe_filename(name, file_extension)
                        filepath = os.path.join(UPLOAD_FOLDER, filename)
                    
                        # Save the file directly
                        file.save(filepath)
                        image_filename = f'/img/{filename}'
                        logger.info(f"Image saved: {filepath}")
                    
                    except Exception as e:
                        logger.error(f"Failed to save image: {e}")
            
            # Check for duplicate names
            if TeamMember.query.filter_by(name=name).first():
                return jsonify({
                    'success': False,
                    'error': 'Conflict',
                    'message': 'A team member with this name already exists.'
                }), 409 # 409 Conflict is more specific for this case
            
            # Create new member object
            new_member = TeamMember(
                name=name,
                role=role,
                profilePicture=image_filename,
                linkedinUrl=linkedin_url,
                active=active
            )
            
            db.session.add(new_member)
            db.session.commit()
            
            logger.info(f"Added new team member: {name}")
            return jsonify({
                'success': True, 
                'message': f'Successfully added {name} to the team',
                'member': new_member.to_dict()
            }), 201
        except werkzeug.exceptions.RequestEntityTooLarge as e:
            raise e # Re-raise the exception to be handled by the specific error handler
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to add team member: {e}")
            return jsonify({
                'success': False,
                'error': 'Server Error',
                'message': f'Failed to add team member: {str(e)}'
            }), 500

    @app.route('/api/admin/team/<int:id>/update', methods=['POST'])
    @require_admin
    def update_team_member(id):
        """Update existing team member"""
        try:
            member = db.session.get(TeamMember, id)
            if not member:
                return jsonify({'error': 'Team member not found'}), 404
            
            original_name = member.name
            
            # Update fields from form data
            member.name = request.form.get('name', member.name).strip()
            member.role = request.form.get('role', member.role).strip()
            member.linkedinUrl = request.form.get('linkedinUrl', member.linkedinUrl).strip()
            member.active = request.form.get('active', str(member.active)).lower() == 'true'
            
            # Validate required fields
            if not member.name or not member.role or not member.linkedinUrl:
                return jsonify({
                    'success': False,
                    'error': 'Validation Error',
                    'message': 'Name, role, and LinkedIn URL are required fields.'
                }), 400
            
            # Handle image update
            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename and allowed_file(file.filename, app.config['ALLOWED_EXTENSIONS']):
                    try:
                        # Generate safe filename based on (possibly updated) name
                        filename = generate_safe_filename(member.name, file.filename.rsplit('.', 1)[1].lower())
                        filepath = os.path.join(UPLOAD_FOLDER, filename)

                        # Save new image
                        file.save(filepath)
                        member.profilePicture = f'/img/{filename}'
                        logger.info(f"Updated image for {member.name}: {filepath}")

                    except Exception as e:
                        logger.error(f"Failed to save updated image: {e}")
                        # Continue without updating image if upload fails
            
            db.session.commit()
            logger.info(f"Updated team member: {original_name} -> {member.name}")
            return jsonify({'success': True, 'message': f'Successfully updated {member.name}', 'member': member.to_dict()})
                
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to update team member: {e}")
            return jsonify({
                'success': False,
                'error': 'Server Error',
                'message': f'Failed to update team member: {str(e)}'
            }), 500

    @app.route('/api/admin/team/<int:id>/toggle', methods=['POST'])
    @require_admin
    def toggle_team_member(id):
        """Toggle team member active status"""
        try:
            member = db.session.get(TeamMember, id)
            if not member:
                return jsonify({'error': 'Team member not found'}), 404
            
            member.active = not member.active
            status = 'activated' if member.active else 'deactivated'
            
            db.session.commit()
            logger.info(f"Toggled team member status: {member.name} -> {status}")
            return jsonify({
                'success': True, 
                'message': f'Successfully {status} {member.name}',
                'member': member.to_dict()
            })
                
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to toggle team member: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/admin/team/<int:id>', methods=['DELETE'])
    @require_admin
    def delete_team_member(id):
        """Delete team member permanently"""
        try:
            member = db.session.get(TeamMember, id)
            if not member:
                return jsonify({'error': 'Team member not found'}), 404
            
            deleted_member_name = member.name
            db.session.delete(member)
            db.session.commit()
            
            logger.info(f"Deleted team member: {deleted_member_name}")
            return jsonify({
                'success': True, 
                'message': f'Successfully deleted {deleted_member_name}'
            })
                
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to delete team member: {e}")
            return jsonify({'error': str(e)}), 500

    # ================================
    # UTILITY/DEBUG ROUTES
    # ================================

    @app.route('/api/admin/debug/upload-test', methods=['GET'])
    @require_admin
    def debug_upload():
        """Debug endpoint to check upload directory status"""
        try:
            upload_info = {
                'upload_folder': UPLOAD_FOLDER,
                'upload_folder_exists': os.path.exists(UPLOAD_FOLDER),
                'upload_folder_writable': os.access(UPLOAD_FOLDER, os.W_OK),
                'allowed_extensions': list(app.config['ALLOWED_EXTENSIONS']),
                'current_images': []
            }
            
            if os.path.exists(UPLOAD_FOLDER):
                upload_info['current_images'] = [
                    f for f in os.listdir(UPLOAD_FOLDER) 
                    if f.lower().endswith(('.png', '.jpg', '.jpeg'))
                ]
            
            return jsonify(upload_info)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # ================================
    # IMAGE SERVING ROUTE
    # ================================
    @app.route('/img/<path:filename>')
    def serve_image(filename):
        """Serve image files from static/img folder (temporary fix - see REFACTOR_STATIC_ASSET_SERVING.md)"""
        try:
            # Images are deployed to static/img/ in production container
            img_folder = os.path.join(app.static_folder, 'img')
            return send_from_directory(img_folder, filename)
        except FileNotFoundError:
            return "Image not found.", 404
        except Exception as e:
            logger.error(f"Error serving image '{filename}': {e}")
            return "Internal server error.", 500

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors - serve React app for client-side routing"""
        logger.info(f"404 error for path: {request.path}")
        
        # If it's an API request, return JSON error
        if request.path.startswith('/api/'):
            return jsonify({
                'status': 'error',
                'message': 'API endpoint not found',
                'path': request.path,
                'method': request.method,
                'timestamp': datetime.now().isoformat()
            }), 404
        
        # For all other 404s, serve React app (handles client-side routing)
        try:
            return render_template('index.html')
        except Exception as e:
            logger.error(f"Error serving React app for 404: {e}")
            return jsonify({'error': 'Application error'}), 500

    @app.errorhandler(werkzeug.exceptions.RequestEntityTooLarge)
    def handle_request_entity_too_large(e):
        """Handle request entity too large errors"""
        logger.error(f"Request entity too large: {e}")
        return jsonify({
            'status': 'error',
            'message': 'File size exceeds the limit',
            'timestamp': datetime.now().isoformat()
        }), 413

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        logger.error(f"Internal server error: {error}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error',
            'timestamp': datetime.now().isoformat()
        }), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        """Handle unexpected exceptions"""
        # Avoid catching specific HTTP exceptions that have their own handlers
        if isinstance(e, (werkzeug.exceptions.NotFound, werkzeug.exceptions.MethodNotAllowed, werkzeug.exceptions.BadRequest)):
            return e

        logger.error(f"Unexpected error: {e}", exc_info=True)
        
        # Return JSON for API requests
        if request.path.startswith('/api/'):
            return jsonify({
                'status': 'error',
                'message': 'An unexpected error occurred',
                'timestamp': datetime.now().isoformat()
            }), 500
        
        # For frontend requests, try to serve React app
        try:
            return render_template('index.html')
        except:
            return jsonify({
                'status': 'error',
                'message': 'Critical application error',
                'timestamp': datetime.now().isoformat()
            }), 500

app = create_app()