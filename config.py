import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
	DEBUG = False
	TESTING = False
	CSRF_ENABLED = True
	SECRET_KEY = 'weeawyivinnayeyosuhnareen'
	SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL'] # (local: sescst_dev)
	BCRYPT_LOG_ROUNDS = 12

	# Email Config
	MAIL_SERVER = 'secure.emailsrvr.com'
	MAIL_PORT = 465
	MAIL_USE_TLS = False
	MAIL_USE_SSL = True
	MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
	MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
	DEFAULT_MAIL_SUBJECT = '[Message from the SESC Staff Tools Application]'

	# administrator list
	ADMINS = ['no-reply@yellowberri.com']

class ProductionConfig(Config):
	DEBUG = False

class StagingConfig(Config):
	DEVELOPMENT = True
	DEBUG = True

class DevelopmentConfig(Config):
	DEVELOPMENT = True
	DEBUG = True

class TestingConfig(Config):
	TESTING = True
