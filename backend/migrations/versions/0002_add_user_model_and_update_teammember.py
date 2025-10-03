"""Add User model and update TeamMember with user relationships and audit fields

Revision ID: 0002
Revises: 0001
Create Date: 2025-10-02 17:11:54.261205

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade():
    # Detect database type and check existing objects
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    dialect_name = bind.dialect.name

    # Create users table if it doesn't exist
    if 'users' not in inspector.get_table_names():
        op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=80), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
        )

        # Create indexes on users table
        op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
        op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # Get existing columns in team_members
    team_members_columns = [col['name'] for col in inspector.get_columns('team_members')]

    # Add columns to team_members table if they don't exist
    if 'user_id' not in team_members_columns:
        op.add_column('team_members', sa.Column('user_id', sa.Integer(), nullable=True))

    if 'created_by' not in team_members_columns:
        op.add_column('team_members', sa.Column('created_by', sa.Integer(), nullable=True))

    if 'updated_by' not in team_members_columns:
        op.add_column('team_members', sa.Column('updated_by', sa.Integer(), nullable=True))

    # Check existing indexes
    team_members_indexes = [idx['name'] for idx in inspector.get_indexes('team_members')]

    # Create index on team_members if it doesn't exist
    if 'ix_team_members_user_id' not in team_members_indexes:
        op.create_index(op.f('ix_team_members_user_id'), 'team_members', ['user_id'], unique=False)

    # Create foreign keys (skip for SQLite as it doesn't support adding FK to existing tables)
    if dialect_name != 'sqlite':
        # Get existing foreign keys
        team_members_fks = [fk['name'] for fk in inspector.get_foreign_keys('team_members')]

        if 'fk_team_members_user_id' not in team_members_fks:
            op.create_foreign_key('fk_team_members_user_id', 'team_members', 'users', ['user_id'], ['id'])

        if 'fk_team_members_created_by' not in team_members_fks:
            op.create_foreign_key('fk_team_members_created_by', 'team_members', 'users', ['created_by'], ['id'])

        if 'fk_team_members_updated_by' not in team_members_fks:
            op.create_foreign_key('fk_team_members_updated_by', 'team_members', 'users', ['updated_by'], ['id'])


def downgrade():
    # Detect database type
    bind = op.get_bind()
    dialect_name = bind.dialect.name

    # Drop foreign keys (skip for SQLite)
    if dialect_name != 'sqlite':
        op.drop_constraint('fk_team_members_updated_by', 'team_members', type_='foreignkey')
        op.drop_constraint('fk_team_members_created_by', 'team_members', type_='foreignkey')
        op.drop_constraint('fk_team_members_user_id', 'team_members', type_='foreignkey')

    # Drop index
    op.drop_index(op.f('ix_team_members_user_id'), table_name='team_members')

    # Drop columns
    op.drop_column('team_members', 'updated_by')
    op.drop_column('team_members', 'created_by')
    op.drop_column('team_members', 'user_id')

    # Drop indexes on users table
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')

    # Drop users table
    op.drop_table('users')
