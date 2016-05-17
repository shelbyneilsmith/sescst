var angular = require('angular');
require('angular-route');

var inflection = require('inflection');
require('nginflection');

require('./controller');
require('./directive');
require('./service');
require('./components');
require('./filters');

/**
 * The main angular module for the staff tools app
 * @type {angular.Module}
 */
'use strict';

angular.module('sescstafftools', [
	'ngRoute',
	'ngInflection',
	'sescst-utils',
	'main-controller',
	'sescst-structure',
	'helper-services',
	'sescst-forms',
	'app-filters',
	'sescst-posts',
])
.config(['$interpolateProvider', function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[');
	$interpolateProvider.endSymbol(']}');
}])
.config(require('./components/routes'));

