
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
def admin_session(client, app):
    """An authenticated admin session."""
    client.post('/api/admin/login', json={'password': 'test_password'})
    return client

class TestIntegration:
    """End-to-end and security integration tests"""

    def test_full_workflow(self, admin_session, app):
        """Test the full CRUD workflow: create, update, toggle, and delete."""
        # 1. Add a new team member
        add_response = admin_session.post('/api/admin/team/add', data={
            'name': 'Integration Test User',
            'role': 'Tester',
            'linkedinUrl': 'https://linkedin.com/in/integration-test',
            'active': 'true'
        })
        assert add_response.status_code == 201
        add_data = add_response.get_json()
        assert add_data['success'] is True
        member_id = add_data['member']['id']

        # 2. Verify the member was added
        with app.app_context():
            member = db.session.get(TeamMember, member_id)
            assert member is not None
            assert member.name == 'Integration Test User'

        # 3. Update the member's details
        update_response = admin_session.post(f'/api/admin/team/{member_id}/update', data={
            'name': 'Integration Test User Updated',
            'role': 'Senior Tester',
            'linkedinUrl': 'https://linkedin.com/in/integration-test-updated',
            'active': 'true'
        })
        assert update_response.status_code == 200
        update_data = update_response.get_json()
        assert update_data['success'] is True
        assert update_data['member']['name'] == 'Integration Test User Updated'

        # 4. Verify the member was updated
        with app.app_context():
            member = db.session.get(TeamMember, member_id)
            assert member.name == 'Integration Test User Updated'
            assert member.role == 'Senior Tester'

        # 5. Toggle the member's status to inactive
        toggle_off_response = admin_session.post(f'/api/admin/team/{member_id}/toggle')
        assert toggle_off_response.status_code == 200
        toggle_off_data = toggle_off_response.get_json()
        assert toggle_off_data['member']['active'] is False

        # 6. Verify the status was updated
        with app.app_context():
            member = db.session.get(TeamMember, member_id)
            assert member.active is False

        # 7. Toggle the member's status back to active
        toggle_on_response = admin_session.post(f'/api/admin/team/{member_id}/toggle')
        assert toggle_on_response.status_code == 200
        toggle_on_data = toggle_on_response.get_json()
        assert toggle_on_data['member']['active'] is True

        # 8. Verify the status was updated
        with app.app_context():
            member = db.session.get(TeamMember, member_id)
            assert member.active is True

        # 9. Delete the member
        delete_response = admin_session.delete(f'/api/admin/team/{member_id}')
        assert delete_response.status_code == 200

        # 10. Verify the member was deleted
        with app.app_context():
            member = db.session.get(TeamMember, member_id)
            assert member is None

    def test_add_team_member_sql_injection(self, admin_session, app):
        """Test for basic SQL injection protection."""
        # This is a basic test. A robust solution would use a dedicated security scanner.
        sql_injection_payload = "' OR 1=1; --"
        response = admin_session.post('/api/admin/team/add', data={
            'name': sql_injection_payload,
            'role': 'Hacker',
            'linkedinUrl': 'https://linkedin.com/in/hacker',
            'active': 'true'
        })
        
        assert response.status_code == 201 # The ORM should handle parameterization
        with app.app_context():
            # Verify that the payload was stored as a literal string, not executed
            member = TeamMember.query.filter_by(name=sql_injection_payload).first()
            assert member is not None
            assert member.name == sql_injection_payload

    def test_add_team_member_xss(self, admin_session, app):
        """Test for basic XSS protection."""
        # This is a basic test. A robust solution would use a dedicated security scanner 
        # and context-aware output encoding.
        xss_payload = '<script>alert("XSS")</script>'
        response = admin_session.post('/api/admin/team/add', data={
            'name': xss_payload,
            'role': 'Hacker',
            'linkedinUrl': 'https://linkedin.com/in/hacker',
            'active': 'true'
        })
        
        assert response.status_code == 201
        with app.app_context():
            # Verify that the payload was stored as a literal string
            member = TeamMember.query.filter_by(name=xss_payload).first()
            assert member is not None
            assert member.name == xss_payload

        # The real test is whether this is escaped on output, which should be handled by the frontend framework.
        # This test primarily ensures it's stored correctly.
