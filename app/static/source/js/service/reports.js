/**
 * The service for reports functions.
 */
'use strict';

module.exports = angular.module('reports-services', [])
	.factory('ReportUtils', require('./reports/reportUtilities'))
	.service('ColorRange', require('./reports/colorrange'))
	.service('WidgetChart', require('./reports/charts'));
