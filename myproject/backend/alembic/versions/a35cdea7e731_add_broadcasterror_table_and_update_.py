"""add BroadcastError table and update BroadcastHistory

Revision ID: a35cdea7e731
Revises: 68b5251602db
Create Date: 2024-12-11 15:30:04.182843

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a35cdea7e731'
down_revision: Union[str, None] = '68b5251602db'
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
