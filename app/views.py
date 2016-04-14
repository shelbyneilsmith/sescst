from flask import render_template
# from flask.ext.login import login_user, logout_user, current_user, login_required
from app import app

# main index page view
@app.route('/')
@app.route('/index')
# @login_required
def index():
	return app.send_static_file('index.html')
