''' stafftools init '''
# app/__init__.py

import os
from flask import Flask
# from flask.ext.bcrypt import Bcrypt

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

from app import views
