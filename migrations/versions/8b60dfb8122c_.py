"""empty message

Revision ID: 8b60dfb8122c
Revises: f4e03e1429e3
Create Date: 2016-09-28 15:49:31.052394

"""

# revision identifiers, used by Alembic.
revision = '8b60dfb8122c'
down_revision = 'f4e03e1429e3'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('activity_logs', sa.Column('work_day_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'activity_logs', 'work_day', ['work_day_id'], ['id'])
    op.add_column('expense_sheets', sa.Column('work_day_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'expense_sheets', 'work_day', ['work_day_id'], ['id'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'expense_sheets', type_='foreignkey')
    op.drop_column('expense_sheets', 'work_day_id')
    op.drop_constraint(None, 'activity_logs', type_='foreignkey')
    op.drop_column('activity_logs', 'work_day_id')
    ### end Alembic commands ###
