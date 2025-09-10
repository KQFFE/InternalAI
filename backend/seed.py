# backend/seed.py
import os
import json
import logging
from backend.app import create_app
from backend.database import db
from backend.models import TeamMember

logger = logging.getLogger(__name__)

def seed_database():
    """
    Seeds the database with initial data from team.json.
    This function is designed to be idempotent, meaning it can be run
    multiple times without creating duplicate entries.
    """
    # Create an app context to access the database
    app = create_app()
    with app.app_context():
        # Construct the path to the JSON file
        # This assumes the script is run from the project root
        json_path = os.path.join(os.path.dirname(__file__), 'data', 'team.json')

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                team_data = json.load(f)
        except FileNotFoundError:
            logger.error(f"Seeding failed: {json_path} not found.")
            return
        except json.JSONDecodeError:
            logger.error(f"Seeding failed: Could not decode {json_path}.")
            return

        for member_data in team_data:
            # Check if a member with the same name already exists
            existing_member = TeamMember.query.filter_by(name=member_data['name']).first()
            if not existing_member:
                new_member = TeamMember(**member_data)
                db.session.add(new_member)
                logger.info(f"Adding new member: {member_data['name']}")

        db.session.commit()
        logger.info("Database seeding complete.")