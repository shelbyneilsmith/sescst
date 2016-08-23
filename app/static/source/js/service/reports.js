/**
 * The service for reports functions.
 */
'use strict';

module.exports = angular.module('reports-services', [])
	.factory('ReportUtils', require('./reports/reportUtilities'))
	.service('ColorRange', require('./reports/colorrange'))
	.service('WidgetTable', require('./reports/tables'))
	.service('WidgetChart', require('./reports/charts'));
