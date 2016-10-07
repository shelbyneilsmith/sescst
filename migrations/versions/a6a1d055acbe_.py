"""empty message

Revision ID: a6a1d055acbe
Revises: 470c51636b02
Create Date: 2016-09-23 13:23:36.774678

"""

# revision identifiers, used by Alembic.
revision = 'a6a1d055acbe'
down_revision = '470c51636b02'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activity_scope',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('activity_topics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('delivery_method',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('school_designation',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('work_day',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('activity_topic_identifier_al',
    sa.Column('activity_topic_id', sa.Integer(), nullable=True),
    sa.Column('activity_log_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['activity_log_id'], ['activity_logs.id'], ),
    sa.ForeignKeyConstraint(['activity_topic_id'], ['activity_topics.id'], )
    )
    op.create_table('activity_topic_identifier_es',
    sa.Column('activity_topic_id', sa.Integer(), nullable=True),
    sa.Column('expense_sheet_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['activity_topic_id'], ['activity_topics.id'], ),
    sa.ForeignKeyConstraint(['expense_sheet_id'], ['expense_sheets.id'], )
    )
    op.add_column(u'activity_logs', sa.Column('activity_hours', sa.Integer(), nullable=True))
    op.add_column(u'activity_logs', sa.Column('activity_scope_id', sa.Integer(), nullable=True))
    op.add_column(u'activity_logs', sa.Column('delivery_method_id', sa.Integer(), nullable=True))
    op.add_column(u'activity_logs', sa.Column('location', sa.String(length=255), nullable=True))
    op.add_column(u'activity_logs', sa.Column('num_hours_planning', sa.Integer(), nullable=True))
    op.add_column(u'activity_logs', sa.Column('planner_name', sa.String(length=255), nullable=True))
    op.add_column(u'activity_logs', sa.Column('school_designation_id', sa.Integer(), nullable=True))
    op.add_column(u'activity_logs', sa.Column('total_num_participants', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'activity_logs', 'delivery_method', ['delivery_method_id'], ['id'])
    op.create_foreign_key(None, 'activity_logs', 'school_designation', ['school_designation_id'], ['id'])
    op.create_foreign_key(None, 'activity_logs', 'activity_scope', ['activity_scope_id'], ['id'])
    op.add_column(u'expense_sheets', sa.Column('activity_scope_id', sa.Integer(), nullable=True))
    op.add_column(u'expense_sheets', sa.Column('delivery_method_id', sa.Integer(), nullable=True))
    op.add_column(u'expense_sheets', sa.Column('school_designation_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'expense_sheets', 'school_designation', ['school_designation_id'], ['id'])
    op.create_foreign_key(None, 'expense_sheets', 'delivery_method', ['delivery_method_id'], ['id'])
    op.create_foreign_key(None, 'expense_sheets', 'activity_scope', ['activity_scope_id'], ['id'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'expense_sheets', type_='foreignkey')
    op.drop_constraint(None, 'expense_sheets', type_='foreignkey')
    op.drop_constraint(None, 'expense_sheets', type_='foreignkey')
    op.drop_column(u'expense_sheets', 'school_designation_id')
    op.drop_column(u'expense_sheets', 'delivery_method_id')
    op.drop_column(u'expense_sheets', 'activity_scope_id')
    op.drop_constraint(None, 'activity_logs', type_='foreignkey')
    op.drop_constraint(None, 'activity_logs', type_='foreignkey')
    op.drop_constraint(None, 'activity_logs', type_='foreignkey')
    op.drop_column(u'activity_logs', 'total_num_participants')
    op.drop_column(u'activity_logs', 'school_designation_id')
    op.drop_column(u'activity_logs', 'planner_name')
    op.drop_column(u'activity_logs', 'num_hours_planning')
    op.drop_column(u'activity_logs', 'location')
    op.drop_column(u'activity_logs', 'delivery_method_id')
    op.drop_column(u'activity_logs', 'activity_scope_id')
    op.drop_column(u'activity_logs', 'activity_hours')
    op.drop_table('activity_topic_identifier_es')
    op.drop_table('activity_topic_identifier_al')
    op.drop_table('work_day')
    op.drop_table('school_designation')
    op.drop_table('delivery_method')
    op.drop_table('activity_topics')
    op.drop_table('activity_scope')
    ### end Alembic commands ###
