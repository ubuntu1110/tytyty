"""add BroadcastError table

Revision ID: b024326bbbb3
Revises: d5d04e3e6a6a
Create Date: 2024-12-11 15:01:47.998247

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b024326bbbb3'
down_revision: Union[str, None] = 'd5d04e3e6a6a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('broadcast_errors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('broadcast_id', sa.Integer(), nullable=True),
    sa.Column('chat_id', sa.String(), nullable=True),
    sa.Column('error_type', sa.String(), nullable=True),
    sa.Column('error_message', sa.Text(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['broadcast_id'], ['broadcast_history.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_broadcast_errors_id'), 'broadcast_errors', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_broadcast_errors_id'), table_name='broadcast_errors')
    op.drop_table('broadcast_errors')
    # ### end Alembic commands ###