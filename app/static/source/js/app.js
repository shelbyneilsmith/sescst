var angular = require('angular');
var inflection = require('inflection');

require('angular-route');
require('angular-animate');

require('nginflection');
require('ui-select');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('chart.js');
// require('angular-rison');

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
.constant('config', {
	dateFormat: 'MMM d, y',
	dateOffset: '+0500'
})
.config(['$interpolateProvider', function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[');
	$interpolateProvider.endSymbol(']}');
}])
.config(['uiSelectConfig', function(uiSelectConfig) {
	uiSelectConfig.theme = 'select2';
	uiSelectConfig.resetSearchInput = true;
	uiSelectConfig.appendToBody = true;
}])
.config(require('./components/routes'));
