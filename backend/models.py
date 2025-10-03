# backend/models.py
from backend.database import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='consultant')  # admin, ceo, manager, consultant
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class TeamMember(db.Model):
    __tablename__ = 'team_members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(db.String(100), nullable=False)
    profilePicture = db.Column(db.String(255), nullable=False, default='/static/img/fallback-knowit.png')
    linkedinUrl = db.Column(db.String(255), nullable=True)
    active = db.Column(db.Boolean, nullable=False, default=True)

    # Link to User account (nullable - not all team members have user accounts yet)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)

    # Audit fields
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'profilePicture': self.profilePicture,
            'linkedinUrl': self.linkedinUrl,
            'active': self.active,
            'user_id': self.user_id,
            'created_by': self.created_by,
            'updated_by': self.updated_by
        }