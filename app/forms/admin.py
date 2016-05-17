# app/forms/user.py

from flask.ext.wtf import Form
from wtforms import TextField, PasswordField, BooleanField, SelectField, IntegerField
from wtforms.fields.html5 import EmailField
from wtforms.validators import Required, Email, EqualTo
from wtforms.ext.sqlalchemy.fields import QuerySelectMultipleField

from .. import db
from ..model import User, District, School

class RegisterUserForm(Form):
	username = TextField('Username', [Required(message='You have to set a username!')])
	first_name = TextField('First Name')
	last_name = TextField('Last Name')
	email = EmailField('Email Address', [Required(message='Please enter your email address.'), Email(message='This field requires a valid email address.')])
	salary = IntegerField('Salary')
	password = PasswordField('Password', [Required(message='Please enter a password.')])
	user_schools = QuerySelectMultipleField(query_factory=lambda: School.query)
	user_districts = QuerySelectMultipleField(query_factory=lambda: District.query)
	urole = SelectField('Access Role', choices=[('admin', 'Administrator'), ('consultant', 'Consultant'), ('director', 'Director'), ('superintendent', 'Superintendent')])

class RegisterDistrictForm(Form):
	district_name = TextField('District Name', [Required(message='You have to set a name for this district!')])
	district_schools = QuerySelectMultipleField(query_factory=lambda: School.query)

class RegisterSchoolForm(Form):
	school_name = TextField('School Name', [Required(message='You have to set a name for this school!')])
