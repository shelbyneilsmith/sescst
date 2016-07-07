# app/forms/report.py

from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, SelectField, IntegerField, FieldList, FormField
from wtforms import Form as NoCsrfForm
from wtforms.widgets import TextArea
from wtforms.fields.html5 import EmailField, DateField
from wtforms.validators import Required, Email, EqualTo

from ..model import User, District, School, Activity_Type

class ActivityLogForm(Form):
	name = TextField('Activity Title', [Required(message='The activity log needs a title!')])
	log_date_start = TextField('Log Start Date')
	log_date_end = TextField('Log End Date')
	consultant = TextField('Consultant')
	log_schools = TextField('Log Schools')
	log_districts = TextField('Log Districts')
	activity_types = TextField('Activity Types')
	activity_contact = TextField('Activity Contact Person')
	event_costs = TextField('Event Cost(s)')
	report_notes = TextField('Report Notes', widget=TextArea())

class ExpenseSheetForm(Form):
	to_mileage = IntegerField('To Mileage')
	from_mileage = IntegerField('From Mileage')
	mileage_reimbursement = IntegerField('Mileage Reimbursement')
	itemized_meals = TextField('Itemized Meals')
	hotel_reimbursement = TextField('Hotel Reimbursement')
	cell_phone_reimbursement = TextField('Cell Phone Reimbursement')
	other_reimbursement = TextField('Other Reimbursements')
