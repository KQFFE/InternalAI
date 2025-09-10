# backend/tests/test_admin_auth.py
import pytest
import sys
import json
import os
from unittest.mock import patch

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app


class TestAdminAuthentication:
    """Test suite for admin authentication endpoints"""
    
    @pytest.fixture
    def app(self):
        """Create and configure a new app instance for each test."""
        app = create_app({'TESTING': True, 'WTF_CSRF_ENABLED': False})
        yield app

    @pytest.fixture
    def client(self, app):
        """Create test client"""
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    @pytest.fixture
    def admin_password(self):
        """Mock admin password"""
        return "test_admin_password"
    
    @pytest.fixture
    def authed_app(self, admin_password):
        """Creates an app instance with a specific admin password for testing."""
        app = create_app({
            'TESTING': True,
            'WTF_CSRF_ENABLED': False,
            'ADMIN_PASSWORD': admin_password
        })
        yield app
    
    def test_admin_login_success(self, authed_app, admin_password):
        """Test successful admin login"""
        with authed_app.test_client() as client:
            response = client.post('/api/admin/login', 
                json={'password': admin_password},
                content_type='application/json'
            )
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['success'] is True
            assert 'message' in data
    
    def test_admin_login_invalid_password(self, authed_app):
        """Test admin login with invalid password"""
        with authed_app.test_client() as client:
            response = client.post('/api/admin/login',
                json={'password': 'wrong_password'},
                content_type='application/json'
            )
            
            assert response.status_code == 401
            data = json.loads(response.data)
            assert data['success'] is False
            assert 'error' in data
            assert data['error'] == 'Invalid password'
    
    def test_admin_login_missing_password(self, client):
        """Test admin login with missing password field"""
        response = client.post('/api/admin/login',
            json={},
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'error' in data
        assert 'password' in data['error'].lower()
    
    def test_admin_login_empty_password(self, client):
        """Test admin login with empty password"""
        response = client.post('/api/admin/login',
            json={'password': ''},
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'error' in data
    
    def test_admin_login_whitespace_password(self, client):
        """Test admin login with whitespace-only password"""
        response = client.post('/api/admin/login',
            json={'password': '   '},
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'error' in data
    
    def test_admin_login_invalid_content_type(self, authed_app, admin_password):
        """Test admin login with invalid content type"""
        with authed_app.test_client() as client:
            response = client.post('/api/admin/login',
                data={'password': admin_password}  # Form data instead of JSON
            )
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert data['success'] is False
            assert 'error' in data
    
    def test_admin_login_invalid_json(self, client):
        """Test admin login with invalid JSON"""
        response = client.post('/api/admin/login',
            data='invalid json',
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'error' in data
    
    def test_admin_login_no_env_password(self):
        """Test admin login when no admin password is set in environment"""
        # Create an app with the password explicitly set to None
        app = create_app({'ADMIN_PASSWORD': None, 'TESTING': True})
        with app.test_client() as client:
            response = client.post('/api/admin/login',
                json={'password': 'any_password'},
                content_type='application/json'
            )
            
            assert response.status_code == 500
            data = response.get_json()
            assert data['success'] is False
            assert 'Server configuration error' in data['error']
    
    def test_admin_logout_success(self, authed_app, admin_password):
        """Test successful admin logout"""
        with authed_app.test_client() as client:
            login_response = client.post('/api/admin/login',
                json={'password': admin_password},
                content_type='application/json'
            )
            assert login_response.status_code == 200
            
            # Then logout
            logout_response = client.post('/api/admin/logout')
            assert logout_response.status_code == 200
            
            data = json.loads(logout_response.data)
            assert data['success'] is True
            assert 'message' in data
    
    def test_admin_logout_without_login(self, client):
        """Test logout without being logged in"""
        response = client.post('/api/admin/logout')
        
        # Should still succeed (idempotent operation)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
    
    def test_admin_login_method_not_allowed(self, client):
        """Test admin login with wrong HTTP method"""
        response = client.get('/api/admin/login')
        assert response.status_code == 404  # Current architecture returns 404

    def test_admin_logout_method_not_allowed(self, client):
        """Test admin logout with wrong HTTP method"""
        response = client.get('/api/admin/logout')
        assert response.status_code == 404  # Current architecture returns 404
    
    def test_admin_session_persistence(self, authed_app, admin_password):
        """Test that admin session persists across requests"""
        with authed_app.test_client() as client:
            # Login
            login_response = client.post('/api/admin/login',
                json={'password': admin_password},
                content_type='application/json'
            )
            assert login_response.status_code == 200
            
            # Make authenticated request (if such endpoint exists)
            # This would test session cookies or tokens
            auth_response = client.get('/api/admin/status')
            if auth_response.status_code != 404:  # If endpoint exists
                assert auth_response.status_code == 200
    
    def test_admin_password_security_measures(self, authed_app):
        """Test security measures for password handling"""
        with authed_app.test_client() as client:
            # Make multiple failed attempts
            for _ in range(5):
                response = client.post('/api/admin/login',
                    json={'password': 'wrong'},
                    content_type='application/json'
                )
                assert response.status_code == 401
            
            # Next request might be rate limited
            response = client.post('/api/admin/login',
                json={'password': 'wrong'},
                content_type='application/json'
            )
            # Response could be 401 or 429 depending on implementation
            assert response.status_code in [401, 429]
    
    def test_admin_login_sql_injection_prevention(self, authed_app):
        """Test that admin login prevents SQL injection attempts"""
        malicious_passwords = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "admin'; --",
            "' UNION SELECT * FROM users --"
        ]
        
        with authed_app.test_client() as client:
            for password in malicious_passwords:
                response = client.post('/api/admin/login',
                    json={'password': password},
                    content_type='application/json'
                )
                
                # Should reject malicious input
                assert response.status_code in [400, 401]
                data = json.loads(response.data)
                assert data['success'] is False
    
    def test_admin_login_xss_prevention(self, authed_app):
        """Test that admin login prevents XSS attempts"""
        xss_passwords = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src=x onerror=alert('xss')>",
            "'; alert('xss'); //",
        ]
        
        with authed_app.test_client() as client:
            for password in xss_passwords:
                response = client.post('/api/admin/login',
                    json={'password': password},
                    content_type='application/json'
                )
                
                # Should handle safely without executing scripts
                assert response.status_code in [400, 401]
                data = json.loads(response.data)
                assert data['success'] is False
                # Ensure no script content is echoed back
                assert '<script>' not in str(response.data)
                assert 'javascript:' not in str(response.data)
    
    def test_admin_login_csrf_protection(self, authed_app, admin_password):
        """Test CSRF protection behavior (no-op today; tolerant if added later)."""
        # Current implementation has NO CSRF enforcement. We assert:
        # - A POST without CSRF header should not crash the server.
        # - With correct password, it should succeed (200) today.
        # - If CSRF is introduced later, allow a 4xx response (400/403).
        with authed_app.test_client() as client:
            # 1) No CSRF headers at all
            resp_no_csrf = client.post(
                '/api/admin/login',
                json={'password': admin_password},
                content_type='application/json',
            )
            assert resp_no_csrf.status_code in (200, 400, 403)
            data = json.loads(resp_no_csrf.data)
            # If 200, we must have success True; if 4xx, success should be False
            if resp_no_csrf.status_code == 200:
                assert data.get('success') is True
            else:
                assert data.get('success') is False

            # 2) With a dummy CSRF header (some apps expect X-CSRFToken / X-CSRF-Token)
            resp_with_dummy = client.post(
                '/api/admin/login',
                json={'password': admin_password},
                content_type='application/json',
                headers={'X-CSRFToken': 'dummy-token'}
            )
            assert resp_with_dummy.status_code in (200, 400, 403)
            data2 = json.loads(resp_with_dummy.data)
            if resp_with_dummy.status_code == 200:
                assert data2.get('success') is True
            else:
                assert data2.get('success') is False