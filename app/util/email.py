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
