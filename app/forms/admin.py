# app/forms/user.py

from flask.ext.wtf import Form
from wtforms import TextField, PasswordField, BooleanField, IntegerField
from wtforms.fields.html5 import EmailField
from wtforms.validators import Required, Email, EqualTo

from .. import db
from ..model import User, Role, District, School

class RegisterUserForm(Form):
	username = TextField('Username', [Required(message='You have to set a username!')])
	first_name = TextField('First Name')
	last_name = TextField('Last Name')
	email = EmailField('Email Address', [Required(message='Please enter your email address.'), Email(message='This field requires a valid email address.')])
	salary = IntegerField('Salary')
	password = PasswordField('Password', [Required(message='Please enter a password.')])
	user_districts = TextField('User Districts')
	user_schools = TextField('User Schools')
	urole = TextField('Set Access Role')

class RegisterDistrictForm(Form):
	district_name = TextField('District Name', [Required(message='You have to set a name for this district!')])
	district_schools = TextField('District Schools')

class RegisterSchoolForm(Form):
	school_name = TextField('School Name', [Required(message='You have to set a name for this school!')])
