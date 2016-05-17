''' stafftools init '''
# app/__init__.py

import os
from flask import Flask
from flask.ext.bcrypt import Bcrypt
from flask.ext.login import LoginManager
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.marshmallow import Marshmallow

app = Flask(__name__, static_path='/static')

app.url_map.strict_slashes = False
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

from .model import User

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login_bp.login'

@lm.user_loader
def load_user(userid):
	return User.query.filter(User.id == userid).first()

from functools import wraps

def login_required(role="ANY"):
	def wrapper(fn):
		@wraps(fn)
		def decorated_view(*args, **kwargs):
			if not current_user.is_authenticated():
				return lm.unauthorized()
			urole = lm.reload_user().get_urole()
			if ((urole != role) and (role != "ANY")):
				return lm.unauthorized()
			return fn(*args, **kwargs)
		return decorated_view
	return wrapper

from .views.general import general
from .views.login import login_bp
from .views.admin import admin_bp
from .views.email import email_bp

app.register_blueprint(general)
app.register_blueprint(login_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(email_bp)
