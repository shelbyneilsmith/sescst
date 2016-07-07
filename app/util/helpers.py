# app/util/helpers.py
#
import json
from .. import db
from ..model import User, Role

def get_access_roles():
	roles = []
	db_roles = Role.query.all()
	for role in db_roles:
		roles.append((role.name, role.name))

	return roles

def saveSelectField(post, field_data, rel_type, field_key):
	post.set_rel_val(json.loads(field_data), rel_type, field_key)

def saveMultiSelectField(post, field_data, rel_type, field_key):
	post.set_rel_vals(json.loads(field_data), rel_type, field_key)
