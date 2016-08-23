/**
 * The main controller for report builder. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$log', '$routeParams', 'ReportUtils', '$location', '$window', 'helpers', function($scope, $log, $routeParams, ReportUtils, $location, $window, helpers) {
	$scope.editingReport = helpers.getURLParameter('edit');
	$scope.saveBtnText = "Save Report";

	$scope.saveReport = ReportUtils.saveReport;
	$scope.deleteReport = ReportUtils.deleteReport;

	$scope.widgetOptions = [
		{label : 'Data Table', value : 'table'},
		{label : 'Pie Chart', value : 'doughnut'},
		{label : 'Bar Graph', value : 'bar'}
	];

	$scope.widgetFilterOpts = [
		{label : 'Date Range', value : 'date_range'},
		{label : 'Consultant', value : 'consultant'},
		{label : 'Activity', value : 'activity'},
		{label : 'District', value : 'district'},
	];

	$scope.widgetMetricOpts = [
		{label : 'Consultants', value : 'consultants'},
		{label : 'Schools', value : 'schools'},
		{label : 'Districts', value : 'districts'},
		{label : 'Activity Types', value : 'activity_types'},
	];


	$scope.widgetType = $scope.widgetOptions[0];
	$scope.widgets = [];

	$scope.addNewWidget = function() {
		if (!$scope.widgetTitle || typeof $scope.widgetTitle === 'undefined') {
			$scope.widgetTitle = 'untitled';
		}
		var newItemNo = $scope.widgets.length + 1;
		var widgetType = $scope.widgetType.value;
		var widgetTypeLabel = $scope.widgetType.label;
		$scope.widgets.push({'id':'widget-'+newItemNo, 'title': $scope.widgetTitle, 'type':widgetType, 'typeLabel':widgetTypeLabel});
		$scope.widgetTitle = '';

		ReportUtils.buildReportURL($scope.widgets);
	};


	$scope.destroyWidget = function(widget_id) {
		if (confirm("Are you sure you want to delete this report widget?")) {
			for(var i = 0; i < $scope.widgets.length; i++) {
				var obj = $scope.widgets[i];

				if(obj.id === widget_id) {
					$scope.widgets.splice(i, 1);
				}
			}
			ReportUtils.buildReportURL($scope.widgets);
		}
	};

	if ($scope.editingReport) {
		$scope.saveBtnText = "Update Report";
	}
	ReportUtils.buildReportFromURL($scope.widgets);

	$log.log($scope.editingReport);

}];
