''' email links views blueprint '''
# app/views/email.py

from flask import Blueprint, render_template, flash, redirect, session, url_for
from flask.ext.sqlalchemy import SQLAlchemy

from .. import db
from ..forms.user import PasswordForm
from ..model import User
from ..util.security import ts

email_bp = Blueprint('email_bp', __name__)

# view for the email confirmation link page (after registering a new user)
@email_bp.route('/confirm/<token>')
def user_confirm_email(token):
	try:
		email = ts.loads(token, salt="email-confirm-key", max_age=86400)
	except:
		abort(404)

	user = User.query.filter_by(email=email).first_or_404()

	user.email_confirmed = True

	db.session.add(user)
	db.session.commit()

	return redirect(url_for('login_bp.login'))

# view for the password reset page
@email_bp.route('/reset/<token>', methods=["GET", "POST"])
def reset_with_token(token):
	try:
		email = ts.loads(token, salt="recover-key", max_age=86400)
	except:
		abort(404)

	form = PasswordForm()

	if form.validate_on_submit():
		user = User.query.filter_by(email=email).first()

		user.password = form.password.data

		db.session.add(user)
		db.session.commit()

		flash('Password for '+user.username+' changed! Try logging in again.')
		return redirect(url_for('login_bp.login'))

	return render_template('accounts/reset-with-token.html', form=form, token=token)
