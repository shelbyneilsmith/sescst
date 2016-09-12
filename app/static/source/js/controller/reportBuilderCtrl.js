/**
 * The main controller for report builder. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$log', '$routeParams', 'ReportUtils', '$location', '$window', 'helpers', '$q', '$controller', function($scope, $log, $routeParams, ReportUtils, $location, $window, helpers, $q, $controller) {
	angular.extend(this, $controller('mainCtrl', {$scope: $scope}));

	$scope.curDate = new Date();

	$scope.saveBtnText = "Save Report";

	$scope.saveReport = ReportUtils.saveReport;
	$scope.deleteReport = ReportUtils.deleteReport;

	$scope.filter_date_range = [0, new Date()];
	$scope.reportFilters = [];
	$scope.reportFilter = '';

	$scope.reportTypeOptions = [
		{label: 'Monthly Activity Report', value: 'monthly-activity-report'},
		{label: 'Monthly Expense Report', value: 'monthly-expense-report'},
		{label: 'District Report', value: 'district-report'},
		{label: 'Custom Report', value: 'custom-report'},
	];

	$scope.widgetOptions = [
		{label: 'Data Table', value: 'table'},
		{label: 'Pie Chart', value: 'doughnut'},
		{label: 'Bar Graph', value: 'bar'}
	];

	$scope.reportFilterOpts = [
		{label: 'Date Range', value: 'date_range'},
		{label: 'Activity', value: 'activity_type'},
		{label: 'District', value: 'district'},
	];

	// $scope.widgetFilterOpts = [
	// 	{label: 'Date Range', value: 'date_range'},
	// 	{label: 'Activity Type', value: 'activity_type'},
	// 	{label: 'District', value: 'district'},
	// ];

	$scope.widgetMetricOpts = [
		{label: 'Consultants', value: 'consultants'},
		{label: 'Schools', value: 'schools'},
		{label: 'Districts', value: 'districts'},
		{label: 'Activity Types', value: 'activity_types'},
	];

	var getNullVals = function(compareArr) {
		var nullArr = [];
		for (var i=0, l=compareArr.length; i<l; i++)  {
			nullArr.push(null);
		}
		return nullArr;
	};

	var createFilterObj = function($index) {
		return {
			'id': 'filter' + $index,
			'filterSelect': $scope.reportFilterOpts[0],
			'reportDistrict': $scope.allDistricts[0],
			'reportActivity': $scope.allActivities[0]
		};
	};

	var compileDeferredData = function(results, callback) {
		if (results) {
			var  postsObj, outputArr = [];

			for (var i = 0, l = results.length; i < l; i++) {
				postsObj = {};

				postsObj.name = results[i].name;
				postsObj.value = results[i].id;

				outputArr.push(postsObj);
			}

			callback(outputArr);
		}
	};

	$scope.setupRBData = function() {
		var promises = {
			availMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			availYears: [2014, 2015, 2016, 2017],
			districts: helpers.getDeferredPosts('District', '', compileDeferredData),
			activities: helpers.getDeferredPosts('Activity_Type', '', compileDeferredData),
		};

		function dataCallback(value) {
			$scope.availReportMonths = value.availMonths;
			$scope.reportMonth = $scope.curDate.getMonth();

			$scope.availReportYears = value.availYears;
			$scope.reportYear = $scope.curDate.getFullYear();

			$scope.allDistricts = value.districts;
			$scope.reportDistrict = value.districts[0];

			$scope.allActivities = value.activities;
			$scope.reportActivity = value.activities[0];

			$scope.reportFilters.push(createFilterObj(1));
		}

		$q.all(promises).then(dataCallback);
	};

	$scope.addReportFilter = function() {
		var newItemNo = $scope.reportFilters.length + 1;
		$scope.reportFilters.push(createFilterObj(newItemNo));
	};

	$scope.addNewWidget = function() {
		if (!$scope.widgetTitle || typeof $scope.widgetTitle === 'undefined') {
			$scope.widgetTitle = 'untitled';
		}
		var newItemNo = $scope.widgets.length + 1;
		var widgetType = $scope.widgetType.value;
		var widgetTypeLabel = $scope.widgetType.label;

		$scope.widgets.push({'id':'widget-'+newItemNo, 'title': $scope.widgetTitle, 'type':widgetType, 'typeLabel':widgetTypeLabel, 'metrics': $scope.newWidgetMetricSelect});

		ReportUtils.buildReportURL($scope.reportType, $scope.reportTitle, $scope.getPostType, $scope.reportFilter, $scope.widgets);

		// reset stuff
		$scope.widgetTitle = '';
		$scope.newWidgetFilterSelect = [];
		$scope.newWidgetMetricSelect = getNullVals($scope.widgetMetricOpts);
	};

	$scope.destroyWidget = function(widget_id) {
		if (confirm("Are you sure you want to delete this report widget?")) {
			for(var i = 0; i < $scope.widgets.length; i++) {
				var obj = $scope.widgets[i];

				if(obj.id === widget_id) {
					$scope.widgets.splice(i, 1);
				}
			}
			ReportUtils.buildReportURL($scope.reportType, $scope.reportTitle, $scope.getPostType, $scope.reportFilter, $scope.widgets);
		}
	};

	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};

	$scope.buildReport = function(reportData) {
		// $log.log(reportData);
		if (!reportData) {
			var userReportTitle = '';
			if (typeof $scope.reportTitle !== 'undefined') {
				userReportTitle = ' - ' + $scope.reportTitle;
			}

			if ($scope.reportType.value === 'custom-report') {
				var customerFilterType;
				$scope.reportTitle = 'Custom Report' + userReportTitle;

				$scope.reportFilter = '[';

				for (var i=0, l=$scope.reportFilters.length; i<l; i++) {
					customerFilterType = $scope.reportFilters[i].filterSelect.value;

					if (customerFilterType == 'date_range') {
						var dateStartKey, dateEndKey;
						$scope.filter_date_range[0] = new Date($scope.reportFilters[i].reportStartDate);
						$scope.filter_date_range[1] = new Date($scope.reportFilters[i].reportEndDate);
						if ($scope.getPostType === "Activity_Log") {
							dateStartKey = 'activity_date_start';
							dateEndKey = 'activity_date_end';
						}
						if ($scope.getPostType === "Expense_Sheet") {
							dateStartKey = 'expense_sheet_start';
							dateEndKey = 'expense_sheet_end';
						}
						$scope.reportFilter += $scope.getPostType + "." + dateStartKey + " >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', ";
						$scope.reportFilter += $scope.getPostType + "." + dateEndKey + " <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "'";
					}

					if (customerFilterType == 'district') {
						$scope.reportFilter += $scope.getPostType + ".districts.any(id=" + $scope.reportDistrict.value + ")";
					}

					if (customerFilterType == 'activity_type') {
						$scope.reportFilter += $scope.getPostType + ".activity_types.any(id=" + $scope.reportActivity.value + ")";
					}

					if (i < (l - 1)) {
						$scope.reportFilter += ', ';
					}
				}

				$scope.reportFilter += ']';
			} else {
				$scope.reportTitle = $scope.reportType.label + userReportTitle;

				if ($scope.reportType.value === 'monthly-activity-report') {
					$scope.reportTitle = 'Monthly Activity Report For ' + $scope.availReportMonths[$scope.reportMonth] + ', ' + $scope.reportYear + userReportTitle;

					$scope.filter_date_range[0] = new Date($scope.reportYear, $scope.reportMonth, 1);
					$scope.filter_date_range[1] = new Date($scope.reportYear, $scope.reportMonth + 1, 0);
					$scope.reportFilter = "[Activity_Log.activity_date_start >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', Activity_Log.activity_date_end <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "']";
				}
				if ($scope.reportType.value === 'monthly-expense-report') {
					$scope.getPostType = 'Expense_Sheet';
					$scope.reportTitle = 'Monthly Expense Report For ' + $scope.availReportMonths[$scope.reportMonth] + ', ' + $scope.reportYear + userReportTitle;

					$scope.filter_date_range[0] = new Date($scope.reportYear, $scope.reportMonth, 1);
					$scope.filter_date_range[1] = new Date($scope.reportYear, $scope.reportMonth + 1, 0);
					$scope.reportFilter = "[Expense_Sheet.expense_sheet_start >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', Expense_Sheet.expense_sheet_end <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "']";
				}
				if ($scope.reportType.value === 'district-report') {
					$scope.reportTitle = 'District Report For: ' + $scope.reportDistrict.name + userReportTitle;

					$scope.filter_date_range[0] = new Date($scope.reportStartDate);
					$scope.filter_date_range[1] = new Date($scope.reportEndDate);
					$scope.reportFilter = "[Activity_Log.districts.any(id=" + $scope.reportDistrict.value + "), Activity_Log.activity_date_start >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', Activity_Log.activity_date_end <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "']";
				}
			}
		} else {
			$scope.reportType = reportData.reportType;
			$scope.getPostType = reportData.getPostType;
			$scope.reportTitle = reportData.reportTitle;
			$scope.reportFilter = reportData.reportFilters;
			$scope.widgets = reportData.reportWidgets;
		}

		helpers.getPosts($scope.getPostType, $scope.reportFilter, function(results) {
			if (results) {
				$scope.logs_data = results;

				if ($scope.getPostType === 'Expense_Sheet') {
					for (var li = 0, ll = $scope.logs_data.length; li<ll; li++) {
						$scope.logs_data[li].expense_total = helpers.getTotalExpenses($scope.logs_data[li], $scope.globalSettings);
					}
				}
			}
		});

		$scope.reportBuilt = true;
		ReportUtils.buildReportURL($scope.reportType, $scope.reportTitle, $scope.getPostType, $scope.reportFilter, $scope.widgets);

		$window.onbeforeunload = function() {
			return true;
		};
	};

	$scope.tableSortInit = function(reportType) {
		$scope.reverse = false;
		$scope.propertyName = 'name';

		if (reportType === 'monthly-activity-report') {
			$scope.propertyName = 'activity_date_start';
		}
		if (reportType === 'monthly-expense-report') {
			$scope.propertyName = 'expense_sheet_start';
		}

	};


	$scope.reportBuilderInit = function() {
		$scope.getPostType = 'Activity_Log';
		$scope.reportType = $scope.reportTypeOptions[0];

		$scope.editingReport = helpers.getURLParameter('edit');
		$scope.reportBuilt = false;
		if ($scope.editingReport) {
			$scope.reportBuilt = true;
		}

		$scope.chartControlsOpen = false;
		$scope.newWidgetFilterSelect = [];
		$scope.newWidgetMetricSelect = getNullVals($scope.widgetMetricOpts);

		$scope.widgetType = $scope.widgetOptions[0];
		$scope.widgets = [];

		if ($scope.editingReport) {
			$scope.saveBtnText = "Update Report";
		}

		$scope.setupRBData ();

		ReportUtils.buildReportFromURL($scope.reportFilter, $scope.widgets, function(reportData) {
			$scope.buildReport(reportData);
		});

	};

}];
