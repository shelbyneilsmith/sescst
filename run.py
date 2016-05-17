#!env/bin/python
# -*- coding: utf-8 -*-
"""
    SESC Staff Tools
    ~~~~~~~~
    A backend for the SESC Staff Tools web application written with Flask and sqlite3.
    :copyright: (c) 2016 by Shelby Neil Smith.
"""
from app import app

if __name__ == '__main__':
	app.run(debug=False)
