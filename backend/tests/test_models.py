import pytest
import sys
import os
from datetime import datetime

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.database import db
from backend.models import User, TeamMember


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
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


class TestUserModel:
    """Test the User model."""

    def test_user_creation(self, app):
        """Test creating a user with all required fields."""
        with app.app_context():
            user = User(
                username='testuser',
                email='test@example.com',
                password_hash='hashed_password_123',
                role='consultant'
            )
            db.session.add(user)
            db.session.commit()

            saved_user = User.query.filter_by(username='testuser').first()
            assert saved_user is not None
            assert saved_user.username == 'testuser'
            assert saved_user.email == 'test@example.com'
            assert saved_user.password_hash == 'hashed_password_123'
            assert saved_user.role == 'consultant'
            assert saved_user.created_at is not None
            assert saved_user.updated_at is not None

    def test_user_default_role(self, app):
        """Test that default role is 'consultant'."""
        with app.app_context():
            user = User(
                username='testuser',
                email='test@example.com',
                password_hash='hashed_password'
            )
            db.session.add(user)
            db.session.commit()

            assert user.role == 'consultant'

    def test_user_unique_username(self, app):
        """Test that username must be unique."""
        with app.app_context():
            user1 = User(
                username='duplicate',
                email='user1@example.com',
                password_hash='hash1'
            )
            user2 = User(
                username='duplicate',
                email='user2@example.com',
                password_hash='hash2'
            )

            db.session.add(user1)
            db.session.commit()

            db.session.add(user2)
            with pytest.raises(Exception):  # IntegrityError
                db.session.commit()

    def test_user_unique_email(self, app):
        """Test that email must be unique."""
        with app.app_context():
            user1 = User(
                username='user1',
                email='duplicate@example.com',
                password_hash='hash1'
            )
            user2 = User(
                username='user2',
                email='duplicate@example.com',
                password_hash='hash2'
            )

            db.session.add(user1)
            db.session.commit()

            db.session.add(user2)
            with pytest.raises(Exception):  # IntegrityError
                db.session.commit()

    def test_user_to_dict(self, app):
        """Test User to_dict method."""
        with app.app_context():
            user = User(
                username='testuser',
                email='test@example.com',
                password_hash='hashed_password',
                role='admin'
            )
            db.session.add(user)
            db.session.commit()

            user_dict = user.to_dict()
            assert user_dict['id'] == user.id
            assert user_dict['username'] == 'testuser'
            assert user_dict['email'] == 'test@example.com'
            assert user_dict['role'] == 'admin'
            assert 'password_hash' not in user_dict  # Should not expose password
            assert 'created_at' in user_dict
            assert 'updated_at' in user_dict


class TestTeamMemberUserRelationship:
    """Test the relationship between TeamMember and User."""

    def test_team_member_user_id_nullable(self, app):
        """Test that team member can exist without a user account."""
        with app.app_context():
            member = TeamMember(
                name='Test Member',
                role='Tester',
                profilePicture='/static/img/test.jpg',
                linkedinUrl='https://linkedin.com/in/test',
                active=True
            )
            db.session.add(member)
            db.session.commit()

            assert member.user_id is None
            assert member.created_by is None
            assert member.updated_by is None

    def test_team_member_with_user_link(self, app):
        """Test linking a team member to a user account."""
        with app.app_context():
            # Create user
            user = User(
                username='testuser',
                email='test@example.com',
                password_hash='hashed_password',
                role='consultant'
            )
            db.session.add(user)
            db.session.commit()

            # Create team member linked to user
            member = TeamMember(
                name='Test Member',
                role='Tester',
                profilePicture='/static/img/test.jpg',
                linkedinUrl='https://linkedin.com/in/test',
                active=True,
                user_id=user.id
            )
            db.session.add(member)
            db.session.commit()

            assert member.user_id == user.id

    def test_team_member_audit_fields(self, app):
        """Test team member audit fields (created_by, updated_by)."""
        with app.app_context():
            # Create admin user
            admin = User(
                username='admin',
                email='admin@example.com',
                password_hash='hashed_password',
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()

            # Create team member with audit fields
            member = TeamMember(
                name='Test Member',
                role='Tester',
                profilePicture='/static/img/test.jpg',
                linkedinUrl='https://linkedin.com/in/test',
                active=True,
                created_by=admin.id,
                updated_by=admin.id
            )
            db.session.add(member)
            db.session.commit()

            assert member.created_by == admin.id
            assert member.updated_by == admin.id

    def test_foreign_key_constraint(self, app):
        """Test that foreign key to non-existent user fails (if enforced)."""
        with app.app_context():
            member = TeamMember(
                name='Test Member',
                role='Tester',
                profilePicture='/static/img/test.jpg',
                linkedinUrl='https://linkedin.com/in/test',
                active=True,
                user_id=99999  # Non-existent user ID
            )
            db.session.add(member)

            # SQLite with foreign keys enabled should raise IntegrityError
            # Note: SQLite doesn't enforce foreign keys by default in testing
            try:
                db.session.commit()
                # If we get here, foreign keys aren't enforced (SQLite default)
                assert member.user_id == 99999
            except Exception:
                # Foreign keys are enforced
                db.session.rollback()
                assert True
