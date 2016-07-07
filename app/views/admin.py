''' admin screen views blueprint '''
# app/views/admin.py

import sys
from flask import Blueprint, render_template, flash, redirect, session, url_for, request, jsonify
from flask.ext.login import login_required, current_user
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError
import json

from .. import db, login_required
from ..model import User, District, School, Role, Activity_Type, Activity_Log, Expense_Sheet
from ..schemas import UserSchema, RoleSchema, DistrictSchema, SchoolSchema, Activity_TypeSchema, Activity_LogSchema, Expense_SheetSchema
from ..forms.admin import RegisterUserForm, RegisterDistrictForm, RegisterSchoolForm
from ..util.security import ts
from ..util.email import send_email

admin_bp = Blueprint('admin_bp', __name__)

def confirm_email(user):
	try:
		# Now we'll send the email confirmation link
		subject = "Please confirm your email"

		token = ts.dumps(user.email, salt='email-confirm-key')

		confirm_url = url_for(
			'email_bp.user_confirm_email',
			token=token,
			_external=True
		)
		html = render_template(
			'email/activate.html',
			confirm_url=confirm_url
		)

		send_email(user.email, subject, html)

		return True
	except:
		return False

# view for the create user page
@admin_bp.route('/admin/create-user', methods=["GET", "POST"])
# @login_required(role='Administrator')
def register_account():
	form = RegisterUserForm()
	if form.validate_on_submit():
		user = User(
			username=form.username.data,
			first_name=form.first_name.data,
			last_name=form.last_name.data,
			email=form.email.data,
			password=form.password.data,
			salary=form.salary.data,
			urole=form.urole.data
		)
		saveMultiSelectField(user, form.user_districts.data, 'District', 'districts')
		saveMultiSelectField(user, form.user_schools.data, 'School', 'schools')
		db.session.add(user)
		db.session.commit()

		# # Now we'll send the email confirmation link
		# subject = "Please confirm your email"

		# token = ts.dumps(user.email, salt='email-confirm-key')

		# confirm_url = url_for(
		# 	'email_bp.user_confirm_email',
		# 	token=token,
		# 	_external=True
		# )

		# html = render_template(
		# 	'email/activate.html',
		# 	confirm_url=confirm_url
		# )

		# send_email(user.email, subject, html)
		# flash('New user has been created. A confirmation email has been sent to the user\'s email address')
		confirm_email(user)

		return redirect('/#/posts?post_type=User')

	return render_template('accounts/user-register.html', form=form)


# view for the create district page
@admin_bp.route('/admin/create-district', methods=["GET", "POST"])
@login_required(role='Administrator')
def create_district():
	form = RegisterDistrictForm()
	if form.validate_on_submit():
		district = District(
			name=form.district_name.data,
			# schools=form.district_schools.data
		)
		district.set_rel_vals(json.loads(form.district_schools.data), 'School', 'schools')
		db.session.add(district)
		db.session.commit()

		flash('New district has been created.')

		return redirect('/#/posts?post_type=District')

	return render_template('locations/district-register.html', form=form)

# view for the application settings page (admins only)
@admin_bp.route('/admin/settings', methods=["GET", "POST"])
@login_required(role='Administrator')
def admin_page():
	return render_template('app-settings.html')


# view for the create school page
@admin_bp.route('/admin/create-school', methods=["GET", "POST"])
@login_required(role='Administrator')
def create_school():
	form = RegisterSchoolForm()
	if form.validate_on_submit():
		school = School(
			name=form.school_name.data
		)
		db.session.add(school)
		db.session.commit()

		flash('New school has been created.')

		return redirect('/#/posts?post_type=School')

	return render_template('locations/school-register.html', form=form)


# API ROUTES
@admin_bp.route('/api/get_cur_user', methods=['GET'])
def get_cur_user():
	user_schema = getattr(sys.modules[__name__], "UserSchema")
	current_user_data = user_schema().dump(current_user)

	return jsonify({'current_user': current_user_data})

def retrieve_posts(post_type, post_id=None, post_filter=None, schema=False, many=False):
	classy_pt = getattr(sys.modules[__name__], post_type)

	if post_id:
		posts = classy_pt.query.filter_by(id=post_id).first()
	else:
		if post_filter:
			post_filter = eval(post_filter)

			posts = classy_pt.query.filter(post_filter).all()
		else:
			posts = classy_pt.query.all()

	if schema:
		class_schema = getattr(sys.modules[__name__], post_type + "Schema")
		posts = class_schema(many=many).dump(posts)

	return posts


