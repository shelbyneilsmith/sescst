# stafftools/model.py

import sys
import datetime
# from flask.ext.security import Security, UserMixin, RoleMixin
from sqlalchemy.ext.hybrid import hybrid_property
from . import db, bcrypt

# Base model and helper tables
class Base(db.Model):
	__abstract__ = True

	id = db.Column(db.Integer, primary_key=True)
	date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

	# def update(self, **kwargs):
	#         for key, value in  kwargs.items():
	# 		setattr(self, key, value)
	def _find_or_create_relationship_value(self, rel_type, val_name):
		classy_rt = getattr(sys.modules[__name__], rel_type)
		q = classy_rt.query.filter_by(name=val_name)
		t = q.first()
		if not(t):
			t = classy_rt(val_name)
		return t

	def get_rel_vals(self, rel_field):
		return [x.name for x in rel_field]

	def set_rel_val(self, value, rel_type, rel_field):
		setattr(self, rel_field, self._find_or_create_relationship_value(rel_type, value['name']))


	def set_rel_vals(self, value, rel_type, rel_field):
		setattr(self, rel_field, [])
		for val in value:
			getattr(self, rel_field).append(self._find_or_create_relationship_value(rel_type, val['name']))



district_identifier = db.Table('district_identifier',
	db.Column('district_id', db.Integer, db.ForeignKey('districts.id')),
	db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)

school_identifier = db.Table('school_identifier',
	db.Column('school_id', db.Integer, db.ForeignKey('schools.id')),
	db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)

district_identifier_al = db.Table('district_identifier_al',
	db.Column('district_id', db.Integer, db.ForeignKey('districts.id')),
	db.Column('activity_log_id', db.Integer, db.ForeignKey('activity_logs.id'))
)
school_identifier_al = db.Table('school_identifier_al',
	db.Column('school_id', db.Integer, db.ForeignKey('schools.id')),
	db.Column('activity_log_id', db.Integer, db.ForeignKey('activity_logs.id'))
)


district_identifier_es = db.Table('district_identifier_es',
	db.Column('district_id', db.Integer, db.ForeignKey('districts.id')),
	db.Column('expense_sheet_id', db.Integer, db.ForeignKey('expense_sheets.id'))
)
school_identifier_es = db.Table('school_identifier_es',
	db.Column('school_id', db.Integer, db.ForeignKey('schools.id')),
	db.Column('expense_sheet_id', db.Integer, db.ForeignKey('expense_sheets.id'))
)

activity_type_identifier_al = db.Table('activity_type_identifier_al',
	db.Column('activity_type_id', db.Integer, db.ForeignKey('activity_types.id')),
	db.Column('activity_log_id', db.Integer, db.ForeignKey('activity_logs.id')),
)
activity_type_identifier_es = db.Table('activity_type_identifier_es',
	db.Column('activity_type_id', db.Integer, db.ForeignKey('activity_types.id')),
	db.Column('expense_sheet_id', db.Integer, db.ForeignKey('expense_sheets.id')),
)

# Role Model
class Role(db.Model):
	__tablename__ = 'roles'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), unique=True)
	description = db.Column(db.String(255))

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<Role %r>' % (self.name)

# User Model
class User(Base):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	username = db.Column(db.String(255), unique=True, nullable=False)
	email = db.Column(db.String(255), unique=True, nullable=False)
	first_name = db.Column(db.String(64), nullable=False)
	last_name = db.Column(db.String(64), nullable=False)
	_password = db.Column(db.String(128), nullable=False)
	salary = db.Column(db.Integer)
	districts = db.relationship('District', secondary=district_identifier, back_populates="users")
	schools = db.relationship('School', secondary=school_identifier, back_populates="users")
	# activity_logs = db.relationship('Activity_Log', backref='users', lazy='dynamic')
	activity_logs = db.relationship("Activity_Log", back_populates="user")
	# expense_sheets = db.relationship('Expense_Sheet', backref='users', lazy='dynamic')
	expense_sheets = db.relationship("Expense_Sheet", back_populates="user")
	# report_urls = db.relationship('Report_URL', backref='users', lazy='dynamic')
	report_urls = db.relationship("Report_URL", back_populates="user")
	is_active = db.Column(db.Boolean, default=False)
	urole = db.Column(db.String(255), nullable=False)

	@property
	def is_authenticated(self):
		return True

	@property
	def is_anonymous(self):
		return False

	@hybrid_property
	def name(self):
		return self.username

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

	def is_active(self):
		return True

	def get_username(self):
		return self.username

	def get_urole(self):
		return self.urole

	def __str__(self):
		return self.username

	def __repr__(self):
		return '<User %r>' % (self.username)

