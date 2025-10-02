# backend/tests/test_admin_crud.py
import pytest
import sys
import os
from unittest.mock import patch, mock_open
from io import BytesIO

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.database import db
from backend.models import TeamMember


class TestAdminCRUDEndpoints:
    """Test suite for admin CRUD API endpoints (Issue #155)"""
    
    @pytest.fixture
    def app(self):
        """Create and configure a new app instance for each test."""
        # Use an in-memory SQLite database for testing
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
    def client(self, app):
        """A test client for the app."""
        return app.test_client()

    @pytest.fixture
    def admin_session(self, client, app):
        """An authenticated admin session."""
        client.post('/api/admin/login', json={'password': 'test_password'})
        return client

    @pytest.fixture
    def init_database(self, app):
        """Pre-populate the database with sample data."""
        with app.app_context():
            member1 = TeamMember(id=1, name="John Doe", role="Developer", linkedinUrl="http://linkedin/johndoe", active=True)
            member2 = TeamMember(id=2, name="Jane Smith", role="Designer", linkedinUrl="http://linkedin/janesmith", active=False)
            db.session.add_all([member1, member2])
            db.session.commit()
            # Eagerly load the objects to prevent DetachedInstanceError
            yield db.session.query(TeamMember).all()

    # ================================
    # GET /api/admin/team TESTS
    # ================================
    
    def test_get_admin_team_success(self, admin_session, init_database):
        """Test GET /api/admin/team - successful retrieval"""
        response = admin_session.get('/api/admin/team')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'members' in data
        assert len(data['members']) == 2 # Should return all members (active and inactive)
        assert data['count'] == 2
        assert 'timestamp' in data
    
    def test_get_admin_team_unauthorized(self, client):
        """Test GET /api/admin/team - unauthorized access"""
        response = client.get('/api/admin/team')
        assert response.status_code == 401

    @patch('backend.app.TeamMember.query')
    def test_get_admin_team_error(self, mock_query, admin_session):
        """Test GET /api/admin/team - error handling"""
        mock_query.all.side_effect = Exception("Database connection failed")
        response = admin_session.get('/api/admin/team')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to load team data'

    # ================================
    # POST /api/admin/team/add TESTS
    # ================================
    
    def test_add_team_member_success(self, admin_session, app):
        """Test POST /api/admin/team/add - successful addition"""
        new_member_data = {
            'name': 'Bob Wilson',
            'role': 'Manager',
            'linkedinUrl': 'https://linkedin.com/in/bobwilson',
            'active': 'true'
        }
        response = admin_session.post('/api/admin/team/add', data=new_member_data)
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['success'] is True
        assert 'Successfully added Bob Wilson' in data['message']
        assert 'member' in data
        assert data['member']['name'] == 'Bob Wilson'

        with app.app_context():
            assert TeamMember.query.count() == 1
    
    def test_add_team_member_duplicate_name(self, admin_session, init_database):
        """Test POST /api/admin/team/add - duplicate name"""
        duplicate_data = {
            'name': 'John Doe',  # Already exists
            'role': 'Tester',
            'linkedinUrl': 'https://linkedin.com/in/johndoe2',
            'active': 'true'
        }
        
        response = admin_session.post('/api/admin/team/add', data=duplicate_data)
        
        assert response.status_code == 409
        data = response.get_json()
        assert 'already exists' in data['message']

    def test_add_team_member_missing_fields(self, admin_session):
        """Test POST /api/admin/team/add - missing required fields"""
        incomplete_data = {
            'name': 'Test User'
            # Missing role and linkedinUrl
        }
        
        response = admin_session.post('/api/admin/team/add', data=incomplete_data)
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'required' in data['message']
    
    @patch('backend.app.secure_filename', return_value='test-image.jpg')
    def test_add_team_member_with_image(self, mock_secure_filename, admin_session):
        """Test POST /api/admin/team/add - with image upload"""
        # Create mock image file
        image_data = BytesIO(b'fake image data')
        image_data.name = 'test.jpg'
        
        with patch('builtins.open', mock_open()):
            with patch('os.path.join', return_value='/fake/path/test.jpg'):
                with patch('backend.app.generate_safe_filename', return_value='test-image.jpg'):
                    form_data = {
                        'name': 'Test User',
                        'role': 'Developer',
                        'linkedinUrl': 'https://linkedin.com/in/testuser',
                        'active': 'true',
                        'image': (image_data, 'test.jpg')
                    }
                    
                    response = admin_session.post('/api/admin/team/add', 
                        data=form_data,
                        content_type='multipart/form-data'
                    )
                    
                    assert response.status_code == 201
                    data = response.get_json()
                    assert data['member']['profilePicture'] == '/static/img/test-image.jpg'

    def test_add_team_member_with_invalid_file_type(self, admin_session):
        """Test POST /api/admin/team/add - with invalid file type"""
        image_data = BytesIO(b'fake image data')
        form_data = {
            'name': 'Test User',
            'role': 'Developer',
            'linkedinUrl': 'https://linkedin.com/in/testuser',
            'active': 'true',
            'image': (image_data, 'test.txt')
        }
        
        response = admin_session.post('/api/admin/team/add', 
            data=form_data,
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 201 # The backend defaults to a fallback image
        data = response.get_json()
        assert data['member']['profilePicture'] == '/static/img/fallback-knowit.png'

    def test_add_team_member_with_image_too_large(self, admin_session, app):
        """Test POST /api/admin/team/add - with image too large"""
        app.config['MAX_CONTENT_LENGTH'] = 1 * 1024  # 1 KB
        image_data = BytesIO(b'a' * 2048) # 2 KB
        form_data = {
            'name': 'Test User',
            'role': 'Developer',
            'linkedinUrl': 'https://linkedin.com/in/testuser',
            'active': 'true',
            'image': (image_data, 'test.jpg')
        }
        
        response = admin_session.post('/api/admin/team/add',
            data=form_data,
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 413

    # ================================
    # POST /api/admin/team/<int:id>/update TESTS
    # ================================
    
    def test_update_team_member_with_image(self, admin_session, init_database, app):
        """Test POST /api/admin/team/<int:id>/update - with image upload"""
        member_to_update = init_database[0]
        image_data = BytesIO(b'new fake image data')
        
        with patch('builtins.open', mock_open()):
            with patch('os.path.join', return_value='/fake/path/new-test-image.jpg'):
                with patch('backend.app.generate_safe_filename', return_value='new-test-image.jpg'):
                    form_data = {
                        'name': 'John Doe Updated',
                        'role': 'Senior Developer',
                        'linkedinUrl': 'https://linkedin.com/in/johndoe-updated',
                        'active': 'true',
                        'image': (image_data, 'new_test.jpg')
                    }
                    
                    response = admin_session.post(f'/api/admin/team/{member_to_update.id}/update',
                        data=form_data,
                        content_type='multipart/form-data'
                    )
                    
                    assert response.status_code == 200
                    data = response.get_json()
                    assert data['success'] is True
                    assert data['member']['profilePicture'] == '/static/img/new-test-image.jpg'

    def test_update_team_member_success(self, admin_session, init_database, app):
        """Test POST /api/admin/team/<int:id>/update - successful update"""
        member_to_update = init_database[0]
        update_data = {
            'name': 'John Doe Updated',
            'role': 'Senior Developer',
            'linkedinUrl': 'https://linkedin.com/in/johndoe-updated',
            'active': 'false'
        }
        response = admin_session.post(f'/api/admin/team/{member_to_update.id}/update', data=update_data)
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'Successfully updated' in data['message']
        assert data['member']['name'] == 'John Doe Updated'
        assert data['member']['id'] == member_to_update.id
        assert data['member']['active'] is False

        with app.app_context():
            updated_member = db.session.get(TeamMember, member_to_update.id)
            assert updated_member.name == 'John Doe Updated'
    
    def test_update_team_member_not_found(self, admin_session):
        """Test POST /api/admin/team/<int:id>/update - member not found"""
        update_data = {
            'name': 'Updated Name',
            'role': 'Updated Role',
            'linkedinUrl': 'https://linkedin.com/in/updated',
            'active': 'true'
        }
        response = admin_session.post('/api/admin/team/999/update', data=update_data)
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'not found' in data['error']

    # ================================
    # DELETE /api/admin/team/<int:id> TESTS
    # ================================
    
    def test_delete_team_member_success(self, admin_session, init_database, app):
        """Test DELETE /api/admin/team/<int:id> - successful deletion"""
        member_to_delete = init_database[0]
        response = admin_session.delete(f'/api/admin/team/{member_to_delete.id}')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'Successfully deleted' in data['message']
        assert 'John Doe' in data['message']

        with app.app_context():
            assert db.session.get(TeamMember, member_to_delete.id) is None
            assert TeamMember.query.count() == 1
    
    def test_delete_team_member_not_found(self, admin_session):
        """Test DELETE /api/admin/team/<int:id> - member not found"""
        response = admin_session.delete('/api/admin/team/999')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'not found' in data['error']

    @patch('backend.database.db.session.commit')
    def test_delete_team_member_db_failure(self, mock_commit, admin_session, init_database):
        """Test DELETE /api/admin/team/<int:id> - database failure"""
        mock_commit.side_effect = Exception("DB commit failed")
        member_to_delete = init_database[0]
        response = admin_session.delete(f'/api/admin/team/{member_to_delete.id}')

        assert response.status_code == 500
        data = response.get_json()
        assert 'DB commit failed' in str(data['error'])

    # ================================
    # POST /api/admin/team/<int:id>/toggle TESTS
    # ================================
    
    def test_toggle_team_member_activate(self, admin_session, init_database):
        """Test POST /api/admin/team/<int:id>/toggle - activate member"""
        inactive_member = init_database[1] # Jane Smith is inactive
        assert inactive_member.active is False
        
        response = admin_session.post(f'/api/admin/team/{inactive_member.id}/toggle')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'activated' in data['message']
        assert 'Jane Smith' in data['message']
        assert data['member']['id'] == inactive_member.id
        assert data['member']['active'] is True
    
    def test_toggle_team_member_deactivate(self, admin_session, init_database):
        """Test POST /api/admin/team/<int:id>/toggle - deactivate member"""
        active_member = init_database[0] # John Doe is active
        assert active_member.active is True

        response = admin_session.post(f'/api/admin/team/{active_member.id}/toggle')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'deactivated' in data['message']
        assert 'John Doe' in data['message']
        assert data['member']['id'] == active_member.id
        assert data['member']['active'] is False
    
    def test_toggle_team_member_not_found(self, admin_session):
        """Test POST /api/admin/team/<int:id>/toggle - member not found"""
        response = admin_session.post('/api/admin/team/999/toggle')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'not found' in data['error']

    # ================================
    # AUTHORIZATION TESTS
    # ================================
    
    def test_all_admin_endpoints_require_auth(self, client):
        """Test that all admin CRUD endpoints require authentication"""
        endpoints = [
            ('GET', '/api/admin/team'),
            ('POST', '/api/admin/team/add'),
            ('POST', '/api/admin/team/1/update'),
            ('DELETE', '/api/admin/team/1'),
            ('POST', '/api/admin/team/1/toggle')
        ]
        
        for method, endpoint in endpoints:
            if method == 'GET':
                response = client.get(endpoint)
            elif method == 'POST':
                response = client.post(endpoint)
            elif method == 'DELETE':
                response = client.delete(endpoint)
            
            assert response.status_code == 401, f"Endpoint {method} {endpoint} should require auth"
