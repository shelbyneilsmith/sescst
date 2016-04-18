var angular = require('angular');
require('angular-route');

require('./controller');
require('./directive');
require('./service');
require('./components');

/**
 * The main angular module for the staff tools app
 * @type {angular.Module}
 */
'use strict';

angular.module('sescstafftools', [
	'ngRoute',
	'sescst-structure',
	'auth-services',
]).config(require('./components/routes'));

