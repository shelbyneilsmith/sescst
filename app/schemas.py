from . import ma
from marshmallow import fields, validate
from .model import Role, User, District, School

class RoleSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	description = fields.Str()
	users = fields.Nested('UserSchema', many=True, only=('id'), dump_only=True)

class UserSchema(ma.ModelSchema):
	# class Meta:
	# 	model = User
	id = fields.Int(dump_only=True)
	name = fields.Str(attribute="username")
	username = fields.Str(attribute="username")
	email = fields.Str(required=True, validate=validate.Email(error='Not a valid email address'))
	first_name = fields.Str()
	last_name = fields.Str()
	password = fields.Str(attribute="_password", required=True)
	salary = fields.Int()
	districts = fields.Nested('DistrictSchema', many=True, exclude=('schools'), dump_only=True)
	schools = fields.Nested('SchoolSchema', many=True, exclude=('district_id'), dump_only=True)
	activity_logs = fields.Nested('Activity_LogSchema', many=True, exclude=('consultant'), dump_only=True)
	expense_sheets = fields.Nested('Expense_SheetSchema', many=True, exclude=('user_id'), dump_only=True)
	report_urls = fields.Nested('Report_URLSchema', many=True, exclude=('user_id'), dump_only=True)
	active = fields.Boolean(attribute='is_active', missing=False)
	urole = fields.Str(dump_only=True)

class DistrictSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	schools = fields.Nested('SchoolSchema', many=True, exclude=('district_id'), dump_only=True)
	# users = fields.Nested('UserSchema', many=True, only=('name'), dump_only=True)

class SchoolSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	district = fields.Nested('DistrictSchema', only=('id', 'name'), dump_only=True)

class Activity_TypeSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	description = fields.Str()

class Activity_LogSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	log_date_start = fields.DateTime()
	log_date_end = fields.DateTime()
	user = fields.Nested('UserSchema', only=('id', 'username'), dump_only=True)
	districts = fields.Nested('DistrictSchema', many=True, exclude=('schools'), dump_only=True)
	schools = fields.Nested('SchoolSchema', many=True, exclude=('district_id'), dump_only=True)
	activity_types = fields.Nested('Activity_TypeSchema', many=True, only=('name'), dump_only=True)
	activity_contact = fields.Str()
	event_costs = fields.Str()
	report_notes = fields.Str()
	expense_sheet = fields.Nested('Expense_SheetSchema', only=('id'), dump_only=True)

class Expense_SheetSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	user = fields.Nested('UserSchema', only=('username'), dump_only=True)
	activity_log = fields.Nested('Activity_LogSchema', dump_only=True)
	to_mileage = fields.Int()
	from_mileage = fields.Int()
	mileage_reimbursement = fields.Int()
	itemized_meals = fields.Str()
	hotel_reimbursement = fields.Str()
	cell_phone_reimbursement = fields.Str()
	other_reimbursement = fields.Str()

class Report_URLSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	user_id = fields.Nested('UserSchema', only=('id'), dump_only=True)