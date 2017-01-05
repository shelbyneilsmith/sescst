'use strict';

module.exports = angular.module('sescst-report-builder', [])
	.controller('reportBuilderCtrl', require('../controller/reportBuilderCtrl'))
	.directive('reportOutput', require('../directive/reports/reportOutput'))
	.directive('formFilters', require('../directive/reports/formFilters'))
	.directive('filterSelect', require('../directive/reports/filterSelect'))
	.directive('metricSelect', require('../directive/reports/metricSelect'))
	.directive('reportTable', require('../directive/reports/reportTable'))
	.directive('widgetSettings', require('../directive/reports/widgetSettings'))
	.directive('reportWidget', require('../directive/reports/reportWidget'))
	.directive('chartMetrics', require('../directive/reports/chartMetrics'));
