# stafftools/model.py

import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from . import db, bcrypt

# Base model and helper tables
class Base(db.Model):
	__abstract__ = True

	id = db.Column(db.Integer, primary_key=True)
	date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

	def update(self, **kwargs):
	        for key, value in  kwargs.items():
			setattr(self, key, value)

district_identifier = db.Table('district_identifier',
	db.Column('district_id', db.Integer, db.ForeignKey('districts.id')),
	db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)

school_identifier = db.Table('school_identifier',
	db.Column('school_id', db.Integer, db.ForeignKey('schools.id')),
	db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)

# User Model
class User(Base):

	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	username = db.Column(db.String(255), unique=True, nullable=False)
	email = db.Column(db.String(255), unique=True, nullable=False)
	first_name = db.Column(db.String(64), nullable=False)
	last_name = db.Column(db.String(64), nullable=False)
	_password = db.Column(db.String(128), nullable=False)
	salary = db.Column(db.Integer)
	districts = db.relationship('District', secondary=district_identifier, backref=db.backref('users', lazy='dynamic'))
	schools = db.relationship('School', secondary=school_identifier, backref=db.backref('users', lazy='dynamic'))
	activity_logs = db.relationship('Activity_Log', backref='consultant', lazy='dynamic')
	expense_sheets = db.relationship('Expense_Sheet', backref='consultant', lazy='dynamic')
	report_urls = db.relationship('Report_URL', backref='creator', lazy='dynamic')
	is_active = db.Column(db.Boolean, default=False)
	urole = db.Column(db.String(80))
	# registered_on = db.Column(db.DateTime, nullable=False)
	# admin = db.Column(db.Boolean, nullable=False, default=False)

	# def __init__(self, username, email, first_name, last_name, admin=False):
	# 	self.username = username
	# 	self.email = email
	# 	self.first_name = first_name
	# 	self.last_name = last_name
	# 	# self.password = bcrypt.generate_password_hash(password)
	# 	self.registered_on = datetime.datetime.now()
	# 	self.admin = admin

	@property
	def is_authenticated(self):
		return True

	@property
	def is_active(self):
		return True

	@property
	def is_anonymous(self):
		return False

	@hybrid_property
	def password(self):
		return self._password

	@password.setter
	def _set_password(self, plaintext):
		self._password = bcrypt.generate_password_hash(plaintext)

	def is_correct_password(self, plaintext):
		if bcrypt.check_password_hash(self._password, plaintext):
			return True

		return False

	def get_id(self):
		try:
			return unicode(self.id) #python 2
		except NameError:
			return str(self.id) #python 3

	def get_username(self):
		return self.username

	def get_urole(self):
		return self.urole

	def __repr__(self):
		return '<User %r>' % (self.username)

# Reports Model
class Activity_Log(Base):
	__tablename__ = "activity_logs"
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Expense_Sheet(Base):
	__tablename__ = "expense_sheets"
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Report_URL(Base):
	__tablename__ = "report_urls"
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

# Location Model
class District(Base):
	__tablename__ = "districts"
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)
	schools = db.relationship('School', backref='district', lazy='dynamic')

	def __str__(self):
		return self.name

class School(Base):
	__tablename__ = "schools"
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)
	district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))

	def __str__(self):
		return self.name
