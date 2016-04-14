''' stafftools models '''
# stafftools/models.py

import datetime
from app import db, bcrypt
from sqlalchemy.dialects.postgresql import JSON

class Base(db.Model):
	__abstract__ = True

	id = db.Column(db.Integer, primary_key=True)
	date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class User(Base):

	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	username = db.Column(db.String(255), unique=True, nullable=False)
	password = db.Column(db.String(255), nullable=False)
	registered_on = db.Column(db.DateTime, nullable=False)
	admin = db.Column(db.Boolean, nullable=False, default=False)

	def __init__(self, username, password, admin=False):
		self.username = username
		self.password = bcrypt.generate_password_hash(password)
		self.registered_on = datetime.datetime.now()
		self.admin = admin

	@property
	def is_authenticated(self):
		return True

	@property
	def is_active(self):
		return True

	@property
	def is_anonymous(self):
		return False

	def get_id(self):
		try:
			return unicode(self.id) #python 2
		except NameError:
			return str(self.id) #python 3

	def __repr__(self):
		return '<User %r>' % (self.username)
