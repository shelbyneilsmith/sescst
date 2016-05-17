''' general application views blueprint '''
# app/views/general.py

from flask import Blueprint, render_template
from flask.ext.login import login_required

general = Blueprint('general', __name__)

# routing for angular template partials
@general.route('/templates/<path:path>')
def serve_partial(path):
    return render_template('{}'.format(path))

# routing for basic pages (pass routing onto the Angular app)
@general.route('/')
@login_required
def app_pages():
    return render_template('index.html')

# view for 404 errors!
@general.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404
