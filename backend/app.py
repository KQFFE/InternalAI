# backend/app.py
# Full-stack Flask application serving React frontend and providing API endpoints
# This file stays in the backend/ folder but gets copied to root during deployment

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, jsonify, send_from_directory, request, session
from flask_cors import CORS
from functools import wraps
from werkzeug.utils import secure_filename

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

# Initialize Flask app with proper folder configuration
app = Flask(__name__, 
            static_folder='static', 
            template_folder='templates',
            static_url_path='/static')

# ================================
# Configuration
# ================================
# Configure CORS for full-stack development
CORS(app, origins=['*'])

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.environ.get('FLASK_ENV') != 'production'
# Admin authentication configuration
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
# Get the base directory of the current file
basedir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(basedir, '..', 'frontend', 'public', 'img')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ================================
# STARTUP LOGGING (Flask 3.x compatible)
# ================================

def log_startup_info():
    """Log startup information"""
    logger.info("="*60)
    logger.info("🚀 InternalAI Full-Stack Application Starting")
    logger.info(f"📅 Start time: {datetime.now().isoformat()}")
    logger.info(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    logger.info(f"🐍 Python version: {os.sys.version}")
    logger.info(f"📁 Working directory: {os.getcwd()}")
    logger.info(f"📊 Template folder: {app.template_folder}")
    logger.info(f"📊 Static folder: {app.static_folder}")
    logger.info(f"⚛️  Frontend: React SPA with routing")
    logger.info(f"🔗 Backend: Flask REST API")
    logger.info("="*60)

# ================================
# UTILITY FUNCTIONS
# ================================

def get_team_data():
    """Load team data from JSON file"""
    try:
        # Try multiple possible locations for team.json
        possible_paths = [
            'static/team.json',           # Deployed location
            '../frontend/public/team.json',  # Development location
            'team.json'                   # Root location
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        
        logger.warning("team.json not found in any expected location")
        return []
        
    except Exception as e:
        logger.error(f"Error loading team data: {e}")
        return []

def allowed_file(filename):
    """Check if uploaded file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_safe_filename(name, file_extension):
    """Generate safe filename that retains special characters but is URL-friendly."""
    # Convert name to lowercase and replace spaces with hyphens.
    safe_name = name.lower().replace(' ', '-')
    # Return the new filename with the original file extension.
    return f"{safe_name}.{file_extension}"

def save_team_data(team_data):
    """Save team data to JSON file - integrates with your existing get_team_data paths"""
    try:
        # Use the same path logic as your existing get_team_data function
        possible_paths = [
            'static/team.json',                    # Deployed location
            '../frontend/public/team.json',        # Development location  
            'frontend/public/team.json',           # Alternative dev location
            'team.json'                           # Root location
        ]
        
        # Use the first path that exists, or default to team.json
        save_path = 'team.json'
        for path in possible_paths:
            if os.path.exists(path):
                save_path = path
                break
        
        with open(save_path, 'w', encoding='utf-8') as f:
            json.dump(team_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Team data saved to {save_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to save team data: {e}")
        return False

def sort_team_data(team_data):
    """Sort team data by role priority then by first name"""
    role_order = {
        "Tester": 1,
        "Business Analyst": 2,
        "Business Analyst & Product Owner": 2,
        "Manager": 3
    }
    
    return sorted(team_data, key=lambda x: (
        role_order.get(x['role'], 99),
        x['name'].split()[0]  # Sort by first name
    ))

# ================================
# AUTHENTICATION DECORATOR
# ================================

def require_admin(f):
    """Decorator to require admin authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_authenticated'):
            return jsonify({'error': 'Authentication required'}), 401
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
            return send_from_directory('static', path)
        except:
            logger.error(f"Static file not found: {path}")

    # Handle static files directly
    if path.startswith('static/'):
        static_path = path[7:]  # Remove 'static/' prefix
        try:
            return send_from_directory('static', static_path)
        except Exception as e:
            logger.error(f"Error serving static file {static_path}: {e}")
            return jsonify({'error': 'File not found'}), 404
    
    # Handle API routes
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
            return send_from_directory('static', path)
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
        team_data = get_team_data()
        
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
        team_data = get_team_data()
        
        if member_id < 0 or member_id >= len(team_data):
            return jsonify({
                'status': 'error',
                'message': 'Team member not found',
                'timestamp': datetime.now().isoformat()
            }), 404
        
        member = team_data[member_id]
        
        return jsonify({
            'status': 'success',
            'data': member,
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
# ERROR HANDLERS
# ================================

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

# ================================
# AUTHENTICATION ROUTES
# ================================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        if not data or 'password' not in data:
            return jsonify({'error': 'Password required'}), 400
        
        password = data.get('password')
        
        if password == ADMIN_PASSWORD:
            session['admin_authenticated'] = True
            logger.info("Admin login successful")
            return jsonify({
                'success': True, 
                'message': 'Logged in successfully'
            })
        else:
            logger.warning("Failed admin login attempt")
            return jsonify({'error': 'Invalid password'}), 401
            
    except Exception as e:
        logger.error(f"Error in admin login: {e}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    """Admin logout endpoint"""
    session.pop('admin_authenticated', None)
    logger.info("Admin logged out")
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/admin/check', methods=['GET'])
def check_admin():
    """Check admin authentication status"""
    authenticated = session.get('admin_authenticated', False)
    return jsonify({'authenticated': authenticated})

# ================================
# TEAM MANAGEMENT ROUTES
# ================================

@app.route('/api/admin/team', methods=['GET'])
@require_admin
def get_admin_team():
    """Get all team members for admin (including inactive)"""
    try:
        team_data = get_team_data()
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
            return jsonify({'error': 'Name, role, and LinkedIn URL are required'}), 400
        
        # Handle file upload
        image_filename = '/img/fallback-knowit.png'  # Default fallback image
        
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
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
        
        # Create new member object
        new_member = {
            'name': name,
            'role': role,
            'profilePicture': image_filename,
            'linkedinUrl': linkedin_url,
            'active': active
        }
        
        # Load existing team data using your existing function
        team_data = get_team_data()
        
        # Check for duplicate names
        if any(member['name'].lower() == name.lower() for member in team_data):
            return jsonify({'error': 'A team member with this name already exists'}), 400
        
        # Add new member
        team_data.append(new_member)
        
        # Sort team data
        team_data = sort_team_data(team_data)
        
        # Save to file
        if save_team_data(team_data):
            logger.info(f"Added new team member: {name}")
            return jsonify({
                'success': True, 
                'message': f'Successfully added {name} to the team',
                'member': new_member
            })
        else:
            return jsonify({'error': 'Failed to save team data'}), 500
            
    except Exception as e:
        logger.error(f"Failed to add team member: {e}")
        return jsonify({'error': f'Failed to add team member: {str(e)}'}), 500

@app.route('/api/admin/team/<int:index>/update', methods=['POST'])
@require_admin
def update_team_member(index):
    """Update existing team member"""
    try:
        team_data = get_team_data()
        
        if index < 0 or index >= len(team_data):
            return jsonify({'error': 'Team member not found'}), 404
        
        # Get current member
        member = team_data[index]
        original_name = member['name']
        
        # Update fields from form data
        member['name'] = request.form.get('name', member['name']).strip()
        member['role'] = request.form.get('role', member['role']).strip()
        member['linkedinUrl'] = request.form.get('linkedinUrl', member['linkedinUrl']).strip()
        member['active'] = request.form.get('active', str(member['active'])).lower() == 'true'
        
        # Validate required fields
        if not member['name'] or not member['role'] or not member['linkedinUrl']:
            return jsonify({'error': 'Name, role, and LinkedIn URL are required'}), 400
        
        # Handle image update
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                try:
                    # Generate safe filename based on (possibly updated) name
                    filename = generate_safe_filename(member['name'], file.filename)
                    filepath = os.path.join(UPLOAD_FOLDER, filename)

                    # Save new image
                    file.save(filepath)
                    member['profilePicture'] = f'/img/{filename}'
                    logger.info(f"Updated image for {member['name']}: {filepath}")

                except Exception as e:
                    logger.error(f"Failed to save updated image: {e}")
                    # Continue without updating image if upload fails
        
        # Re-sort team data in case role or name changed
        team_data = sort_team_data(team_data)
        
        # Save changes
        if save_team_data(team_data):
            logger.info(f"Updated team member: {original_name} -> {member['name']}")
            return jsonify({
                'success': True, 
                'message': f'Successfully updated {member["name"]}',
                'member': member
            })
        else:
            return jsonify({'error': 'Failed to save changes'}), 500
            
    except Exception as e:
        logger.error(f"Failed to update team member: {e}")
        return jsonify({'error': f'Failed to update team member: {str(e)}'}), 500

@app.route('/api/admin/team/<int:index>/toggle', methods=['POST'])
@require_admin
def toggle_team_member(index):
    """Toggle team member active status"""
    try:
        team_data = get_team_data()
        
        if index < 0 or index >= len(team_data):
            return jsonify({'error': 'Team member not found'}), 404
        
        member = team_data[index]
        member['active'] = not member['active']
        status = 'activated' if member['active'] else 'deactivated'
        
        if save_team_data(team_data):
            logger.info(f"Toggled team member status: {member['name']} -> {status}")
            return jsonify({
                'success': True, 
                'message': f'Successfully {status} {member["name"]}',
                'member': member
            })
        else:
            return jsonify({'error': 'Failed to save changes'}), 500
            
    except Exception as e:
        logger.error(f"Failed to toggle team member: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/team/<int:index>', methods=['DELETE'])
@require_admin
def delete_team_member(index):
    """Delete team member permanently"""
    try:
        team_data = get_team_data()
        
        if index < 0 or index >= len(team_data):
            return jsonify({'error': 'Team member not found'}), 404
        
        deleted_member = team_data.pop(index)
        
        if save_team_data(team_data):
            logger.info(f"Deleted team member: {deleted_member['name']}")
            return jsonify({
                'success': True, 
                'message': f'Successfully deleted {deleted_member["name"]}',
                'deleted_member': deleted_member
            })
        else:
            return jsonify({'error': 'Failed to save changes'}), 500
            
    except Exception as e:
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
            'allowed_extensions': list(ALLOWED_EXTENSIONS),
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
    """Serve image files from the UPLOAD_FOLDER, handling special characters"""
    try:
        # Flask's send_from_directory function is the best way to handle this.
        # It's important to provide the correct path to the directory and the filename.
        # It handles a lot of security and path-joining automatically.
        # The filename passed to this function will be properly decoded by Flask.
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        # If the file is not found, return a 404 error
        return "Image not found.", 404
    except Exception as e:
        # Log the internal error for debugging and return a generic 500 error
        logger.error(f"Error serving image '{filename}': {e}")
        return "Internal server error.", 500

# ================================
# MAIN APPLICATION ENTRY POINT
# ================================

if __name__ == '__main__':
    # Log startup information (Flask 3.x compatible way)
    log_startup_info()
    
    # Get port from environment (Azure sets this)
    port = int(os.environ.get('PORT', 5000))
    
    # Determine if we're in production
    is_production = os.environ.get('FLASK_ENV') == 'production'
    
    if is_production:
        logger.info(f"🚀 Starting production server on port {port}")
        # In production, use gunicorn (this won't be called)
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        logger.info(f"🛠️  Starting development server on port {port}")
        logger.info(f"🌐 Frontend will be served at: http://localhost:{port}")
        logger.info(f"🔗 API endpoints available at: http://localhost:{port}/api/")
        app.run(host='0.0.0.0', port=port, debug=True)