/**
 * The main controller for the report builder.
 */
'use strict';

module.exports = ['$scope', '$log', '$routeParams', 'ReportUtils', '$location', '$window', 'helpers', '$q', '$controller', '$filter', '$sce', function($scope, $log, $routeParams, ReportUtils, $location, $window, helpers, $q, $controller, $filter, $sce) {
	angular.extend(this, $controller('mainCtrl', {$scope: $scope}));

	$scope.curDate = new Date();

	$scope.saveBtnText = "Save Report";

	$scope.saveReport = ReportUtils.saveReport;
	// $scope.deleteReport = ReportUtils.deleteReport;

	$scope.reportDateRange = [0, new Date()];
	$scope.reportFilters = [];
	$scope.reportFilter = '';

	$scope.reportType = 'activity';

	$scope.reportTypeOptions = [
		{label: 'Activity Report', value: 'activity'},
		{label: 'Expense Report', value: 'expense'},
	];

	$scope.activityReportPresets = [
		{label: 'KDE Activity Log Report', value: 'general'},
		{label: 'District Activity Report', value: 'district'},
		{label: 'Consultant Activity Report', value: 'user'},
	];

	$scope.expenseReportPresets = [
		{label: 'General Expense Report', value: 'general'},
		{label: 'District Expense Report', value: 'district'},
		{label: 'Consultant Expense Report', value: 'user'},
	];

	$scope.widgetOptions = [
		{label: 'Pie Chart', value: 'pie'},
		{label: 'Bar Graph', value: 'bar'},
	];

	$scope.reportFilterOpts = [
		{label: 'Date Range', value: 'date_range'},
		{label: 'User', value: 'user'},
		{label: 'Activity', value: 'activity_type'},
		{label: 'District', value: 'district'},
	];

	$scope.widgetYMetricOpts = [
		{label: 'Total Time Spent', value: 'time_spent'},
		{label: 'Total Expenses', value: 'total_expenses'},
	];

	$scope.widgetXMetricOpts = [
		{label: 'Users', value: 'user'},
		{label: 'Districts', value: 'districts'},
		{label: 'Schools', value: 'schools'},
	];

	$scope.widgetFilterLocationOpts = [
		{name: 'District', value: 'district'},
		{name: 'School', value: 'school'},
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


	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};


	$scope.tableSortInit = function(reportType) {
		$scope.reverse = false;
		$scope.propertyName = 'name';

		if (reportType === 'activity') {
			$scope.propertyName = 'activity_date_start';
		}
		if (reportType === 'expense') {
			$scope.propertyName = 'expense_sheet_start';
		}

	};


	$scope.setupRBData = function() {
		var promises = {
			users: helpers.getDeferredPosts('User', '', compileDeferredData),
			districts: helpers.getDeferredPosts('District', '', compileDeferredData),
			schools: helpers.getDeferredPosts('School', '', compileDeferredData),
			activities: helpers.getDeferredPosts('Activity_Type', '', compileDeferredData),
		};

		function dataCallback(value) {
			$scope.allUsers = value.users;
			$scope.reportUser = value.users[0];

			$scope.allDistricts = value.districts;
			$scope.reportDistrict = value.districts[0];

			$scope.allSchools = value.schools;
			$scope.reportSchool = value.schools[0];

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

		var newItemNo = helpers.getHighestWidgetID($scope.widgets) + 1;

		$scope.widgets.push({
			'id':'widget-'+newItemNo,
			'title': $scope.widgetTitle,
			'type': $scope.widgetType.value,
			'typeLabel': $scope.widgetType.label,
			'filter' : [
				{
					filterType: 'date_range',
					reportStartDate: $scope.reportDateRange[0],
					reportEndDate: $scope.reportDateRange[1]
				},
				{
					filterType: $scope.newWidgetLocSelect,
					filterData: $scope.newWidgetFilterSelect
				},
			],
			'metrics': {
				x: $scope.newWidgetXMetricSelect,
				y: $scope.newWidgetYMetricSelect
			}
		});

		ReportUtils.buildReportURL($scope.reportType, $scope.reportPreset, $scope.reportTitle, $scope.reportDateRange, $scope.reportFilter, $scope.widgets);

		// reset stuff
		$scope.widgetTitle = '';
		$scope.newWidgetFilterSelect = null;
		$scope.newWidgetLocSelect = $scope.widgetFilterLocationOpts[0];
		$scope.newWidgetXMetricSelect = $scope.widgetXMetricOpts[0];
		$scope.newWidgetYMetricSelect = $scope.widgetYMetricOpts[0];
	};


	$scope.destroyWidget = function(widget_id) {
		if (confirm("Are you sure you want to delete this report widget?")) {
			for(var i = 0; i < $scope.widgets.length; i++) {
				if($scope.widgets[i].id === widget_id) {
					$scope.widgets.splice(i, 1);
				}
			}

			// var $widgetsTemp = $scope.widgets;
			ReportUtils.buildReportURL($scope.reportType, $scope.reportPreset, $scope.reportTitle, $scope.reportDateRange, $scope.reportFilter, $scope.widgets);

			// $scope.widgets = [];
			// ReportUtils.buildReportFromURL($scope.reportFilter, $scope.widgets, function(reportData) {
			// 	$scope.buildReport(reportData);
			// });
			// $scope.widgets = $widgetsTemp;
		}
	};


	$scope.buildReport = function(reportData) {
		var datekeys, filtersData;
		$scope.datekeys = [];

		$scope.reportDateRange = [];

		$('.report-table-wrapper .spinner-wrap').hide();
		$scope.reportLoadingSpinner = $sce.trustAsHtml(helpers.makeSpinnerOverlay());
		$('.report-table-wrapper .spinner-wrap').fadeIn();

		if (reportData) {
			$scope.reportType = reportData.reportType;
			$scope.reportPreset = reportData.reportPreset;
			$scope.reportTitle = reportData.reportTitle;
			$scope.reportFilter = reportData.reportFilters;
			$scope.widgets = reportData.reportWidgets;
			$scope.reportDateRange.push(reportData.reportDateRange[0]);
			$scope.reportDateRange.push(reportData.reportDateRange[1]);
		} else {
			$scope.reportDateRange.push(helpers.dateToPDateTime($scope.reportStartDate));
			$scope.reportDateRange.push(helpers.dateToPDateTime($scope.reportEndDate));
		}

		switch ($scope.reportType) {
			case 'expense':
				$scope.reportPostType = 'Expense_Sheet';
				$scope.datekeys = ['expense_sheet_start','expense_sheet_end'];
				break;
			case 'activity':
			default:
				$scope.reportPostType = 'Activity_Log';
				$scope.datekeys = ['activity_date_start','activity_date_end'];
				break;
		}

		if (!reportData) {
			var userReportTitle = '';
			$log.log($scope.reportTitle);

			if (typeof $scope.reportTitle !== 'undefined') {
				userReportTitle = ' - ' + $scope.reportTitle;
			}

			if ($scope.reportPreset.value === 'custom') {
				$scope.reportTitle = 'Custom Report' + userReportTitle;
				filtersData = $scope.reportFilters;
			} else {
				$scope.reportTitle = $scope.reportPreset.label + userReportTitle;

				if ($scope.reportPreset.value === 'general') {
					$scope.reportTitle = 'KDE ' + $filter('titleCase')($scope.reportType) + ' Report For ' + $filter('date')(new Date($scope.reportDateRange[0]), 'mediumDate') + ' to ' + $filter('date')(new Date($scope.reportDateRange[1]), 'mediumDate') + userReportTitle;
					filtersData = [
						{
							filterType: 'date_range',
							reportStartDate: $scope.reportDateRange[0],
							reportEndDate: $scope.reportDateRange[1]
						}
					];
				}
				if ($scope.reportPreset.value === 'district') {
					$scope.reportTitle = 'District ' + $filter('titleCase')($scope.reportType) + ' Report For: ' + $scope.reportDistrict.name + userReportTitle;
					filtersData = [
						{
							filterType: 'district',
							reportDistrict: $scope.reportDistrict
						},
						{
							filterType: 'date_range',
							reportStartDate: $scope.reportDateRange[0],
							reportEndDate: $scope.reportDateRange[1]
						}
					];
				}
				if ($scope.reportPreset.value === 'user') {
					helpers.getPostData('User', $scope.reportUser.value, function(result) {
						$scope.reportTitle = 'Consultant ' + $filter('titleCase')($scope.reportType) + ' Report For: ' + result.first_name + ' ' + result.last_name + userReportTitle;
					});

					filtersData = [
						{
							filterType: 'user',
							reportUser: $scope.reportUser
						},
						{
							filterType: 'date_range',
							reportStartDate: $scope.reportDateRange[0],
							reportEndDate: $scope.reportDateRange[1]
						}
					];
				}
			}
		}

		$scope.reportFilter = helpers.buildQueryFilter(filtersData, $scope.reportPostType, $scope.datekeys);


		helpers.getPosts($scope.reportPostType, $scope.reportFilter, function(results) {
			if (results) {
				$scope.logs_data = results;

				if ($scope.reportPostType === 'Expense_Sheet') {
					for (var li = 0, ll = $scope.logs_data.length; li<ll; li++) {
						$scope.logs_data[li].expense_total = helpers.getTotalExpenses($scope.logs_data[li], $scope.globalSettings);
					}
				}
			}
		});

		$scope.reportBuilt = true;
		ReportUtils.buildReportURL($scope.reportType, $scope.reportPreset, $scope.reportTitle, $scope.reportDateRange, $scope.reportFilter, $scope.widgets);

		$window.onbeforeunload = function() {
			return true;
		};
	};


	$scope.$watch('reportType', function(value) {
		$log.log(value);
		if ($scope.reportBuilt === false) {
			if (value === 'activity') {
				$scope.curPresetOptions = $scope.activityReportPresets;
			}
			if (value === 'expense') {
				$scope.curPresetOptions = $scope.expenseReportPresets;
			}
			$scope.reportPreset = $scope.curPresetOptions[0];
		}
	});


	$scope.reportBuilderInit = function() {
		$scope.reportType = $scope.reportTypeOptions[0].value;
		$scope.curPresetOptions = $scope.activityReportPresets;

		$scope.reportPreset = $scope.curPresetOptions[0];

		$scope.editingReport = helpers.getURLParameter('edit');
		$scope.reportBuilt = false;
		if ($scope.editingReport) {
			$scope.reportBuilt = true;
		}

		$scope.chartControlsOpen = false;

		$scope.newWidgetFilterSelect = null;
		$scope.newWidgetLocSelect = $scope.widgetFilterLocationOpts[0];
		$scope.newWidgetXMetricSelect = $scope.widgetXMetricOpts[0];
		$scope.newWidgetYMetricSelect = $scope.widgetYMetricOpts[0];

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

	// Run the report builder init!
	$scope.reportBuilderInit();
}];
