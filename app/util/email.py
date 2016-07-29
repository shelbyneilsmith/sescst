# app/util/email.py

import os
from flask import Flask, render_template, redirect
from flask.ext.mail import Mail, Message
from .. import app

mail = Mail(app)

# def send_email(to, subject, template, **kwargs):
def send_email(to, subject, template):
	msg = Message(app.config['DEFAULT_MAIL_SUBJECT']+' '+subject, sender=app.config['ADMINS'][0], recipients=[to])
	# msg.html = render_template(template + '.html', **kwargs)
	msg.html = template
	mail.send(msg)

def confirm_email(user):
	try:
		# Now we'll send the email confirmation link
		subject = "Please confirm your email"

		token = ts.dumps(user.email, salt='email-confirm-key')

		confirm_url = url_for(
			'email_bp.user_confirm_email',
			token=token,
			_external=True
		)
		html = render_template(
			'email/activate.html',
			confirm_url=confirm_url
		)

		send_email(user.email, subject, html)

		return True
	except:
		return False
