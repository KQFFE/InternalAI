
import pytest
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.database import db
from backend.models import TeamMember

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False,
        'ADMIN_PASSWORD': 'test_password'
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
def init_database(app):
    """Pre-populate the database with sample data."""
    with app.app_context():
        member1 = TeamMember(id=1, name="John Doe", role="Developer", linkedinUrl="http://linkedin/johndoe", active=True)
        member2 = TeamMember(id=2, name="Jane Smith", role="Designer", linkedinUrl="http://linkedin/janesmith", active=False)
        member3 = TeamMember(id=3, name="Peter Jones", role="Manager", linkedinUrl="http://linkedin/peterjones", active=True)
        db.session.add_all([member1, member2, member3])
        db.session.commit()
        yield

class TestPublicAPIEndpoints:
    """Test suite for public-facing API endpoints"""

    def test_get_public_team_success(self, client, init_database):
        """Test GET /api/team - successful retrieval of active members"""
        response = client.get('/api/team')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert 'data' in data
        assert len(data['data']) == 2  # Only active members (John Doe, Peter Jones)
        assert data['count'] == 2
        # Check for one of the active members
        assert any(member['name'] == 'John Doe' for member in data['data'])
        # Check that inactive members are not in the list
        assert not any(member['name'] == 'Jane Smith' for member in data['data'])

    def test_get_public_team_empty(self, client, app):
        """Test GET /api/team - no active members"""
        with app.app_context():
            # Add only inactive members
            member1 = TeamMember(name="Inactive User", role="Developer", active=False)
            db.session.add(member1)
            db.session.commit()
        
        response = client.get('/api/team')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert len(data['data']) == 0
        assert data['count'] == 0

    def test_get_team_member_by_id_success(self, client, init_database):
        """Test GET /api/team/<id> - successful retrieval of a specific active member"""
        response = client.get('/api/team/1')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert data['data']['name'] == 'John Doe'
        assert data['data']['id'] == 1

    def test_get_team_member_by_id_not_found(self, client, init_database):
        """Test GET /api/team/<id> - member not found"""
        response = client.get('/api/team/999')
        assert response.status_code == 404
        data = response.get_json()
        assert data['status'] == 'error'
        assert 'not found' in data['message']

    def test_get_team_member_by_id_inactive(self, client, init_database):
        """Test GET /api/team/<id> - member is inactive"""
        response = client.get('/api/team/2') # Jane Smith is inactive
        assert response.status_code == 404
        data = response.get_json()
        assert data['status'] == 'error'
        assert 'not found or is not active' in data['message']
