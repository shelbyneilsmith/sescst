# stafftools/model.py

import sys
import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from . import db, bcrypt

# Base model and helper tables
class Base(db.Model):
	__abstract__ = True

	id = db.Column(db.Integer, primary_key=True)
	date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

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

school_identifier_level = db.Table('school_identifier_level',
	db.Column('school_id', db.Integer, db.ForeignKey('schools.id')),
	db.Column('school_level_id', db.Integer, db.ForeignKey('school_levels.id'))
)

service_identifier_district = db.Table('service_identifier_district',
	db.Column('district_id', db.Integer, db.ForeignKey('districts.id')),
	db.Column('location_service_id', db.Integer, db.ForeignKey('location_services.id'))
)
service_identifier_school = db.Table('service_identifier_school',
	db.Column('school_id', db.Integer, db.ForeignKey('schools.id')),
	db.Column('location_service_id', db.Integer, db.ForeignKey('location_services.id'))
)

activity_type_identifier_al = db.Table('activity_type_identifier_al',
	db.Column('activity_type_id', db.Integer, db.ForeignKey('activity_types.id')),
	db.Column('activity_log_id', db.Integer, db.ForeignKey('activity_logs.id')),
)
activity_type_identifier_es = db.Table('activity_type_identifier_es',
	db.Column('activity_type_id', db.Integer, db.ForeignKey('activity_types.id')),
	db.Column('expense_sheet_id', db.Integer, db.ForeignKey('expense_sheets.id')),
)

# Application Settings Model
class AppSettings(db.Model):
	__tablename__ = 'app_settings'

	id = db.Column(db.Integer, primary_key=True)
	setting_name = db.Column(db.String(80), unique=True)
	setting_val = db.Column(db.String(255))


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
	contract_days = db.Column(db.Integer)
	districts = db.relationship('District', secondary=district_identifier, back_populates="users")
	schools = db.relationship('School', secondary=school_identifier, back_populates="users")
	cell_reimbursement = db.Column(db.Integer)
	activity_logs = db.relationship("Activity_Log", back_populates="user")
	expense_sheets = db.relationship("Expense_Sheet", back_populates="user")
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


# Activity Logs Model
class Activity_Log(Base):
	__tablename__ = 'activity_logs'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)
	activity_date_start = db.Column(db.DateTime)
	activity_date_end = db.Column(db.DateTime)

	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user = db.relationship("User", back_populates="activity_logs")

	districts = db.relationship("District", secondary=district_identifier_al, back_populates="activity_logs")

	schools = db.relationship("School", secondary=school_identifier_al, back_populates="activity_logs")

	activity_types = db.relationship("Activity_Type", secondary=activity_type_identifier_al, back_populates="activity_logs")

	activity_contact = db.Column(db.String(255))
	event_costs = db.Column(db.String(255))
	report_notes = db.Column(db.String(255))
	expense_sheet = db.relationship('Expense_Sheet', uselist=False, back_populates='activity_log')

	def __repr__(self):
		return '<Activity Log %r>' % (self.name)

# Expense Sheet Model
class Expense_Sheet(Base):
	__tablename__ = 'expense_sheets'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)

	expense_sheet_start = db.Column(db.DateTime)
	expense_sheet_end = db.Column(db.DateTime)

	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user = db.relationship("User", back_populates="expense_sheets")

	districts = db.relationship("District", secondary=district_identifier_es, back_populates="expense_sheets")
	schools = db.relationship("School", secondary=school_identifier_es, back_populates="expense_sheets")

	activity_log_id = db.Column(db.Integer, db.ForeignKey('activity_logs.id'))
	activity_log = db.relationship('Activity_Log', back_populates='expense_sheet')

	activity_types = db.relationship("Activity_Type", secondary=activity_type_identifier_es, back_populates="expense_sheets")

	total_mileage = db.Column(db.Integer)
	travel_route_from = db.Column(db.String(255))
	travel_route_to = db.Column(db.String())
	itemized_meals = db.Column(db.String())
	hotel_reimbursement = db.Column(db.String())
	other_reimbursement = db.Column(db.String())

	def __repr__(self):
		return '<Expense Sheet %r>' % (self.activity_log)

# Report URL Model
class Report_URL(Base):
	__tablename__ = 'report_urls'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	url = db.Column(db.String(255), nullable=False)

	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user = db.relationship("User", back_populates="report_urls")

	def __str__(self):
		return self.url

	def __repr__(self):
		return '<Report URL %r>' % (self.url)

# District Model
class District(Base):
	__tablename__ = 'districts'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)
	users = db.relationship("User", secondary=district_identifier, back_populates="districts")

	location_services = db.relationship("Location_Service", secondary=service_identifier_district, back_populates="districts")

	schools = db.relationship("School", uselist=True, back_populates="district")

	activity_logs = db.relationship("Activity_Log", secondary=district_identifier_al, back_populates="districts")
	expense_sheets = db.relationship("Expense_Sheet", secondary=district_identifier_es, back_populates="districts")

	data_links = db.Column(db.String())

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<District %r>' % (self.name)

# School Model
class School(Base):
	__tablename__ = 'schools'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), unique=True, nullable=False)

	school_type_id = db.Column(db.Integer, db.ForeignKey('school_types.id'))
	school_type = db.relationship("School_Type", back_populates="schools")

	school_levels = db.relationship("School_Level", secondary=school_identifier_level, back_populates="schools")
	location_services = db.relationship("Location_Service", secondary=service_identifier_school, back_populates="schools")

	users = db.relationship("User", secondary=school_identifier, back_populates="schools")

	district_id = db.Column(db.Integer, db.ForeignKey('districts.id'))
	district = db.relationship("District", back_populates="schools")

	activity_logs = db.relationship("Activity_Log", secondary=school_identifier_al, back_populates="schools")
	expense_sheets = db.relationship("Expense_Sheet", secondary=school_identifier_es, back_populates="schools")

	data_links = db.Column(db.String())

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<School %r>' % (self.name)

# School types model
class School_Type(db.Model):
	__tablename__ = 'school_types'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), unique=True)

	schools = db.relationship("School", back_populates="school_type")

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<School Type %r>' % (self.name)

# School levels model
class School_Level(db.Model):
	__tablename__ = 'school_levels'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), unique=True)

	schools = db.relationship("School", secondary=school_identifier_level, back_populates="school_levels")

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<School Level %r>' % (self.name)

# Schools/Districts Services model
class Location_Service(db.Model):
	__tablename__ = 'location_services'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), unique=True)

	districts = db.relationship("District", secondary=service_identifier_district, back_populates="location_services")
	schools = db.relationship("School", secondary=service_identifier_school, back_populates="location_services")

	def __str__(self):
		return self.name

	def __repr__(self):
		return '<Location Service %r>' % (self.name)
