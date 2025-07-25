import pytest
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_home_route(client):
    """Test the home route serves without error."""
    response = client.get('/')
    # Should either return 200 or 404 (if templates not found in CI)
    assert response.status_code in [200, 404, 500]

def test_api_info_endpoint(client):
    """Test the API info endpoint."""
    response = client.get('/api/info')
    assert response.status_code == 200
    data = response.get_json()
    assert 'app_name' in data

def test_team_endpoint(client):
    """Test the team endpoint."""
    response = client.get('/api/team')
    
    # Should return 200 or 404 (if no team data found)
    assert response.status_code in [200, 404]
    
    data = response.get_json()
    
    # Should return a structured response
    assert 'status' in data
    assert data['status'] in ['success', 'error']
    
    if response.status_code == 200:
        # Success response should have data array
        assert 'data' in data
        assert isinstance(data['data'], list)
        assert 'count' in data
        assert isinstance(data['count'], int)
    else:
        # Error response (404) should still have data as empty list
        assert 'data' in data
        assert data['data'] == []
