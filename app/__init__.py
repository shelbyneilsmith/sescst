''' stafftools init '''
# app/__init__.py

import os
from flask import Flask
from flask.ext.bcrypt import Bcrypt
from flask.ext.login import LoginManager, current_user, current_app
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.marshmallow import Marshmallow
from flask.ext.security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required

app = Flask(__name__, static_path='/static')

app.url_map.strict_slashes = False
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

from .model import User, Role

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login_bp.login'

@lm.user_loader
def load_user(userid):
	return User.query.filter(User.id == userid).first()

# Setup Flask-Security
# user_datastore = SQLAlchemyUserDatastore(db, User, Role)
# security = Security(app, user_datastore)

from functools import wraps

def login_required(role="ANY"):
	def wrapper(fn):
		@wraps(fn)
		def decorated_view(*args, **kwargs):
			if not current_user.is_authenticated:
				return lm.unauthorized()
			urole = current_user.get_urole()
			if ((urole != role) and (role != "ANY")):
				return lm.unauthorized()
			return fn(*args, **kwargs)
		return decorated_view
	return wrapper

# def login_required(role="ANY"):
# 	def wrapper(fn):
# 		@wraps(fn)
# 		def decorated_view(*args, **kwargs):
# 			if not current_user.is_authenticated:
# 				return current_app.login_manager.unauthorized()
# 			urole = current_app.login_manager.reload_user().get_urole()
# 			if ( (urole != role) and (role != "ANY")):
# 				return current_app.login_manager.unauthorized()
# 			return fn(*args, **kwargs)
# 		return decorated_view
# 	return wrapper
# def get_current_user_role():
# 	return user_roles

# def requires_roles(*roles):
# 	def wrapper(f):
# 		@wraps(f)
# 		def wrapped(*args, **kwargs):
# 			if not current_user.is_authenticated:
# 				return lm.unauthorized()
# 			if get_current_user_role() not in roles:
# 				return error_response()
# 			return f(*args, **kwargs)
# 		return wrapped
# 	return wrapper
#
try:
	Role.query.all()

	from .views.general import general
	# from .views.login import login_bp
	# from .views.admin import admin_bp
	# from .views.email import email_bp
	# from .views.reports import reports_bp

	app.register_blueprint(general)
	# app.register_blueprint(login_bp)
	# app.register_blueprint(admin_bp)
	# app.register_blueprint(email_bp)
	# app.register_blueprint(reports_bp)
except:
	pass
