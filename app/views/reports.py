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
			log_date_start=al_form.log_date_start.data,
			log_date_end=al_form.log_date_end.data,
			activity_contact=al_form.activity_contact.data,
			event_costs=al_form.event_costs.data,
			report_notes=al_form.report_notes.data,
		)

		saveSelectField(activity_log, al_form.consultant.data, 'User', 'user')
		saveMultiSelectField(activity_log, al_form.log_districts.data, 'District', 'districts')
		saveMultiSelectField(activity_log, al_form.log_schools.data, 'School', 'schools')
		saveMultiSelectField(activity_log, al_form.activity_types.data, 'Activity_Type', 'activity_types')
		db.session.add(activity_log)
		db.session.commit()

		flash('New activity log has been created!')

		cur_log = Activity_Log.query.order_by('-id').first()
		expense_sheet = Expense_Sheet(
			activity_log=cur_log,
			to_mileage=es_form.to_mileage.data,
			from_mileage=es_form.from_mileage.data,
			mileage_reimbursement=es_form.mileage_reimbursement.data,
			itemized_meals=es_form.itemized_meals.data,
			hotel_reimbursement=es_form.hotel_reimbursement.data,
			cell_phone_reimbursement=es_form.cell_phone_reimbursement.data,
			other_reimbursement=es_form.other_reimbursement.data,
		)
		saveSelectField(expense_sheet, al_form.consultant.data, 'User', 'user')
		saveMultiSelectField(expense_sheet, al_form.log_districts.data, 'District', 'districts')
		saveMultiSelectField(expense_sheet, al_form.log_schools.data, 'School', 'schools')
		saveMultiSelectField(expense_sheet, al_form.activity_types.data, 'Activity_Type', 'activity_types')
		db.session.add(expense_sheet)
		db.session.commit()

		flash('New expense sheet has been created!')
		return redirect('/#/posts?post_type=Activity_Log')

	if al_form.errors or es_form.errors:
		flash('There were some errors. See below.')

	return render_template('reports/create-activity-log.html', activity_log_form=al_form, expense_sheet_form=es_form)

@reports_bp.route('/admin/create-expense-sheet', methods=["GET"])
# @login_required(role='Administrator')
def create_expense_sheet():
	return redirect(url_for('reports_bp.create_activity_log'))

# API calls
# @reports_bp.route('/api/save_activity_log', methods=['GET', 'POST'])
# def save_activity_log():
# 	al_form = ActivityLogForm()
# 	es_form = ExpenseSheetForm()
# 	if al_form.validate_on_submit() and es_form.validate_on_submit():
# 		activity_log = Activity_Log(
# 			name=al_form.name.data,
# 			log_date_start=al_form.log_date_start.data,
# 			log_date_end=al_form.log_date_end.data,
# 			# consultant=form.consultant.data,
# 			# log_schools=form.log_schools.data,
# 			# log_districts=form.log_districts.data,
# 			# activity_types=form.activity_types.data,
# 			# activity_contact=form.activity_contact.data,
# 			# event_costs=form.event_costs.data,
# 			# report_notes=form.report_notes.data
# 		)
# 		db.session.add(activity_log)
# 		db.session.commit()

# 		flash('New activity log has been created!')

# 		expense_sheet = Activity_Log(
# 			to_mileage=es_form.to_mileage.data,
# 			from_mileage=es_form.from_mileage.data,
# 		)
# 		db.session.add(expense_sheet)
# 		db.session.commit()

# 		flash('New expense sheet has been created!')
# 		return "expense sheet saved!"

# 	return render_template('reports/create-activity-log.html', activity_log_form=al_form, expense_sheet_form=es_form)
# 	return "something went wrong..."



# @reports_bp.route('/api/save_activity_log', methods=['GET', 'POST'])
# def save_activity_log():
# 	form = ActivityLogForm()
# 	if form.validate_on_submit():
# 		activity_log = Activity_Log(
# 			name=form.name.data,
# 			log_date_start=form.log_date_start.data,
# 			log_date_end=form.log_date_end.data,
# 			# consultant=form.consultant.data,
# 			# log_schools=form.log_schools.data,
# 			# log_districts=form.log_districts.data,
# 			# activity_types=form.activity_types.data,
# 			# activity_contact=form.activity_contact.data,
# 			# event_costs=form.event_costs.data,
# 			# report_notes=form.report_notes.data
# 		)
# 		db.session.add(activity_log)
# 		db.session.commit()

# 		flash('New activity log has been created!')
# 		return "activity log saved!"

# 	return "something went wrong..."
# 	# 	# return redirect('/#/posts?post_type=Activity_Log')
# 	# 	return '/#/posts?post_type=Activity_Log'

# @reports_bp.route('/api/save_expense_sheet', methods=['GET', 'POST'])
# def save_expense_sheet():
# 	form = ExpenseSheetForm()
# 	if form.validate_on_submit():
# 		expense_sheet = Activity_Log(
# 			to_mileage=form.to_mileage.data,
# 			from_mileage=form.from_mileage.data,
# 		)
# 		db.session.add(expense_sheet)
# 		db.session.commit()

# 		flash('New expense sheet has been created!')
# 		return "expense sheet saved!"

# 	return "something went wrong..."
# 	# 	# return redirect('/#/posts?post_type=Activity_Log')


