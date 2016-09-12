'use strict';

module.exports = angular.module('sescst-report-builder', [])
	.controller('reportBuilderCtrl', require('../controller/reportBuilderCtrl'))
	.directive('formFilters', require('../directive/reports/formFilters'))
	.directive('reportWidget', require('../directive/reports/reportWidget'))
	.directive('filterSelect', require('../directive/reports/filterSelect'))
	.directive('metricSelect', require('../directive/reports/metricSelect'))
	.directive('reportTable', require('../directive/reports/reportTable'))
	.directive('chartMetrics', require('../directive/reports/chartMetrics'));