@admin_bp.route('/api/get_posts', methods=['GET', 'POST'])
def get_posts():
	data = json.loads(request.data.decode())
	post_type = data["post_type"]
	post_filter = None
	if 'post_filter' in data:
		post_filter = data["post_filter"]

	result = retrieve_posts(post_type, None, post_filter, True, True)

	return jsonify({'posts': result.data})

@admin_bp.route('/api/get_post', methods=['GET', 'POST'])
def get_post():
	data = json.loads(request.data.decode())
	post_type = data["post_type"]
	post_id = data["id"]

	result = retrieve_posts(post_type, post_id, None, True)

	return jsonify({'post': result.data})

# @admin_bp.route('/api/get_post_id', methods=['GET', 'POST'])
# def get_post_id():
# 	data = json.loads(request.data.decode())
# 	post_type = data["post_type"]
# 	post_name = data["post_name"]
# 	classy_pt = getattr(sys.modules[__name__], post_type)

# 	post = classy_pt.query.filter_by(username=post_name).first()

# 	return jsonify({'post_id': post.id})

@admin_bp.route('/api/delete_post', methods=['POST'])
def delete_post():
	data = json.loads(request.data.decode())
	post_type = data["post_type"]
	post_id = data["post_id"]

	deleted_post = retrieve_posts(post_type, post_id)

	db.session.delete(deleted_post)
	db.session.commit()

	flash(post_type + ' deleted.')
	return '/#/posts?post_type=' + post_type

@admin_bp.route('/api/save_post_field', methods=['POST'])
def save_post_field():
	data = json.loads(request.data.decode())
	post_type = data["post_type"]
	post_id = data["post_id"]
	field_key = data["field_key"]
	field_val = data["field_value"]
	relationship = data["relationship"]

	classy_pt = getattr(sys.modules[__name__], post_type)
	post = classy_pt.query.filter_by(id=post_id).first()

	try:
		if isinstance(field_key, list):
			for key in field_key:
				setattr(post, key, field_val[key])
		else:
			if relationship:
				if field_key.endswith('s'):
					rel_type = field_key.capitalize()[:-1]
					post.set_rel_vals(field_val, rel_type, field_key)
				else:
					rel_type = field_key.capitalize()
					post.set_rel_val(field_val, rel_type, field_key)

			else:
				if isinstance(field_val, dict):
					json_data = json.dumps(field_val)
					field_val = json_data

				setattr(post, field_key, field_val)

		db.session.commit()
	except IntegrityError:
		db.session.rollback()
		if field_key == 'email':
			raise ExceptionHandler('There is already another user with the email address: ' + field_val)

	class_schema = getattr(sys.modules[__name__], post_type + "Schema")
	post = class_schema().dump(post)
	return jsonify({'post': post, 'field_value': field_val, 'field_key': field_key, 'success': 'Field saved!'})

# route for getting all access roles in system
@admin_bp.route('/api/get_access_roles', methods=["GET"])
def get_access_roles():
	roles = []
	db_roles = Role.query.all()
	for role in db_roles:
		roles.append(role.name)

	return jsonify({'roles': roles})

def multiple_post_save(post_type, posts_data):
	classy_pt = getattr(sys.modules[__name__], post_type)
	for post in posts_data:
		if not classy_pt.query.filter_by(name=post).first():
			new_post = classy_pt(
				name=post,
				description=''
				)
			db.session.add(new_post)
			db.session.commit()

def multiple_post_delete(post_type, posts_data):
	classy_pt = getattr(sys.modules[__name__], post_type)
	db_posts = classy_pt.query.all()
	for db_post in db_posts:
		if db_post.name not in posts_data:
			db.session.delete(db_post)
			db.session.commit()

# route for saving the application settings
@admin_bp.route('/api/save_app_settings', methods=["POST"])
def save_app_settings():
	data = json.loads(request.data.decode())
	roles = data["roles"]
	activity_types = data["activity_types"]

	## ROLE MANAGEMENT
	multiple_post_save("Role", roles)
	multiple_post_delete("Role", roles)

	## ACTIVITY TYPE MANAGEMENT
	multiple_post_save("Activity_Type", activity_types)
	multiple_post_delete("Activity_Type", activity_types)

	flash('Application settings saved.')
	return '/admin/settings'

# error handlers
class ExceptionHandler(Exception):
	pass

@admin_bp.errorhandler(ExceptionHandler)
def handle_exception(e):
	response = jsonify({'error': e.message})
	response.status_code = 500
	return response
