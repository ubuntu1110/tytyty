"""add BroadcastError and update BroadcastHistory

Revision ID: 68b5251602db
Revises: b024326bbbb3
Create Date: 2024-12-11 15:23:25.771165

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '68b5251602db'
down_revision: Union[str, None] = 'b024326bbbb3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
