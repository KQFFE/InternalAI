# backend/models.py
from backend.database import db

class TeamMember(db.Model):
    __tablename__ = 'team_members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(db.String(100), nullable=False)
    profilePicture = db.Column(db.String(255), nullable=False, default='/img/fallback-knowit.png')
    linkedinUrl = db.Column(db.String(255), nullable=True)
    active = db.Column(db.Boolean, nullable=False, default=True)

    def to_dict(self):
        """Convert model instance to a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'profilePicture': self.profilePicture,
            'linkedinUrl': self.linkedinUrl,
            'active': self.active
        }