import os
from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

from app import app, db

app.config.from_object(os.environ['APP_SETTINGS'])

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

from app.util.email import send_email
@manager.command
def test_email(to='shelby@yellowberri.com'):
	send_email(to, 'test email!', 'yeah!')


if __name__ == '__main__':
	manager.run()
