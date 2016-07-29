# app/forms/report.py

from flask.ext.wtf import Form
from wtforms import TextField, BooleanField, IntegerField, FieldList, FormField
from wtforms import Form as NoCsrfForm
from wtforms.widgets import TextArea
from wtforms.fields.html5 import EmailField, DateField
from wtforms.validators import Required, Email, EqualTo

from ..model import User, District, School, Activity_Type

class ActivityLogForm(Form):
	name = TextField('Activity Title', [Required(message='The activity log needs a title!')])
	activity_date_start = TextField('Activity Start Date')
	activity_date_end = TextField('Activity End Date')
	log_schools = TextField('Participating Schools')
	log_districts = TextField('Participating Districts')
	activity_types = TextField('Activity Types')
	activity_contact = TextField('Activity Contact Person')
	report_notes = TextField('Report Notes', widget=TextArea())

class ExpenseSheetForm(Form):
	total_mileage = IntegerField('Total Mileage')
	travel_route_from = TextField('Travel Departure Location')
	travel_route_to = TextField('Travel Destination Location(s)')
	itemized_meals = TextField('Itemized Meals')
	hotel_reimbursement = TextField('Hotel Reimbursement')
	other_reimbursement = TextField('Other Reimbursements')
