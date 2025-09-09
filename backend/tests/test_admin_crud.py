# backend/tests/test_admin_crud.py
import pytest
import sys
import os
import json
from unittest.mock import patch, mock_open
from io import BytesIO

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


class TestAdminCRUDEndpoints:
    """Test suite for admin CRUD API endpoints (Issue #155)"""
    
    @pytest.fixture
    def client(self):
        """Create test client"""
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    @pytest.fixture
    def admin_session(self, client):
        """Create authenticated admin session"""
        with patch.dict(os.environ, {'ADMIN_PASSWORD': 'test_password'}):
            # Login as admin
            client.post('/api/admin/login', 
                json={'password': 'test_password'},
                content_type='application/json'
            )
            yield client
    
    @pytest.fixture
    def sample_team_data(self):
        """Sample team data for testing"""
        return [
            {
                "name": "John Doe",
                "role": "Developer",
                "profilePicture": "/img/john-doe.jpg",
                "linkedinUrl": "https://linkedin.com/in/johndoe",
                "active": True
            },
            {
                "name": "Jane Smith",
                "role": "Designer",
                "profilePicture": "/img/jane-smith.jpg", 
                "linkedinUrl": "https://linkedin.com/in/janesmith",
                "active": False
            }
        ]

    # ================================
    # GET /api/admin/team TESTS
    # ================================
    
    @patch('app.get_team_data')
    def test_get_admin_team_success(self, mock_get_team_data, admin_session, sample_team_data):
        """Test GET /api/admin/team - successful retrieval"""
        mock_get_team_data.return_value = sample_team_data
        
        response = admin_session.get('/api/admin/team')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'members' in data
        assert len(data['members']) == 2
        assert data['count'] == 2
        assert 'timestamp' in data
    
    def test_get_admin_team_unauthorized(self, client):
        """Test GET /api/admin/team - unauthorized access"""
        response = client.get('/api/admin/team')
        assert response.status_code == 401
    
    @patch('app.get_team_data', side_effect=Exception("File error"))
    def test_get_admin_team_error(self, mock_get_team_data, admin_session):
        """Test GET /api/admin/team - error handling"""
        response = admin_session.get('/api/admin/team')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data

    # ================================
    # POST /api/admin/team/add TESTS
    # ================================
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_add_team_member_success(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/add - successful addition"""
        mock_get.return_value = sample_team_data
        mock_save.return_value = True
        
        new_member_data = {
            'name': 'Bob Wilson',
            'role': 'Manager',
            'linkedinUrl': 'https://linkedin.com/in/bobwilson',
            'active': 'true'
        }
        
        response = admin_session.post('/api/admin/team/add', data=new_member_data)
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'Successfully added Bob Wilson' in data['message']
        assert 'member' in data
        assert data['member']['name'] == 'Bob Wilson'
    
    @patch('app.get_team_data')
    def test_add_team_member_duplicate_name(self, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/add - duplicate name"""
        mock_get.return_value = sample_team_data
        
        duplicate_data = {
            'name': 'John Doe',  # Already exists
            'role': 'Tester',
            'linkedinUrl': 'https://linkedin.com/in/johndoe2',
            'active': 'true'
        }
        
        response = admin_session.post('/api/admin/team/add', data=duplicate_data)
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'already exists' in data['error']
    
    def test_add_team_member_missing_fields(self, admin_session):
        """Test POST /api/admin/team/add - missing required fields"""
        incomplete_data = {
            'name': 'Test User'
            # Missing role and linkedinUrl
        }
        
        response = admin_session.post('/api/admin/team/add', data=incomplete_data)
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'required' in data['error']
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_add_team_member_with_image(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/add - with image upload"""
        mock_get.return_value = sample_team_data
        mock_save.return_value = True
        
        # Create mock image file
        image_data = BytesIO(b'fake image data')
        image_data.name = 'test.jpg'
        
        with patch('builtins.open', mock_open()):
            with patch('os.path.join', return_value='/fake/path/test.jpg'):
                with patch('app.generate_safe_filename', return_value='test-image.jpg'):
                    data = {
                        'name': 'Test User',
                        'role': 'Developer',
                        'linkedinUrl': 'https://linkedin.com/in/testuser',
                        'active': 'true'
                    }
                    
                    response = admin_session.post('/api/admin/team/add', 
                        data=data,
                        content_type='multipart/form-data'
                    )
                    
                    assert response.status_code == 200

    # ================================
    # POST /api/admin/team/<int:index>/update TESTS
    # ================================
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_update_team_member_success(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/<int:index>/update - successful update"""
        mock_get.return_value = sample_team_data.copy()
        mock_save.return_value = True
        
        update_data = {
            'name': 'John Doe Updated',
            'role': 'Senior Developer',
            'linkedinUrl': 'https://linkedin.com/in/johndoe-updated',
            'active': 'false'
        }
        
        response = admin_session.post('/api/admin/team/0/update', data=update_data)
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'Successfully updated' in data['message']
        assert data['member']['name'] == 'John Doe Updated'
        assert data['member']['active'] is False
    
    @patch('app.get_team_data')
    def test_update_team_member_not_found(self, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/<int:index>/update - member not found"""
        mock_get.return_value = sample_team_data
        
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
    # DELETE /api/admin/team/<int:index> TESTS
    # ================================
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_delete_team_member_success(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test DELETE /api/admin/team/<int:index> - successful deletion"""
        mock_get.return_value = sample_team_data.copy()
        mock_save.return_value = True
        
        response = admin_session.delete('/api/admin/team/0')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'Successfully deleted' in data['message']
        assert 'John Doe' in data['message']
    
    @patch('app.get_team_data')
    def test_delete_team_member_not_found(self, mock_get, admin_session, sample_team_data):
        """Test DELETE /api/admin/team/<int:index> - member not found"""
        mock_get.return_value = sample_team_data
        
        response = admin_session.delete('/api/admin/team/999')
        
        assert response.status_code == 404
        data = response.get_json()
        assert 'not found' in data['error']
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_delete_team_member_save_failure(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test DELETE /api/admin/team/<int:index> - save failure"""
        mock_get.return_value = sample_team_data.copy()
        mock_save.return_value = False
        
        response = admin_session.delete('/api/admin/team/0')
        
        assert response.status_code == 500
        data = response.get_json()
        assert 'Failed to save' in data['error']

    # ================================
    # POST /api/admin/team/<int:index>/toggle TESTS
    # ================================
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_toggle_team_member_activate(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/<int:index>/toggle - activate member"""
        mock_get.return_value = sample_team_data.copy()
        mock_save.return_value = True
        
        # Toggle inactive member (index 1) to active
        response = admin_session.post('/api/admin/team/1/toggle')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'activated' in data['message']
        assert 'Jane Smith' in data['message']
        assert data['member']['active'] is True
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_toggle_team_member_deactivate(self, mock_save, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/<int:index>/toggle - deactivate member"""
        mock_get.return_value = sample_team_data.copy()
        mock_save.return_value = True
        
        # Toggle active member (index 0) to inactive
        response = admin_session.post('/api/admin/team/0/toggle')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert 'deactivated' in data['message']
        assert 'John Doe' in data['message']
        assert data['member']['active'] is False
        # Verify the returned member includes the index
        assert 'index' in data['member']  
        assert data['member']['index'] == 0
    
    @patch('app.get_team_data')
    def test_toggle_team_member_not_found(self, mock_get, admin_session, sample_team_data):
        """Test POST /api/admin/team/<int:index>/toggle - member not found"""
        mock_get.return_value = sample_team_data
        
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
            ('POST', '/api/admin/team/0/update'),
            ('DELETE', '/api/admin/team/0'),
            ('POST', '/api/admin/team/0/toggle')
        ]
        
        for method, endpoint in endpoints:
            if method == 'GET':
                response = client.get(endpoint)
            elif method == 'POST':
                response = client.post(endpoint)
            elif method == 'DELETE':
                response = client.delete(endpoint)
            
            assert response.status_code == 401, f"Endpoint {method} {endpoint} should require auth"

    # ================================
    # DATA VALIDATION TESTS
    # ================================
    
    @patch('app.get_team_data')
    @patch('app.save_team_data')
    def test_data_sorting_after_modifications(self, mock_save, mock_get, admin_session):
        """Test that team data is sorted after modifications"""
        unsorted_data = [
            {"name": "Zoe", "role": "Dev", "linkedinUrl": "https://linkedin.com/in/zoe", "active": True},
            {"name": "Alice", "role": "Designer", "linkedinUrl": "https://linkedin.com/in/alice", "active": True}
        ]
        mock_get.return_value = unsorted_data
        mock_save.return_value = True
        
        # Add a new member
        new_member_data = {
            'name': 'Bob',
            'role': 'Manager', 
            'linkedinUrl': 'https://linkedin.com/in/bob',
            'active': 'true'
        }
        
        with patch('app.sort_team_data') as mock_sort:
            mock_sort.return_value = unsorted_data  # Assume sorting function works
            response = admin_session.post('/api/admin/team/add', data=new_member_data)
            
            assert response.status_code == 200
            mock_sort.assert_called_once()  # Verify sorting was called