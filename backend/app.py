# backend/app.py
# Full-stack Flask application serving React frontend and providing API endpoints
# This file stays in the backend/ folder but gets copied to root during deployment

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, jsonify, send_from_directory, request
from flask_cors import CORS

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

# Configure CORS for full-stack development
CORS(app, origins=['*'])

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.environ.get('FLASK_ENV') != 'production'

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

@app.route('/favicon.ico')
def favicon():
    """Explicit favicon route"""
   
@app.route('/<path:path>')
def serve_react_routes(path):
    """
    Handle React Router routes and static files
    This ensures React's client-side routing works properly in full-stack setup
    """
    logger.info(f"Handling path: {path}")
    
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
        'flask_version': getattr(__import__('flask'), '__version__', 'unknown'),
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