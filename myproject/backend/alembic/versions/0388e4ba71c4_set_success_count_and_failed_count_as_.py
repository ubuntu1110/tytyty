"""Set success_count and failed_count as non-nullable

Revision ID: 0388e4ba71c4
Revises: a35cdea7e731
Create Date: 2024-12-11 15:36:11.120313

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0388e4ba71c4'
down_revision: Union[str, None] = 'a35cdea7e731'
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
