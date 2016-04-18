from flask import render_template, Response
from flask import make_response
# from flask.ext.login import login_user, logout_user, current_user, login_required
from app import app, db

# # main index page view
# @app.route('/')
# @app.route('/index')
# # @login_required
# def index():
# 	return render_template('index.html')

# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/index')
def app_pages():
    return make_response(open('app/templates/index.html').read())

# @app.rout('/user-account')
# def user_account():
# 	return app.send_static_file('inc/user-')
