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

from app.model import User
@manager.command
def create_admin(username='admin', email='shelby@yellowberri.com', password='LogMe1n234'):
	user = User(
		username=username,
		first_name='First',
		last_name='Last',
		email=email,
		password=password,
		urole='Administrator'
	)
	db.session.add(user)
	db.session.commit()

from app.model import Role
@manager.option('-n', '--name', help='Specify a name for the new role.')
def create_role(name, description=''):
	role = Role(
		name=name,
		description=description
	)
	db.session.add(role)
	db.session.commit()

if __name__ == '__main__':
	manager.run()
