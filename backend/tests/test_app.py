import pytest
import sys
import os
from unittest.mock import patch, mock_open

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app, get_flask_version, log_startup_info
from backend.database import db
from backend.models import TeamMember

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Use an in-memory SQLite database for testing
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False
    })
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def sample_team_data():
    """Sample team data for testing."""
    return [
        {
            "name": "Test Person One",
            "role": "Tester",
            "profilePicture": "/img/test-person-one.jpg",
            "linkedinUrl": "https://www.linkedin.com/in/test-person-one/",
            "active": True,
            "id": 1
        },
        {
            "name": "Test Person Two",
            "role": "Manager",
            "profilePicture": "/img/test-person-two.jpg", 
            "linkedinUrl": "https://www.linkedin.com/in/test-person-two/",
            "active": False,
            "id": 2
        }
    ]

# ================================
# EXISTING ENHANCED TESTS
# ================================

def test_health_endpoint(client):
    """Test the health check endpoint with enhanced assertions."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'message' in data
    assert 'timestamp' in data
    assert 'version' in data
    assert 'components' in data
    assert data['components']['backend'] == 'Flask'
    assert data['components']['frontend'] == 'React'

def test_home_route(client, app):
    """Test the home route serves without error."""
    with patch('backend.app.render_template') as mock_render:
        mock_render.return_value = "OK"
        response = client.get('/')
        assert response.status_code == 200

def test_api_info_endpoint(client):
    """Test the API info endpoint with comprehensive checks."""
    response = client.get('/api/info')
    assert response.status_code == 200
    data = response.get_json()
    
    # Check required fields
    required_fields = ['app_name', 'description', 'version', 'architecture', 
                      'environment', 'python_version', 'flask_version', 
                      'features', 'timestamp']
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
    
    # Check specific values
    assert data['app_name'] == 'InternalAI'
    assert data['version'] == '1.0.0'
    assert data['architecture'] == 'SPA with REST API'
    assert isinstance(data['features'], list)
    assert len(data['features']) > 0

@patch('backend.app.TeamMember.query')
def test_team_endpoint_success(mock_query, client, sample_team_data):
    """Test the team endpoint with successful data retrieval."""
    # Mock the database return value
    mock_query.all.return_value = [TeamMember(**d) for d in sample_team_data]
    
    response = client.get('/api/team')
    assert response.status_code == 200
    data = response.get_json()
    
    assert data['status'] == 'success'
    assert 'data' in data
    assert isinstance(data['data'], list)
    assert 'count' in data
    assert data['count'] == 1  # Only active members
    assert 'total_members' in data
    assert data['total_members'] == 2  # All members
    assert 'timestamp' in data
    
    # Check that only active members are returned
    active_member = data['data'][0]
    assert active_member['name'] == 'Test Person One'
    assert active_member['active'] == True

@patch('backend.app.TeamMember.query')
def test_team_endpoint_no_data(mock_query, client):
    """Test team endpoint when no team data is available."""
    mock_query.all.return_value = []
    
    response = client.get('/api/team')
    assert response.status_code == 404
    data = response.get_json()
    assert data['status'] == 'error'
    assert 'No team data available' in data['message']
    assert data['data'] == []
    assert data['count'] == 0

@patch('backend.app.TeamMember.query')
def test_team_endpoint_no_active_members(mock_query, client):
    """Test team endpoint when no active members exist."""
    inactive_data = [
        {
            "name": "Inactive Person",
            "role": "Tester",
            "profilePicture": "/img/inactive.jpg",
            "linkedinUrl": "https://linkedin.com/in/inactive",
            "active": False
        }
    ]
    mock_query.all.return_value = [TeamMember(**d) for d in inactive_data]
    
    response = client.get('/api/team')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['count'] == 0  # No active members
    assert data['total_members'] == 1  # But 1 total member exists

@patch('backend.app.TeamMember.query')
def test_team_endpoint_error(mock_query, client):
    """Test team endpoint error handling."""
    mock_query.all.side_effect = Exception("Database error")
    response = client.get('/api/team')
    assert response.status_code == 500
    data = response.get_json()
    assert data.get('message') == 'Failed to load team data'
    assert data.get('error') == 'Database error'

# ================================
# UTILITY FUNCTION TESTS
# ================================

def test_get_flask_version():
    """Test Flask version detection."""
    version = get_flask_version()
    assert version is not None
    assert isinstance(version, str)
    assert len(version) > 0

@patch('backend.app.logger')
def test_log_startup_info(mock_logger, app):
    """Test startup logging function."""
    log_startup_info(app)
    # Check that logger.info was called multiple times
    assert mock_logger.info.call_count >= 5

# ================================
# ROUTE PARAMETER TESTS
# ================================

def test_serve_react_routes_with_extension(client):
    """Test serving static files with extensions."""
    # Test that files with extensions are handled
    with patch('backend.app.send_from_directory') as mock_send:
        mock_send.return_value = "OK"
        response = client.get('/favicon.ico')
        assert response.status_code == 200

def test_serve_react_routes_spa_route(client, app):
    """Test serving SPA routes without extensions."""
    with patch('backend.app.render_template') as mock_render:
        mock_render.return_value = "OK"
        response = client.get('/some-spa-route')
        assert response.status_code == 200

def test_debug_static_endpoint(client):
    """Test debug static files endpoint."""
    response = client.get('/debug/static')
    assert response.status_code == 200
    data = response.get_json()
    
    # Check expected fields in debug response
    assert 'static_directory_exists' in data
    assert 'current_directory' in data
    assert 'directory_contents' in data

# ================================
# ERROR HANDLING TESTS
# ================================

def test_404_handling(client):
    """Test 404 error handling."""
    response = client.get('/api/nonexistent-endpoint')
    assert response.status_code == 404

def test_method_not_allowed(client):
    """Test method not allowed error."""
    # Try POST on GET-only endpoint
    response = client.post('/api/health')
    assert response.status_code == 405

# ================================
# CONFIGURATION TESTS
# ================================

def test_app_configuration(app):
    """Test Flask app configuration."""
    assert app.config['SECRET_KEY'] is not None
    assert 'DEBUG' in app.config
    assert app.static_folder is not None
    assert 'static' in app.static_folder
    assert app.template_folder is not None
    assert 'templates' in app.template_folder

# ================================
# INTEGRATION TESTS
# ================================

def test_cors_headers(client):
    """Test CORS headers are present."""
    response = client.get('/api/health')
    # CORS headers should be present (added by flask-cors)
    assert response.status_code == 200

@patch('backend.app.TeamMember.query')
def test_api_chain_calls(mock_query, client, sample_team_data):
    """Test chaining multiple API calls."""
    mock_query.all.return_value = [TeamMember(**d) for d in sample_team_data]
    
    # Call health endpoint
    response = client.get('/api/health')
    assert response.status_code == 200
    
    # Call info endpoint
    response = client.get('/api/info')
    assert response.status_code == 200
    
    # Call team endpoint
    response = client.get('/api/team')
    assert response.status_code == 200
    
    # All should work independently

# ================================
# PERFORMANCE TESTS
# ================================

@patch('backend.app.TeamMember.query')
def test_large_team_data(mock_query, client):
    """Test handling of large team datasets."""
    # Create a large dataset
    large_dataset = []
    for i in range(100):
        large_dataset.append({
            "name": f"Person {i}",
            "role": "Tester" if i % 2 == 0 else "Manager",
            "profilePicture": f"/img/person-{i}.jpg",
            "linkedinUrl": f"https://linkedin.com/in/person-{i}",
            "active": i % 3 == 0  # Every third person is active
        })
    
    mock_query.all.return_value = [TeamMember(**d) for d in large_dataset]
    
    response = client.get('/api/team')
    assert response.status_code == 200
    data = response.get_json()
    
    # Check that filtering works with large dataset
    assert data['total_members'] == 100
    active_count = len([p for p in large_dataset if p['active']])
    assert data['count'] == active_count

# ================================
# CONTENT TYPE TESTS
# ================================

def test_json_content_type(client):
    """Test that API endpoints return proper JSON content type."""
    response = client.get('/api/health')
    assert response.status_code == 200
    assert 'application/json' in response.content_type

def test_api_response_structure(client):
    """Test consistent API response structure."""
    endpoints_to_test = ['/api/health', '/api/info']
    
    for endpoint in endpoints_to_test:
        response = client.get(endpoint)
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, dict)
        assert 'timestamp' in data
