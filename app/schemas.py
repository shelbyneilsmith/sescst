from . import ma
from marshmallow import fields, validate
from .model import User, District, School

class UserSchema(ma.ModelSchema):
	# class Meta:
	# 	model = User
	id = fields.Int(dump_only=True)
	name = fields.Str(attribute="username")
	email = fields.Str(required=True, validate=validate.Email(error='Not a valid email address'))
	first_name = fields.Str()
	last_name = fields.Str()
	password = fields.Str(attribute="_password", required=True)
	salary = fields.Int()
	districts = fields.Nested('DistrictSchema', many=True, exclude=('schools'), dump_only=True)
	schools = fields.Nested('SchoolSchema', many=True, exclude=('district_id'), dump_only=True)
	activity_logs = fields.Nested('ActivityLogSchema', many=True, exclude=('user_id'), dump_only=True)
	expense_sheets = fields.Nested('ExpenseSheetSchema', many=True, exclude=('user_id'), dump_only=True)
	report_urls = fields.Nested('ReportURLSchema', many=True, exclude=('user_id'), dump_only=True)
	active = fields.Boolean(attribute='is_active', missing=False)
	urole = fields.Str(required=True)

class DistrictSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	schools = fields.Nested('SchoolSchema', many=True, exclude=('district_id'), dump_only=True)
	users = fields.Nested('UserSchema', many=True, only=('name'), dump_only=True)

class SchoolSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	name = fields.Str(required=True)
	district = fields.Nested('DistrictSchema', only=('name'), dump_only=True)

class ActivityLogSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	user_id = fields.Nested('UserSchema', only=('id'), dump_only=True)

class ExpenseSheetSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	user_id = fields.Nested('UserSchema', only=('id'), dump_only=True)

class ReportURLSchema(ma.ModelSchema):
	id = fields.Int(dump_only=True)
	user_id = fields.Nested('UserSchema', only=('id'), dump_only=True)
