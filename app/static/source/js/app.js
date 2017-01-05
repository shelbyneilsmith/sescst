var angular = require('angular');
var inflection = require('inflection');

require('angular-route');
require('angular-animate');

require('nginflection');
require('ui-select');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('chart.js');

// require the main app files
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

// Initialize app and all modules
angular.module('sescstafftools', [
	'ngRoute',
	'ngInflection',
	'ngAnimate',
	'ui.select',
	'ui.bootstrap',
	'ngSanitize',
	'sescst-utils',
	'main-controller',
	'sescst-structure',
	'helper-services',
	'utility-services',
	'sescst-forms',
	'app-filters',
	'sescst-posts',
	'sescst-app-settings',
	'reports-services',
	'sescst-report-builder',
])
// set date format and localize the datetime to EST
.constant('config', {
	dateFormat: 'MMM d, y',
	dateOffset: '+0500'
})
// change the angular template brackets so it will play nicely with Jinja/Flask
.config(['$interpolateProvider', function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[');
	$interpolateProvider.endSymbol(']}');
}])
// Set up the uiSelect configuration
.config(['uiSelectConfig', function(uiSelectConfig) {
	uiSelectConfig.theme = 'select2';
	uiSelectConfig.resetSearchInput = true;
	uiSelectConfig.appendToBody = true;
}])
// configure the app router
.config(require('./components/routes'));
