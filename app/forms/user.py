# app/forms/user.py

from flask.ext.wtf import Form
from wtforms import TextField, PasswordField, BooleanField, SelectField, IntegerField
from wtforms.fields.html5 import EmailField
from wtforms.validators import Required, Email, EqualTo

class LoginForm(Form):
	username = TextField('Username', [Required(message='Forgot your username?')])
	password = PasswordField('Password', [Required(message='Please enter a password.')])
	# remember_me = BooleanField('remember_me', default=False)

class EmailForm(Form):
	email = TextField('Email Address', [Required(message='Which email address do you want a password reset link sent to?'), Email(message='This field requires a valid email address.')])

class PasswordForm(Form):
	password = PasswordField('New Password', [Required(message='Please enter a new password.')])