# Activity types model
class Activity_Type(db.Model):
	__tablename__ = 'activity_types'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), unique=True)
	description = db.Column(db.String(255))

	activity_logs = db.relationship("Activity_Log", secondary=activity_type_identifier_al, back_populates="activity_types")
	expense_sheets = db.relationship("Expense_Sheet", secondary=activity_type_identifier_es, back_populates="activity_types")

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<Activity Type %r>' % (self.name)


# Reports Model
class Activity_Log(Base):
	__tablename__ = 'activity_logs'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)
	log_date_start = db.Column(db.DateTime)
	log_date_end = db.Column(db.DateTime)
	# consultant = db.Column(db.Integer, db.ForeignKey('users.id'))

	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user = db.relationship("User", back_populates="activity_logs")

	# districts = db.relationship('District', secondary=district_identifier_al, backref=db.backref('activity_logs', lazy='dynamic'))
	districts = db.relationship("District", secondary=district_identifier_al, back_populates="activity_logs")

	# schools = db.relationship('School', secondary=school_identifier_al, backref=db.backref('activity_logs', lazy='dynamic'))
	schools = db.relationship("School", secondary=school_identifier_al, back_populates="activity_logs")

	# activity_types = db.relationship('Activity_Type', secondary=activity_type_identifier_al, backref=db.backref('activity_logs', lazy='dynamic'))
	activity_types = db.relationship("Activity_Type", secondary=activity_type_identifier_al, back_populates="activity_logs")

	activity_contact = db.Column(db.String(255))
	event_costs = db.Column(db.String(255))
	report_notes = db.Column(db.String(255))
	expense_sheet = db.relationship('Expense_Sheet', uselist=False, back_populates='activity_log')

	def __repr__(self):
		return '<Activity Log %r>' % (self.name)

class Expense_Sheet(Base):
	__tablename__ = 'expense_sheets'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)

	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user = db.relationship("User", back_populates="expense_sheets")

	districts = db.relationship("District", secondary=district_identifier_es, back_populates="expense_sheets")
	schools = db.relationship("School", secondary=school_identifier_es, back_populates="expense_sheets")

	# user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	activity_log_id = db.Column(db.Integer, db.ForeignKey('activity_logs.id'))
	activity_log = db.relationship('Activity_Log', back_populates='expense_sheet')

	activity_types = db.relationship("Activity_Type", secondary=activity_type_identifier_es, back_populates="expense_sheets")

	to_mileage = db.Column(db.Integer)
	from_mileage = db.Column(db.Integer)
	mileage_reimbursement = db.Column(db.Integer)
	itemized_meals = db.Column(db.String(255))
	hotel_reimbursement = db.Column(db.String(255))
	cell_phone_reimbursement = db.Column(db.String(255))
	other_reimbursement = db.Column(db.String(255))

	def __repr__(self):
		return '<Expense Sheet %r>' % (self.activity_log)

class Report_URL(Base):
	__tablename__ = 'report_urls'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	url = db.Column(db.String(255), nullable=False)
	# user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user = db.relationship("User", back_populates="report_urls")

	def __str__(self):
		return self.url

	def __repr__(self):
		return '<Report URL %r>' % (self.url)

# Location Model
class District(Base):
	__tablename__ = 'districts'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)
	# schools = db.relationship('School', backref='district', lazy='dynamic')
	users = db.relationship("User", secondary=district_identifier, back_populates="districts")

	schools = db.relationship("School", uselist=True, back_populates="district")

	activity_logs = db.relationship("Activity_Log", secondary=district_identifier_al, back_populates="districts")
	expense_sheets = db.relationship("Expense_Sheet", secondary=district_identifier_es, back_populates="districts")

	# schools = db.relationship('School', secondary=school_identifier, backref=db.backref('district', lazy='dynamic'))

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<District %r>' % (self.name)

class School(Base):
	__tablename__ = 'schools'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)

	users = db.relationship("User", secondary=school_identifier, back_populates="schools")

	district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
	district = db.relationship("District", back_populates="schools")

	activity_logs = db.relationship("Activity_Log", secondary=school_identifier_al, back_populates="schools")
	expense_sheets = db.relationship("Expense_Sheet", secondary=school_identifier_es, back_populates="schools")

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<School %r>' % (self.name)
