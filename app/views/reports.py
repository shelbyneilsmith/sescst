''' report editing screen views blueprint '''
# app/views/reports.py

import sys
from flask import Blueprint, render_template, flash, redirect, session, url_for, request, jsonify
from flask.ext.login import login_required, current_user
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError
import json

from .. import db, login_required
from ..model import User, District, School, Role, Activity_Log, Expense_Sheet
from ..schemas import UserSchema, RoleSchema, DistrictSchema, SchoolSchema, Activity_LogSchema, Expense_SheetSchema
from ..forms.report import ActivityLogForm, ExpenseSheetForm
from ..util.helpers import saveSelectField, saveMultiSelectField

reports_bp = Blueprint('reports_bp', __name__)

# view for the create activity log/expense sheet page
@reports_bp.route('/admin/create-activity-log', methods=["GET", "POST"])
# @login_required(role='Administrator')
def create_activity_log():
	al_form = ActivityLogForm()
	es_form = ExpenseSheetForm()
	if al_form.validate_on_submit() and es_form.validate_on_submit():
		activity_log = Activity_Log(
			name=al_form.name.data,
			user=	current_user,
			activity_date_start=al_form.activity_date_start.data,
			activity_date_end=al_form.activity_date_end.data,
			activity_contact=al_form.activity_contact.data,
			report_notes=al_form.report_notes.data,
		)

		# saveSelectField(activity_log, al_form.consultant.data, 'User', 'user')
		saveMultiSelectField(activity_log, al_form.log_districts.data, 'District', 'districts')
		saveMultiSelectField(activity_log, al_form.log_schools.data, 'School', 'schools')
		saveMultiSelectField(activity_log, al_form.activity_types.data, 'Activity_Type', 'activity_types')
		db.session.add(activity_log)
		db.session.commit()

		flash('New Activity Log has been created!')

		cur_log = Activity_Log.query.order_by('-id').first()
		expense_sheet = Expense_Sheet(
			activity_log=cur_log,
			expense_sheet_start=al_form.activity_date_start.data,
			expense_sheet_end=al_form.activity_date_end.data,
			user=	current_user,
			total_mileage=es_form.total_mileage.data,
			travel_route_from=es_form.travel_route_from.data,
			travel_route_to=es_form.travel_route_to.data,
			itemized_meals=es_form.itemized_meals.data,
			hotel_reimbursement=es_form.hotel_reimbursement.data,
			other_reimbursement=es_form.other_reimbursement.data,
		)
		# saveSelectField(expense_sheet, al_form.consultant.data, 'User', 'user')
		saveMultiSelectField(expense_sheet, al_form.log_districts.data, 'District', 'districts')
		saveMultiSelectField(expense_sheet, al_form.log_schools.data, 'School', 'schools')
		saveMultiSelectField(expense_sheet, al_form.activity_types.data, 'Activity_Type', 'activity_types')
		db.session.add(expense_sheet)
		db.session.commit()

		flash('New Expense Sheet has been created!')
		return redirect('/#/posts?post_type=Activity_Log')

	if al_form.errors or es_form.errors:
		flash('There were some errors. See below.')

	return render_template('reports/create-activity-log.html', activity_log_form=al_form, expense_sheet_form=es_form)

@reports_bp.route('/admin/create-expense-sheet', methods=["GET"])
# @login_required(role='Administrator')
def create_expense_sheet():
	return redirect(url_for('reports_bp.create_activity_log'))
