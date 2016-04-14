''' stafftools init '''
# app/__init__.py

from flask import Flask, request, jsonify
from flask.ext.bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

from app import views
