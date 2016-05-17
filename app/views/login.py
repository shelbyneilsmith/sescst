''' login views blueprint '''
# app/views/login.py

from flask import Blueprint, render_template, flash, redirect, url_for, Markup
from flask.ext.login import login_user, logout_user, current_user, login_required

from .. import db
from ..model import User
from ..forms.user import LoginForm, EmailForm
from ..util.security import ts
from ..util.email import send_email

login_bp = Blueprint('login_bp', __name__)

# db = SQLAlchemy(app)

# login/logout views
@login_bp.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()

	if form.validate_on_submit():
		user = User.query.filter_by(username=form.username.data).first()

		if user:
			if user.is_correct_password(form.password.data):
				login_user(user)

				return redirect(url_for('general.app_pages'))
			else:
				flash(Markup('Password incorrect for this user! Please try again or <a href="'+url_for('login_bp.reset')+'" target="_self">request a password reset</a>.'))
				return redirect(url_for('login_bp.login'))
		else:
			flash('User not found in the system. Please try again!')
			return redirect(url_for('login_bp.login'))


	return render_template('accounts/login.html', form=form)

@login_bp.route('/logout')
def logout():
	logout_user()

	return redirect(url_for('general.app_pages'))


# view for password reset feature
@login_bp.route('/reset', methods=["GET", "POST"])
def reset():
	form = EmailForm()
	if form.validate_on_submit():
		user = User.query.filter_by(email=form.email.data).first_or_404()

		if user:
			subject = "Password reset requested"

			token = ts.dumps(user.email, salt='recover-key')

			recover_url = url_for(
				'email_bp.reset_with_token',
				token=token,
				_external=True
			)

			html = render_template(
				'email/recover.html',
				recover_url=recover_url
			)
			send_email(user.email, subject, html)
			flash('Password reset email has been sent to the email address provided.')

			return redirect(url_for('login_bp.login'))
		else:
			flash('No user with this email found in system! Please try another address.')
			return redirect(url_for('login_bp.reset'))

	return render_template('accounts/password-reset.html', form=form)

