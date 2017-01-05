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

'use strict';

module.exports = angular.module('sescst-forms', [])
	.controller('formCtrl', require('../controller/formCtrl'))

	.directive('formInclude', require('../directive/forms/formInclude'))

	.directive('formField', require('../directive/forms/formField'))

	.directive('hideshowpass', require('../directive/forms/hideShowPassword'))
	.directive('focusMe', require('../directive/forms/focusField'))
	// .directive('blurMe', require('../directive/forms/blurField'))

	.directive('multiSelectChecker', require('../directive/forms/multiSelectChecker'))

	.directive('select2Field', require('../directive/forms/select2Field'))
	.directive('datePickerField', require('../directive/forms/datePickerField'))
	.directive('repeater', require('../directive/forms/repeater'))
	.directive('simpleRepeaterForm', require('../directive/forms/simpleRepeaterForm'))
	.directive('complexRepeaterField', require('../directive/forms/complexRepeaterField'))

'use strict';

require('./utils');
require('./structure');
require('./forms');
require('./posts');
require('./settings');
require('./reports');

'use strict';

module.exports = angular.module('sescst-posts', [])
	.controller('PostCtrl', require('../controller/posts/postCtrl'))
	.controller('ActivityLogFormCtrl', require('../controller/posts/activityLogFormCtrl'))

	.directive('postfield', require('../directive/posts/postField'))

'use strict';

module.exports = angular.module('sescst-report-builder', [])
	.controller('reportBuilderCtrl', require('../controller/reportBuilderCtrl'))
	.directive('formFilters', require('../directive/reports/formFilters'))
	.directive('reportWidget', require('../directive/reports/reportWidget'))
	.directive('filterSelect', require('../directive/reports/filterSelect'))
	.directive('metricSelect', require('../directive/reports/metricSelect'))
	.directive('reportTable', require('../directive/reports/reportTable'))
	.directive('chartMetrics', require('../directive/reports/chartMetrics'));

module.exports = ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/',  {
			templateUrl: '../templates/staff-tools-index.html',
			controller: require('../controller/mainCtrl')
		})
		.when('/posts', {
			templateUrl: '../templates/post-list.html',
			controller: require('../controller/posts/postListCtrl')
		})
		.when('/post', {
			templateUrl: '../templates/single-post.html',
			controller: 'PostCtrl'
		})
		.when('/confirm', {
			templateUrl: '../templates/confirm.html',
			controller: require('../controller/confirmCtrl')
		// })
		// .otherwise({
		// 	redirectTo: '/'
		});

	// $locationProvider.html5Mode(true, false, false);
}];

// module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
// 	//
// 	// For any unmatched url, redirect to /state1
// 	// $urlRouterProvider.otherwise("/state1");
// 	//
// 	// Now set up the states
// 	$stateProvider
// 	.state('staff-tools-index', {
// 		url: "/",
// 		templateUrl: '../templates/staff-tools-index.html',
// 		controller: require('../controller/mainCtrl')
// 	})
// 	.state('post-list', {
// 		url: "/posts",
// 		templateUrl: '../templates/post-list.html',
// 		controller: require('../controller/postListCtrl')
// 	});
// }];

'use strict';

module.exports = angular.module('sescst-app-settings', [])
	.controller('appSettingsCtrl', require('../controller/appSettingsCtrl'))

	// .directive('roleManager', require('../directive/forms/roleManager'))

'use strict';

module.exports = angular.module('sescst-structure', [])
	.directive('sidebar', require('../directive/structure/sescSidebarDiv'))
	.directive('main', require('../directive/structure/sescMainDiv'))

	.controller('sescHeaderCtrl', require('../controller/structure/sescHeaderCtrl'))
	.controller('sescSidebarCtrl', require('../controller/structure/sescSidebarCtrl'))
	// .controller('sescMainCtrl', require('../controller/structure/sescMainCtrl'))
	.controller('sescFooterCtrl', require('../controller/structure/sescFooterCtrl'));

'use strict';

module.exports = angular.module('sescst-utils', [])
	.directive('jsonText', require('../directive/utils/jsonText'))
	.directive('dynamicElement', require('../directive/utils/dynamicElement'))
	.directive('staticInclude', require('../directive/utils/staticInclude'));

/**
 * The main controller for the application settings page. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$http', '$log', '$window', 'helpers', '$location', '$timeout', '$q', function($scope, $http, $log, $window, helpers, $location, $timeout, $q) {

	$scope.changeSettingPanel = function(panelID) {
		$scope.curPanel = panelID;
		$location.url(panelID);
	};


	$scope.curAppSettings = {};
	helpers.getPosts('AppSettings', '', function(results) {
		if (results) {
			for (var i = 0, l = results.length; i < l; i++) {
				$scope.curAppSettings[results[i].setting_name] = results[i].setting_val;

				if (helpers.isJson(results[i].setting_val)) {
					$scope.curAppSettings[results[i].setting_name] = JSON.parse(results[i].setting_val);
				}
			}
		}
	});

	$scope.getAppSettings = function(model, outputStructure) {
		var deferred = $q.defer();

		helpers.getPosts(model, '', function(results) {
			if (results) {
				var settingsObj, settingsOutputArr = [];

				// loop through setting results
				for (var i = 0, l = results.length; i < l; i++) {
					settingsObj = {};
					// loop through output structure array
					for (var o=0, ol=outputStructure.length; o < ol; o++) {
						settingsObj[outputStructure[o]] = results[i][outputStructure[o]];
					}

					settingsOutputArr.push(settingsObj);
				}

				deferred.resolve(settingsOutputArr);
			}
		});

		return deferred.promise;
	};

	$scope.getAppSettings('Role', ['name', 'description']).then(function(result) {
		$scope.curRoles = result;
	});

	$scope.getAppSettings('Activity_Type', ['name', 'description']).then(function(result) {
		$scope.curActivityTypes = result;
	});

	$scope.getAppSettings('Activity_Topic', ['name', 'description']).then(function(result) {
		$scope.curActivityTopics = result;
	});

	$scope.getAppSettings('Activity_Scope', ['name', 'description']).then(function(result) {
		$scope.curActivityScopes = result;
	});

	$scope.getAppSettings('Delivery_Method', ['name', 'description']).then(function(result) {
		$scope.curDeliveryMethods = result;
	});

	$scope.getAppSettings('School_Designation', ['name', 'description']).then(function(result) {
		$scope.curSchoolDesignations = result;
	});

	$scope.getAppSettings('Work_Day', ['name', 'description']).then(function(result) {
		$scope.curWorkDays = result;
	});

	$scope.getAppSettings('School_Type', ['name']).then(function(result) {
		$scope.curSchoolTypes = result;
	});

	$scope.getAppSettings('School_Level', ['name']).then(function(result) {
		$scope.curSchoolLevels = result;
	});

	$scope.getAppSettings('Location_Service', ['name']).then(function(result) {
		$scope.curDistrictSchoolServices = result;
	});

	$scope.saveAppSettings = function() {
		$log.log("Settings Saved!");

		$http.post('/api/save_app_settings', {
				roles: JSON.stringify($scope.curRoles.field_rows),
				activity_types: JSON.stringify($scope.curActivityTypes.field_rows),
				activity_topics: JSON.stringify($scope.curActivityTopics.field_rows),
				activity_scope: JSON.stringify($scope.curActivityScopes.field_rows),
				delivery_methods: JSON.stringify($scope.curDeliveryMethods.field_rows),
				school_designations: JSON.stringify($scope.curSchoolDesignations.field_rows),
				work_days: JSON.stringify($scope.curWorkDays.field_rows),
				school_types: JSON.stringify($scope.curSchoolTypes.field_rows),
				school_levels: JSON.stringify($scope.curSchoolLevels.field_rows),
				location_services: JSON.stringify($scope.curDistrictSchoolServices.field_rows),
				mileage_reimbursement: JSON.stringify($scope.curAppSettings.mileage_reimbursement),
				cell_reimbursement: JSON.stringify($scope.curAppSettings.cell_reimbursement),
				global_data_links: JSON.stringify($scope.curAppSettings.global_data_links)
			}).then(function(results) {
				$window.location.href = results;
				$window.location.reload();
				// $log.log(results.data);
			}, function(error) {
				$log.log(error);
			});
	};
}];

/**
 * The confirm page controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$window', 'modalService', function($scope, $routeParams, $http, $log, $filter, helpers, $window, modalService) {
	$scope.postType = $routeParams.post_type;
	$scope.postID = $routeParams.post_id;
	$scope.deleteRelType = $routeParams.delete_rel_type;
	$scope.deleteRelID = $routeParams.delete_rel_id;
	$scope.deleteRelMsg = $routeParams.delete_rel_msg;

	var action_url = $routeParams.action_url;
	var action_callback = $routeParams.action_callback;

	$scope.redirect = function(url) {
		$window.location.href = url;
		$window.location.reload();
	};

	$scope.deleteRelConfirm = function() {
		var modalOptions = {
			closeButtonText: 'No',
			actionButtonText: 'Yes',
			headerText: 'Delete Corresponding ' + $filter('underscoreless')($scope.deleteRelType) + '?',
			bodyText: $scope.deleteRelMsg
		};

		modalService.showModal({}, modalOptions).then(function(result) {
			$http.post('/api/delete_post', {'post_type': $scope.deleteRelType, 'post_id': $scope.deleteRelID})
				.then(function(results) {
					$scope['redirect'](results.data);
					// $log.log(results.data);
				}, function(error) {
					$log.log(error);
				});
		}, function() {
			$scope['redirect']('/#/posts?post_type=' + $scope.postType);
		});
	};

	$scope.confirm = function() {
		$http.post(action_url, {'post_type': $scope.postType, 'post_id': $scope.postID})
			.then(function(results) {
				$scope[action_callback](results.data);
				// $log.log(results.data);
			}, function(error) {
				$log.log(error);
			});
	};

	$scope.cancel = function() {
		window.history.back();
	};
}];

/**
 * The main controller for application forms. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$log', function($scope, $log) {
	// defaults
	$scope.passwordInputType = 'password';

}];

'use strict';

module.exports = angular.module('main-controller', [])
	.controller('mainCtrl', require('./mainCtrl'));

/**
 * The main controller for the staff tools app. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$rootScope', '$location', 'helpers', '$timeout', function($scope, $routeParams, $http, $log, $rootScope, $location, helpers, $timeout) {
	$timeout(function() {
		$('.alert').fadeOut('fast');
	}, 6000);

	// Get all application settings to be available throughout the application
	helpers.getPosts('AppSettings', '', function(results) {
		$scope.globalSettings = {};
		for (var i=0, l=results.length; i < l; i++) {
			if ((typeof results[i].setting_val === 'string') && helpers.isJson(results[i].setting_val)) {
				$scope.globalSettings[results[i].setting_name] = JSON.parse(results[i].setting_val)
			} else {
				$scope.globalSettings[results[i].setting_name] = results[i].setting_val
			}
		}
	});

	// Get the current user to be available throughout the application
	helpers.getCurrentUser(function(userData) {
		$scope.curUser = userData;
	});

}];

/**
 * The user registration controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', function($scope, $routeParams) {

}];

/**
 * The main controller for report builder. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$log', '$routeParams', 'ReportUtils', '$location', '$window', 'helpers', '$q', '$controller', '$filter', function($scope, $log, $routeParams, ReportUtils, $location, $window, helpers, $q, $controller, $filter) {
	angular.extend(this, $controller('mainCtrl', {$scope: $scope}));

	$scope.curDate = new Date();

	$scope.saveBtnText = "Save Report";

	$scope.saveReport = ReportUtils.saveReport;
	$scope.deleteReport = ReportUtils.deleteReport;

	$scope.filter_date_range = [0, new Date()];
	$scope.reportFilters = [];
	$scope.reportFilter = '';

	$scope.reportTypeOptions = [
		{label: 'Activity Report', value: 'activity'},
		{label: 'Expense Report', value: 'expense'},
	];

	$scope.activityReportPresets = [
		{label: 'KDE Activity Log Report', value: 'general'},
		{label: 'District Activity Report', value: 'district'},
		{label: 'Consultant Activity Report', value: 'user'},
		// {label: 'Custom Report', value: 'custom'},
	];

	$scope.expenseReportPresets = [
		{label: 'General Expense Report', value: 'general'},
		{label: 'District Expense Report', value: 'district'},
		{label: 'Consultant Expense Report', value: 'user'},
	];

	$scope.widgetOptions = [
		{label: 'Pie Chart', value: 'pie'},
		{label: 'Bar Graph', value: 'bar'},
		{label: 'Data Table', value: 'table'},
	];

	$scope.reportFilterOpts = [
		{label: 'Date Range', value: 'date_range'},
		{label: 'User', value: 'user'},
		{label: 'Activity', value: 'activity_type'},
		{label: 'District', value: 'district'},
	];

	// $scope.widgetFilterOpts = [
	// 	{label: 'Date Range', value: 'date_range'},
	// 	{label: 'Activity Type', value: 'activity_type'},
	// 	{label: 'District', value: 'district'},
	// ];

	$scope.widgetXMetricOpts = [
		{label: 'Users', value: 'user'},
		{label: 'Districts', value: 'districts'},
		{label: 'Schools', value: 'schools'},
		{label: 'Activity Types', value: 'activity_types'},
	];

	$scope.widgetYMetricOpts = {
		activity: [
			{ label: 'Total Time Spent', value: 'time_spent' },
		],
		expense: [
			{label: 'Total Time Spent', value: 'time_spent'},
			{label: 'Total Expenses', value: 'total_expenses'},
		],
	};

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
			// 'reportUser': $scope.allUsers[0],
			// 'reportDistrict': $scope.allDistricts[0],
			// 'reportActivity': $scope.allActivities[0]
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
			// availMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			// availYears: [2014, 2015, 2016, 2017],
			users: helpers.getDeferredPosts('User', '', compileDeferredData),
			districts: helpers.getDeferredPosts('District', '', compileDeferredData),
			activities: helpers.getDeferredPosts('Activity_Type', '', compileDeferredData),
		};

		function dataCallback(value) {
			// $scope.availReportMonths = value.availMonths;
			// $scope.reportMonth = $scope.curDate.getMonth();

			// $scope.availReportYears = value.availYears;
			// $scope.reportYear = $scope.curDate.getFullYear();

			$scope.allUsers = value.users;
			// $scope.reportUser = value.users[0];

			$scope.allDistricts = value.districts;
			// $scope.reportDistrict = value.districts[0];

			$scope.allActivities = value.activities;
			// $scope.reportActivity = value.activities[0];

			$scope.reportFilters.push(createFilterObj(1));
			// $scope.reportFilters[0].filterDetails = value.users[0];

		}

		$q.all(promises).then(dataCallback);
	};

	$scope.addReportFilter = function() {
		var newItemNo = $scope.reportFilters.length + 1;
		$scope.reportFilters.push(createFilterObj(newItemNo));
	};

	$scope.addNewWidget = function() {
		// $log.log($scope.newWidgetFilterSelect);

		if (!$scope.widgetTitle || typeof $scope.widgetTitle === 'undefined') {
			$scope.widgetTitle = 'untitled';
		}
		var newItemNo = $scope.widgets.length + 1;
		var widgetType = $scope.widgetType.value;
		var widgetTypeLabel = $scope.widgetType.label;

		$scope.widgets.push({'id':'widget-'+newItemNo, 'title': $scope.widgetTitle, 'type':widgetType, 'typeLabel':widgetTypeLabel, 'filter' : $scope.newWidgetFilterSelect, 'metrics': {x: $scope.newWidgetXMetricSelect, y: $scope.newWidgetYMetricSelect}});

		ReportUtils.buildReportURL($scope.reportType, $scope.reportPreset, $scope.reportTitle, $scope.reportFilter, $scope.widgets);

		// reset stuff
		$scope.widgetTitle = '';
		// $scope.newWidgetFilterSelect = {};
		$scope.newWidgetFilterSelect = {
			filterSelect: {},
			filterDetail: {}
		};
		$scope.newWidgetXMetricSelect = '';
		$scope.newWidgetYMetricSelect = '';
		// $scope.newWidgetMetricSelect = getNullVals($scope.widgetMetricOpts);
	};

	$scope.destroyWidget = function(widget_id) {
		if (confirm("Are you sure you want to delete this report widget?")) {
			for(var i = 0; i < $scope.widgets.length; i++) {
				var obj = $scope.widgets[i];

				if(obj.id === widget_id) {
					$scope.widgets.splice(i, 1);
				}
			}
			ReportUtils.buildReportURL($scope.reportType, $scope.reportPreset, $scope.reportTitle, $scope.reportFilter, $scope.widgets);
		}
	};

	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};

	$scope.buildReport = function(reportData) {
		if (reportData) {
			$scope.reportType = reportData.reportType;
			$scope.reportPreset = reportData.reportPreset;
			$scope.reportTitle = reportData.reportTitle;
			$scope.reportFilter = reportData.reportFilters;
			$scope.widgets = reportData.reportWidgets;
		}

		switch ($scope.reportType) {
			case 'expense':
				$scope.reportPostType = 'Expense_Sheet';
				dateStartKey = 'expense_sheet_start';
				dateEndKey = 'expense_sheet_end';
				break;
			case 'activity':
			default:
				$scope.reportPostType = 'Activity_Log';
				dateStartKey = 'activity_date_start';
				dateEndKey = 'activity_date_end';
				break;
		}

		if (!reportData) {
			var userReportTitle = '';
			var dateStartKey, dateEndKey;

			if (typeof $scope.reportTitle !== 'undefined') {
				userReportTitle = ' - ' + $scope.reportTitle;
			}

			if ($scope.reportPreset.value === 'custom') {
				var customerFilterType;
				$scope.reportTitle = 'Custom Report' + userReportTitle;

				$scope.reportFilter = '[';

				for (var i=0, l=$scope.reportFilters.length; i<l; i++) {
					customerFilterType = $scope.reportFilters[i].filterSelect.value;

					if (customerFilterType == 'date_range') {
						$scope.filter_date_range[0] = new Date($scope.reportFilters[i].reportStartDate);
						$scope.filter_date_range[1] = new Date($scope.reportFilters[i].reportEndDate);

						$scope.reportFilter += $scope.reportPostType + "." + dateStartKey + " >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', ";
						$scope.reportFilter += $scope.reportPostType + "." + dateEndKey + " <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "'";
					}

					if (customerFilterType == 'user') {
						$scope.reportFilter += $scope.reportPostType + ".user.has(id=" + $scope.reportFilters[i].reportUser.value + ")";
					}

					if (customerFilterType == 'district') {
						$scope.reportFilter += $scope.reportPostType + ".districts.any(id=" + $scope.reportFilters[i].reportDistrict.value + ")";
					}

					if (customerFilterType == 'activity_type') {
						$scope.reportFilter += $scope.reportPostType + ".activity_types.any(id=" + $scope.reportFilters[i].reportActivity.value + ")";
					}

					if (i < (l - 1)) {
						$scope.reportFilter += ', ';
					}
				}

				$scope.reportFilter += ']';
			} else {
				$scope.reportTitle = $scope.reportPreset.label + userReportTitle;

				$scope.filter_date_range[0] = new Date($scope.reportStartDate);
				$scope.filter_date_range[1] = new Date($scope.reportEndDate);

				if ($scope.reportPreset.value === 'general') {
					$scope.reportTitle = 'KDE ' + $filter('titleCase')($scope.reportType) + ' Report For ' + $filter('date')($scope.filter_date_range[0], 'mediumDate') + ' to ' + $filter('date')($scope.filter_date_range[1], 'mediumDate') + userReportTitle;
					$scope.reportFilter = "[" + $scope.reportPostType + "." + dateStartKey + " >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', " + $scope.reportPostType + "." + dateEndKey + " <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "']";
				}
				if ($scope.reportPreset.value === 'district') {
					$scope.reportTitle = 'District ' + $filter('titleCase')($scope.reportType) + ' Report For: ' + $scope.reportDistrict.name + userReportTitle;
					$scope.reportFilter = "[" + $scope.reportPostType + ".districts.any(id=" + $scope.reportDistrict.value + "), " + $scope.reportPostType + "." + dateStartKey + " >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', " + $scope.reportPostType + "." + dateEndKey + " <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "']";
				}
				if ($scope.reportPreset.value === 'user') {
					helpers.getPostData('User', $scope.reportUser.value, function(result) {
						$scope.reportTitle = 'Consultant ' + $filter('titleCase')($scope.reportType) + ' Report For: ' + result.first_name + ' ' + result.last_name + userReportTitle;
					});

					$scope.reportFilter = "[" + $scope.reportPostType + ".districts.any(id=" + $scope.reportUser.value + "), " + $scope.reportPostType + "." + dateStartKey + " >= '" + helpers.dateToPDateTime($scope.filter_date_range[0]) + "', " + $scope.reportPostType + "." + dateEndKey + " <= '" + helpers.dateToPDateTime($scope.filter_date_range[1]) + "']";
				}
			}
		}
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
		ReportUtils.buildReportURL($scope.reportType, $scope.reportPreset, $scope.reportTitle, $scope.reportFilter, $scope.widgets);

		$window.onbeforeunload = function() {
			return true;
		};
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

	$scope.$watch('reportType', function(value) {
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
		$scope.newWidgetFilterSelect = {};
		$scope.newWidgetXMetricSelect = '';
		$scope.newWidgetYMetricSelect = '';

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

/**
 * The user account management controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', function($scope, $routeParams, $http, $log, $filter, helpers) {
	$scope.userData = {};

	helpers.getPostData('User', $routeParams.id, function(results) {
		$scope.userData = results;
		// $log.log(results);
	});

}];

'use strict';

'use strict';

module.exports = angular.module('app-filters', [])
	.filter('keylength', function(){
		return function(input){
			if(!angular.isObject(input)){
				throw Error("Usage of non-objects with keylength filter!!");
			}
			return Object.keys(input).length;
		};
	})
	.filter('underscoreHyphen', function() {
		return function(input) {
			if (input) {
				return input.replace('-', '_');
			}
		};
	})
	.filter('underscoreless', function () {
		return function (input) {
			return input.replace(/_/g, ' ');
		};
	})
	.filter('num', function() {
		return function(input) {
			return parseInt(input, 10);
		};
	})
	.filter('parsejson', function() {
		return function(input) {
			var obj = JSON.parse(input);
			return obj;
		};
	})
	.filter('cellreimformat', ['$filter', '$http', '$log', function($filter, $http, $log) {
		var cached = {};
		var apiUrl = '/api/get_posts';
		function cellreimformatFilter(input) {
			if (input  || input === 0) {
				if (input in cached) {
					// avoid returning a promise!
					return typeof cached[input].then !== 'function' ? cached[input] : undefined;
				} else {
					cached[input] = $http.post(apiUrl, {"post_type": 'AppSettings', "post_filter": ''})
						.then(function(results) {
							var appSettings = results.data.posts;

							for (var i=0, l=appSettings.length; i < l; i++) {
								if (appSettings[i].setting_name === 'cell_reimbursement') {
									var globalcellreimrate = appSettings[i].setting_val * 100;

									if (input == globalcellreimrate) {
										cached[input] = "Full (" + $filter('currency')(globalcellreimrate / 100) + "/mo)";
									} else if (input == (globalcellreimrate * 0.5)) {
										cached[input] = "Half (" + $filter('currency')((globalcellreimrate / 100) * 0.5) + "/mo)";
									} else {
										cached[input] = "No Reimbursement";
									}
								}
							}
						}, function(error) {
							$log.log(error);
						});
				}
			}
		}

		cellreimformatFilter.$stateful = true;
		return cellreimformatFilter;
	}])
	.filter('repeaterTotal', ['$filter', function($filter) {
		return function(input, repeaterField, maxVal, totalFilter) {
			var total = 0;
			var rows = input.field_rows;

			for (var i=0, rl=rows.length; i<rl; i++) {
				for (var j=0,ol=rows[i].length; j<ol; j++) {
					if (rows[i][j].field_id === repeaterField) {
						total += rows[i][j].field_val;
					}
				}
			}

			if (typeof maxVal !== 'undefined' && total >= maxVal) {
				if (typeof totalFilter !== 'undefined') {
					return $filter(totalFilter)(maxVal) + ' (max)';
				} else {
					return maxVal + ' (max)';
				}
			}
			if (typeof totalFilter !== 'undefined') {
				return $filter(totalFilter)(total);
			} else {
				return total;
			}
		};
	}])
	.filter('titleCase', function() {
		return function(input) {
			input = input || '';
			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
	})
	.filter('linksList', function() {
		return function(input, titleKey, urlKey, subLevel) {
			var curTitle, curUrl;
			var linksList = "<ul>";

			for(var i=0, l=input.length; i<l; i++) {
				curTitle = input[i][titleKey];
				curUrl = input[i][urlKey];

				if (subLevel) {
					curTitle = input[i][0][titleKey];
					curUrl = input[i][1][urlKey];
				}

				linksList += "<li><a href='" + curUrl + "' title='" + curTitle + "'  target='_blank'>" + curTitle + "</a></li>";
			}
			linksList += "</ul>";

			return linksList;
		};
	})
	.filter('to_trusted', ['$sce', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter('displayFilterVal', ['helpers', '$filter', function(helpers, $filter) {
		return function(val, filterObj) {
			var outputVal = val;

			outputVal = val.name;

			if (filterObj.filterSelect.value === 'date_range') {
				var startDate = new Date(val.reportStartDate);
				var endDate = new Date(val.reportEndDate);

				outputVal = $filter('date')(startDate) + ' - ' + $filter('date')(endDate);
			}

			return outputVal;

		}
	}]);

'use strict';

require('./filters');

/**
 * The service for helper functions.
 */
'use strict';

module.exports = angular.module('helper-services', [])
	.factory('helpers', ['$http', '$log', '$q', function($http, $log, $q) {
		return {
			getCurrentUser: function(callback) {
				$http.get('/api/get_cur_user')
					.then(function(results) {
						callback(results.data.current_user[0]);
						// $log.log(results.data.current_user[0]);
					}, function(error) {
						$log.log(error);
					});
			},
			getPostID: function(postType, postName, callback) {
				$http.post('/api/get_post_id', {"post_type": postType, 'post_name': postName})
					.then(function(results) {
						// $log.log(results);
						callback(results.data.post_id);
					}, function(error) {
						$log.log(error);
					});
			},
			getPostData: function(postType, postID, callback) {
				$http.post('/api/get_post', {"post_type": postType, "id": postID})
					.then(function(results) {
						// $log.log(results.data);
						callback(results.data.post);
					}, function(error) {
						$log.log(error);
					});

			},
			getPosts: function(post_type, filter, callback) {
				filter = typeof filter !== 'undefined' ? filter : '';
				$http.post('/api/get_posts', {"post_type": post_type, "post_filter": filter})
					.then(function(results) {
						// $log.log(results);
						callback(results.data.posts);
					}, function(error) {
						$log.log(error);
					});
			},
			getDeferredPosts: function(post_type, filter, callback) {
				var deferred = $q.defer();
				$http.post('/api/get_posts', {"post_type": post_type, "post_filter": filter})
					.then(function(results) {
						// $log.log(results);
						callback(results.data.posts, function(returnData) {
							deferred.resolve(returnData);
						});
					}, function(error) {
						$log.log(error);
					});

				return deferred.promise;
			},
			isJson: function(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			},
			dateToPDateTime: function(date) {
				Number.prototype.padLeft = function(base,chr){
					var  len = (String(base || 10).length - String(this).length)+1;
					return len > 0? new Array(len).join(chr || '0')+this : this;
				}
				var datetime = [date.getFullYear(),
						(date.getMonth()+1).padLeft(),
						date.getDate().padLeft()].join('-')+' '+
						[date.getHours().padLeft(),
						date.getMinutes().padLeft(),
						date.getSeconds().padLeft()].join(':');
               			return datetime;
			},
			getObjByValue: function(arr, value) {
				var o;
				for (var i=0, l=arr.length; i<l; i++) {
					o = arr[i];

					for (var p in o) {
						if (o.hasOwnProperty(p) && o[p] === value) {
							return o;
						}
					}
				}
			},
			clone: function(obj) {
				if (null === obj || "object" != typeof obj) return obj;
				var copy = obj.constructor();
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
				}
				return copy;
			},
			arrayClean: function(arr, deleteValue) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === deleteValue) {
						arr.splice(i, 1);
						i--;
					}
				}
				return arr;
			},
			getURLParameter: function(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
			},
			removeURLParameter: function(url, parameter) {
				//prefer to use l.search if you have a location/link object
				var urlparts= url.split('?');
				if (urlparts.length>=2) {

					var prefix= encodeURIComponent(parameter)+'=';
					var pars= urlparts[1].split(/[&;]/g);

					//reverse iteration as may be destructive
					for (var i= pars.length; i-- > 0;) {
						//idiom for string.startsWith
						if (pars[i].lastIndexOf(prefix, 0) !== -1) {
							pars.splice(i, 1);
						}
					}

					url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
					return url;
				} else {
					return url;
				}
			},
			getTotalExpenses: function(postData, globalSettings) {
				var expense_total = 0;
				expense_total += (postData.total_mileage * (globalSettings.mileage_reimbursement * 0.01));
				/// HOW DOES CELL REIMBURSEMENT FIT IN??
				var expense_repeaters = [];

				expense_repeaters.push(typeof postData.itemized_meals === "string" ? JSON.parse(postData.itemized_meals) : postData.itemized_meals);
				expense_repeaters.push(typeof postData.hotel_reimbursement === "string" ? JSON.parse(postData.hotel_reimbursement) : postData.hotel_reimbursement);
				expense_repeaters.push(typeof postData.other_reimbursement === "string" ? JSON.parse(postData.other_reimbursement) : postData.other_reimbursement);

				for (var i=0, l=expense_repeaters.length; i<l; i++) {
					for(var r=0, rl=expense_repeaters[i].field_rows.length; r<rl; r++) {
						for (var f=0, fl=expense_repeaters[i].field_rows[r].length; f<fl; f++) {
							if ((expense_repeaters[i].field_rows[r][f].field_id === 'cost') || (expense_repeaters[i].field_rows[r][f].field_id === 'item_cost')) {
								expense_total += expense_repeaters[i].field_rows[r][f].field_val;
							}
						}
					}
				}

				return expense_total;
			},
		};
	}]);

'use strict';

require('./helpers');
require('./utilities');
require('./reports');

/**
 * The service for reports functions.
 */
'use strict';

module.exports = angular.module('reports-services', [])
	.factory('ReportUtils', require('./reports/reportUtilities'))
	.service('ColorRange', require('./reports/colorrange'))
	.service('WidgetTable', require('./reports/tables'))
	.service('WidgetChart', require('./reports/charts'));

/**
 * The service for utility functions.
 */
'use strict';

module.exports = angular.module('utility-services', [])
	.service('modalService', ['$uibModal', function($uibModal) {

		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: '../templates/partials/util/modal.html'
		};

		var modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};

		this.showModal = function(customModalDefaults, customModalOptions) {
			if (!customModalDefaults) customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};

		this.show = function(customModalDefaults, customModalOptions) {
			//Create temp object to work with since we're in a singleton service
			var tempModalDefaults = {};
			var tempModalOptions = {};

			//Map angular-ui modal custom defaults to modal defaults defined in service
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

			//Map modal.html $scope custom properties to defaults defined in service
			angular.extend(tempModalOptions, modalOptions, customModalOptions);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function($scope, $uibModalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function(result) {
						$uibModalInstance.close(result);
					};
					$scope.modalOptions.close = function(result) {
						$uibModalInstance.dismiss('cancel');
					};
				}
			}

			return $uibModal.open(tempModalDefaults).result;
		};
	}]);

/**
 * The activity log controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$window', function($scope, $routeParams, $http, $log, $window) {
	// $scope.createActivityLog = function(al_form_data, es_form_data) {
	// 	$log.log(al_form_data);
	// 	// $scope.saveActivityLog(function() {
	// 	// 	$scope.saveExpenseSheet(function() {
	// 	// 		// $window.location.href = '/#/posts?post_type=Activity_Log';
	// 	// 	});
	// 	// })
	// };

	$scope.saveActivityLog = function(callback) {
		$http.post('/api/save_activity_log', {})
			.then(function(results) {
				callback();
				$log.log(results.data);
			}, function(error) {
				$log.log(error.data);
			});
	};

	$scope.saveExpenseSheet = function(callback) {
		$http.post('/api/save_expense_sheet', {})
			.then(function(results) {
				callback();
				$log.log(results.data);
			}, function(error) {
				$log.log(error.data);
			});
	};
}];

/**
 * The single post view controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$sce', '$location', function($scope, $routeParams, $http, $log, $filter, helpers, $sce, $location) {
	$scope.postType = $routeParams.post_type;
	$scope.postData = {};

	$scope.singleTemplate = '../templates/partials/single/single-' + $filter('dasherize')($filter('lowercase')($scope.postType)) + '.html'

	helpers.getPostData($scope.postType, $routeParams.id, function(results) {
		$scope.postData = results;
		for (var key in $scope.postData) {
			if ($scope.postData.hasOwnProperty(key)) {
				if ((typeof $scope.postData[key] === 'string') && helpers.isJson($scope.postData[key])) {
					$scope.postData[key] = JSON.parse($scope.postData[key]);
				}
			}
		}

		// Reimbursement Totals for Expense Sheets
		if ($scope.postType === 'Expense_Sheet') {
			$scope.getTotalExpenses = helpers.getTotalExpenses;
			// $scope.postData.expense_total = helpers.getTotalExpenses($scope.postData, $scope.globalSettings);
		}
	});


	$scope.editAccess = function(post_id, post_type, admin_only) {
		var admin_only = typeof admin_only !== 'undefined' ? admin_only : false;
		if ($scope.curUser['urole'] === 'Administrator') {
			return true;
		}

		if (!admin_only) {
			if (post_type === "User") {
				if (post_id === $scope.curUser['id']) {
					return true;
				}
			}
		}

		return false;
	};

	$scope.deletePost = function(post_id, post_type) {
		var actionCallback, deleteRelMsg = '', deleteRelType = null, deleteRelID = null;
		if ($scope.postData.expense_sheet) {
			if (post_type === 'Activity_Log') {
				deleteRelMsg = 'Delete Related Expense Sheet as Well?';
				deleteRelID = $scope.postData.expense_sheet;
				deleteRelType = 'Expense_Sheet';
			}
		}
		if ($scope.postData.activity_log) {
			if (post_type === 'Expense_Sheet') {
				deleteRelMsg = 'Delete Related Activity Log as Well?';
				deleteRelID = $scope.postData.activity_log.id;
				deleteRelType = 'Activity_Log';
			}
		}

		if (deleteRelID) {
			actionCallback = 'deleteRelConfirm';
		} else {
			actionCallback = 'redirect';
		}
		$location.path('/confirm').search({post_id: post_id, post_type: post_type, action_url: '/api/delete_post', action_callback: actionCallback, delete_rel_type: deleteRelType, delete_rel_id: deleteRelID, delete_rel_msg: deleteRelMsg});
	};

}];

/**
 * The main controller for the staff tools app. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', '$templateCache', function($scope, $routeParams, $http, $log, $filter, $templateCache) {
	$scope.postType = $routeParams.post_type;
	$scope.postFilter = typeof $routeParams.post_filter !== 'undefined' ? $routeParams.post_filter : '';
	$scope.postFilterKey = typeof $routeParams.post_filter_key !== 'undefined' ? $routeParams.post_filter_key : '';
	$scope.postFilterVal = typeof $routeParams.post_filter_val !== 'undefined' ? $routeParams.post_filter_val : '';

	$scope.createPostURL = '/admin/create-' + $filter('dasherize')($filter('lowercase')($scope.postType));
	if ($scope.postType === 'Report_URL') {
		$scope.createPostURL = '/admin/report-builder';
	}

	// fire the API request
	$http.post('/api/get_posts', {"post_type": $scope.postType, "post_filter": $scope.postFilter})
		.then(function(results) {
			$scope.postList = results.data;

			$scope.getListTemplate = function() {
				if ($scope.postList.posts.length) {
					return '../templates/partials/archive/posts-' + $filter('dasherize')($filter('lowercase')($scope.postType)) + '.html';
				}
				return '../templates/partials/archive/empty-results.html';
			};
		}, function(error) {
			$log.log(error);
		});
}];

/**
 * The controller for the staff tools app footer. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', 'UserAuth', function($scope, $filter, UserAuth) {
	$scope.loggedIn = UserAuth.loggedIn;
}];

/**
 * The controller for the staff tools app header. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', 'UserAuth', function($scope, $filter, UserAuth) {
	$scope.loggedIn = UserAuth.loggedIn;
}];

/**
 * The controller for the staff tools app sidebar. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', '$location', '$log', function($scope, $filter, $location, $log) {
	$scope.initSettingsPanel = function() {
		if ($location.url() === '' || $location.url() === '/') {
			$scope.$parent.changeSettingPanel('access-roles');
		} else {
			$scope.$parent.changeSettingPanel($location.path().replace(/^\//, ''));
		}
	};

	// console.log($location.url());
	$scope.isActive = function (viewLocation) {
		var active = (viewLocation === $location.url());
		return active;
	};
}];

/**
 * The directive for the hide/show password checkbox feature.
 */
'use strict';

module.exports = ['$timeout', '$parse', function($timeout, $parse) {
	return {
		link: function(scope, elem, attrs) {
			elem.bind('blur', function(e) {
				scope.$apply(attrs.blurMe);
			});
		}
	};
}];

/**
 * The directive for more complex repeater fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', '$filter', 'config', function($http, $log, $timeout, $filter, config) {
	var tpl = "<div><label ng-if='label' for='{[ fieldName ]}'>{[ label ]}</label> \
		<input id='{[ fieldName ]}' name='{[ fieldName ]}' type='text' ng-hide='true' ng-model='serializedFieldVal'> \
		<table class='ui table'><thead><tr><th ng-repeat='f in fields track by $index'><strong>{[ f.field_label ]}</strong></th><th><button type='button' class='repeater-add btn btn-default' ng-click='addItem(\"{[ fieldName ]}\")' aria-label='Add Item' title='Add Item'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button></th></tr></thead> \
		<tr data-toggle='fieldset-entry' ng-repeat='i in getNumber(rows) track by $index'> \
		<td ng-repeat='f in fields track by $index'> \
		<form-field model='fieldModels[\"field_rows\"][$parent.$index][$index][\"field_val\"]' name='{[ fieldName ]}-{[ $parent.$index ]}-{[ f.field_id ]}' placeholder='{[ f.field_label ]}' type='{[ f.field_type ]}'></form-field> \
		</td> \
		<td><button ng-if='rows > 1' type='button' class='repeater-remove btn btn-default' ng-click='removeItem($parent.$index)' aria-label='Remove Item' title='Remove Item'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button></td> \
		</tr></table></div>";


	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldName: '@',
			label: '@',
			fields: '=',
			fieldModels: '=?model',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.rows = 1;
			$scope.serializedFieldVal = '';

			$scope.getNumber = function(num) {
				return new Array(num);
			};

			$scope.buildFieldsObj = function(filtered, curVal) {
				var $i, $j, $c, fieldObj, fieldID, filter, fieldVal, $rowsArr;
				curVal = typeof curVal !== 'undefined' ? curVal : {'field_rows': []};
				$rowsArr = curVal['field_rows'];

				for ($i=0; $i < $scope.rows; $i++) {
					if (!$rowsArr[$i]) {
						$rowsArr[$i] = [];
					}
					for ($j=0, $c=$scope.fields.length; $j < $c; $j++) {
						fieldObj = {};

						fieldObj['field_id'] = $scope.fields[$j]['field_id'];
						fieldObj['field_type'] = $scope.fields[$j]['field_type'];
						fieldObj['field_label'] = $scope.fields[$j]['field_label'];
						fieldObj['filter'] = $scope.fields[$j]['filter'];

						if (typeof $rowsArr[$i][$j] !== 'undefined') {
							fieldVal = $rowsArr[$i][$j]['field_val'];
						} else {
							fieldVal = '';
						}

						fieldObj['field_val'] = fieldVal;

						if (filtered) {
							filter = $scope.fields[$j]['filter'];
							if (filter) {
								if (filter === 'date') {
									fieldVal = $filter(filter)(fieldVal, config.dateFormat, config.dateOffset);
								} else {
									fieldVal = $filter(filter)(fieldVal);
								}
							}
						}
						$rowsArr[$i][$j] = fieldObj;
					}
				}

				return curVal;
			};

			$scope.updateModels = function() {
				$scope.fieldModels = $scope.buildFieldsObj(false, $scope.fieldModels);
				$scope.rows = $scope.fieldModels['field_rows'].length;
			};

			if (typeof $scope.fieldModels !== 'undefined' || typeof $scope.fields === 'undefined') {
				$timeout(function() {
					$scope.updateModels();
				}, 1000);
			} else {
				$scope.updateModels();
			}

			$scope.$watch('fieldModels', function(newValue) {
				if (typeof newValue !== 'undefined') {
					var $newValue = (JSON.parse(JSON.stringify(newValue)));
					var filteredValue = $scope.buildFieldsObj(true, $newValue);

					$scope.serializedFieldVal = JSON.stringify(filteredValue);
				}
			}, true);

		}],
		link: function(scope, elem, attrs) {

			scope.addItem = function() {
				scope.rows++;
				scope.updateModels();
			};
			scope.removeItem = function($index) {
				scope.fieldModels['field_rows'].splice($index, 1);
				scope.rows--;
				scope.updateModels();
			};

		}
	};
}];

/**
 * The directive for bootstrap datepicker fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', '$filter', function($http, $log, $timeout, $filter) {
	var tpl = "<div class='input-group date' data-provide='datepicker'> \
		<input id='{[fieldName]}' name='{[fieldName]}' type='text' class='form-control' ng-click='open()' uib-datepicker-popup='{[ format ]}' ng-model='dateInput' is-open='popup.opened' datepicker-options='dateOptions' ng-required='true' close-text='Close' alt-input-formats='altInputFormats' /> \
		<span class='input-group-btn'><button type='button' class='btn btn-default' ng-click='open()'><i class='glyphicon glyphicon-calendar'></i></button></span></div>";
	return {
		restrict: 'E',
		replace: true,
		scope: {
			'initDate': '=',
			'model': '=',
			'fieldName': '@',
		},
		template: tpl,
		controller: ['$scope', function($scope) {

			if ($scope.model) {
				$scope.model = new Date($scope.model);
				$scope.dateInput = $scope.model;

				$scope.$watch('dateInput', function(newValue) {
					$scope.model = newValue;
				});
			} else {
				if ($scope.initDate) {
					$scope.dateInput = new Date($scope.initDate);
				} else {
					$scope.dateInput = new Date();
				}
				$scope.$watch('dateInput', function(newValue) {
					$scope.model = $scope.dateInput;
				});
			}


			$scope.clear = function() {
				$scope.model = null;
			};

			$scope.inlineOptions = {
				customClass: getDayClass,
				minDate: new Date(),
				showWeeks: true
			};

			$scope.dateOptions = {
				// dateDisabled: disabled,
				formatYear: 'yy',
				maxDate: new Date(2020, 5, 22),
				minDate: new Date(),
				startingDay: 1
			};

			// Disable weekend selection
			function disabled(data) {
				var date = data.date,
				mode = data.mode;
				return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
			}

			$scope.toggleMin = function() {
				$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
				$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
			};

			$scope.toggleMin();

			$scope.open = function() {
				$scope.popup.opened = true;
			};

			$scope.formats = ["MMM d, y", 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];
			$scope.altInputFormats = ['M!/d!/yyyy'];

			$scope.popup = {
				opened: false
			};

			function getDayClass(data) {
				var date = data.date,
				mode = data.mode;
				if (mode === 'day') {
					var dayToCheck = new Date(date).setHours(0,0,0,0);

					for (var i = 0; i < $scope.events.length; i++) {
						var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

						if (dayToCheck === currentDay) {
							return $scope.events[i].status;
						}
					}
				}

				return '';
			}
		}],
		link: function(scope, elem, attrs) {
		}
	};
}];

/**
 * The directive for the hide/show password checkbox feature.
 */
'use strict';

module.exports = ['$timeout', '$parse', function($timeout, $parse) {
	return {
		scope: { trigger: '@focusMe' },
		link: function(scope, element, attrs) {
			scope.$watch('trigger', function(value) {
				if(value === "true") {
					$timeout(function() {
						element[0].focus();
					})
				}
			});
		}
	};
}];

/**
 * The directive for creating simple fields.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', function($http, $log, $templateCache, $compile, $templateRequest, $timeout) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldModel: '=?model',
			name: '@',
			placeholder: '@',
			type: '@',
			autoFocus: '@',
			selectOptions: '=?',
			simpleSelect: '=?',
			keyVal: '=?',
			rows: '@',
		},
		link: function(scope, element, attrs) {
			if (scope.type !== 'select' && scope.type !== 'multiselect') {
				scope.fieldModel = typeof scope.fieldModel !== 'undefined' ? scope.fieldModel : '';
			}
			// scope.$watch('fieldModel', function(newValue) {
			// 	$log.log(scope.fieldModel);
			// });

			$templateRequest('../templates/partials/forms/fields/' + scope.type + '.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});
		}
	};
}];

/**
 * The directive for including a dynamic form.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'E',
		scope: '=',
		template: '<ng-include src="template"/>',
		link: function(scope, element, attrs) {
			var formPrefix = attrs.type;
			scope.template = '../templates/partials/forms/' + formPrefix + '-form.html';
		}
	};
};

/**
 * The directive for the hide/show password checkbox feature.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'E',
		replace: true,
		scope: '=',
		templateUrl: '../templates/partials/forms/hideshow-password.html',
		link: function(scope) {
			scope.passwordInputType = 'password';

			scope.hideShowPassword = function() {
				if (scope.passwordInputType === 'password') {
					scope.passwordInputType = 'text';
				} else {
					scope.passwordInputType = 'password';
				}
			};
		}
	};
};

/**
 * The directive for the multi select field checker.
 */
'use strict';

module.exports = ['$compile',  function ($compile) {
	return {
		restrict: 'A',
		replace: false,
		terminal: true, //terminal means: compile this directive only
		priority: 50000, //priority means: the higher the priority, the "firster" the directive will be compiled
		compile: function compile(element, attrs) {
			element.removeAttr("multi-select-checker"); //remove the attribute to avoid indefinite loop
			element.removeAttr("data-multi-select-checker"); //also remove the same attribute with data- prefix in case users specify data-multi-select-checker in the html

			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {  },
				post: function postLink(scope, iElement, iAttrs, controller) {
					if(scope.options.Multiple === true) {
						iElement[0].setAttribute('multiple',''); //set the multiple directive, doing it the JS way, not jqLite way.
					}
					$compile(iElement)(scope);
				}
			};
		}
	};
}];

/**
 * The directive for repeater forms.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', 'helpers', '$filter', 'config', function($http, $log, $templateCache, $compile, $templateRequest, $timeout, helpers, $filter, config) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldName: '@',
			label: '@',
			fields: '=',
			repeaterType: '@',
			inData: '=?model',
		},
		link: function(scope, element, attrs) {
			scope.newItem = [];
			scope.editorFlags = [];

			$templateRequest('../templates/partials/forms/fields/' + scope.repeaterType + 'Repeater.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});

			var unbind = scope.$watch('inData', function(newValue) {
				var rowsLength;

				if (typeof newValue !== 'undefined') {
					rowsLength = newValue.length;

					if (newValue.hasOwnProperty('field_rows')) {
						rowsLength = newValue.field_rows.length;
					}

					if (scope.repeaterType === 'simple') {
						for(var i=0, l=rowsLength; i<l; i++) {
							scope.editorFlags.push({editing: false});
						}
					}

					scope.updateModels(newValue, false);

					unbind();
				} else {
					if (scope.repeaterType === 'complex') {
						scope.updateModels({'field_rows': ['']}, false);
					}
				}
			});


			scope.buildFieldsObj = function(filtered, curVal) {
				var $i, $l, $j, $c, rowData, fieldData, fieldVal;

				if (typeof curVal.field_rows !== 'undefined') {
					$l = curVal.field_rows.length;
				} else {
					if (curVal.length > 0) {
						$l = curVal.length;
					} else {
						$l = 1;
					}
				}

				var newVal = {'field_rows': []};
				if ((typeof scope.newItem !== 'undefined') && (scope.newItem.length > 0)) {
					newVal = typeof curVal.field_rows !== 'undefined' ? curVal : {'field_rows': []};
					$l = 1;
				}

				for ($i=0; $i < $l; $i++) {
					rowData = [];

					for ($j=0, $c=scope.fields.length; $j < $c; $j++) {
						fieldData = {};

						fieldData.field_id = scope.fields[$j].field_id;
						fieldData.field_label = scope.fields[$j].field_label;
						fieldData.field_type = scope.fields[$j].field_type;
						fieldData.filter = scope.fields[$j].filter;

						if ((typeof scope.newItem !== 'undefined') && (scope.newItem.length > 0) && scope.newItem[$j]) {
							fieldVal = scope.newItem[$j];
						} else {
							if ((typeof curVal.field_rows !== 'undefined') && (typeof curVal.field_rows[$i] !== 'undefined') && (typeof curVal.field_rows[$i][$j] !== 'undefined')) {
								fieldVal = curVal.field_rows[$i][$j].field_val;
							} else {
								if (typeof curVal[$i] !== 'undefined') {
									fieldVal = curVal[$i][scope.fields[$j].field_id];
								} else {
									fieldVal = '';
								}
							}
						}

						// if (filtered) {
						// 	filter = scope.fields[$j]['filter'];
						// 	if (filter) {
						// 		if (filter === 'date') {
						// 			fieldVal = $filter(filter)(fieldVal, config.dateFormat, config.dateOffset);
						// 		} else {
						// 			fieldVal = $filter(filter)(fieldVal);
						// 		}
						// 	}
						// }

						fieldData.field_val = fieldVal;

						rowData.push(fieldData);
					}

					newVal.field_rows.push(rowData);
				}

				return newVal;
			};

			scope.updateModels = function(data, filter) {
				scope.inData = scope.buildFieldsObj(filter, data);
			};

			scope.addItem = function() {
				if (scope.repeaterType === 'complex') {
					scope.inData.field_rows.push({});
				}

				scope.updateModels(scope.inData, false);

				if (scope.repeaterType === 'simple') {
					scope.editorFlags.push({editing: false});

					for (var i=0; i < scope.newItem.length; i++) {
						scope.newItem[i] = '';
					}
				}

			};

			scope.removeItem = function(index) {
				if (scope.repeaterType === 'simple') {
					scope.editorFlags.splice(index, 1);
				}

				scope.inData.field_rows.splice(index, 1);
			};

			scope.editItem = function(index) {
				scope.editorFlags[index].editing = !scope.editorFlags[index].editing;

				for (var i=0, l=scope.editorFlags.length; i<l; i++) {
					if ((i !== index) && scope.editorFlags[i].editing) {
						scope.editorFlags[i].editing = false;
					}
				}
			};
		}
	};
}];

/**
 * The directive for select2 fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', 'helpers', function($http, $log, $timeout, helpers) {
	var tpl = "<div class='select2container'> \
		<input id='{[ fieldName ]}' name='{[ fieldName ]}' type='text' ng-hide='true' ng-model='outputValue'> \
		<ui-select ng-model='$parent.selectModel' multi-select-checker style='min-width: {[ minWidth ]};'> \
		<ui-select-match allow-clear='true' placeholder='Select {[ label ]}'> \
		<span ng-if='!multiple'>{[$select.selected[optionKey]]}</span> \
		<span ng-if='multiple'>{[$item[optionKey]]}</span> \
		</ui-select-match> \
		<ui-select-choices repeat='item in (uiSelectOptions | filter: $select.search)' value='{[$select.selected[optionVal]]}''> \
		<span ng-bind-html='item[optionKey] | highlight: $select.search'></span> \
		</ui-select-choices></ui-select></div>";

	return {
		restrict: 'E',
		scope: {
			selectOptions: '=',
			model: '=?',
			keyVal: '=',
			multiple: '=',
			label: '@',
			fieldName: '@',
			minWidth: '@',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.options = {};
			$scope.options.Multiple = $scope.multiple;

			if ((typeof $scope.keyVal !== 'undefined') && (typeof $scope.keyVal[0] !== 'undefined')) {
				$scope.optionKey = $scope.keyVal[0];
				$scope.optionVal = $scope.keyVal[1];
			} else {
				if ($scope.selectOptions.only) {
					$scope.optionKey = $scope.selectOptions.only;
					$scope.optionVal = $scope.selectOptions.only;
				} else if ($scope.selectOptions.constructor.toString().indexOf("Array") !== -1) {
					$scope.optionKey = 0;
					$scope.optionVal = 1;
				} else {
					$scope.optionKey = $scope.model;
					$scope.optionVal = $scope.model;
				}
			}

			var buildSelectmodel = function(selectOptions) {
				$scope.uiSelectOptions = [];
				$scope.selectModel = '';

				if ($scope.selectOptions.allowAll) {
					$scope.optionsLabel = 'Options';
					if ($scope.label) {
						$scope.optionsLabel = $scope.label;
					}
					$scope.uiSelectOptions[0] = {};
					$scope.uiSelectOptions[0][$scope.optionKey] = 'All ' + $scope.optionsLabel;
					$scope.uiSelectOptions[0][$scope.optionVal] = 'all_options';
				}
				$scope.uiSelectOptions = $scope.uiSelectOptions.concat(selectOptions);

				if ($scope.selectOptions.only) {
					if ($scope.model) {
						$scope.selectModel = {};
						$scope.selectModel[$scope.optionKey] = $scope.model;
					}

					$scope.uiSelectOptions = [];
					for (var i=$scope.uiSelectOptions.length; i < selectOptions.length; i++) {
						$scope.uiSelectOptions[i] = {};
						$scope.uiSelectOptions[i][$scope.optionKey] = selectOptions[i][$scope.selectOptions.only];
						$scope.uiSelectOptions[i][$scope.optionVal] = selectOptions[i][$scope.selectOptions.only];
					}
				} else {
					if ($scope.model) {
						$scope.selectModel = $scope.model;
					}
				}
			};

			var buildAllValuesArr = function(optionKey) {
				var allValuesArr  = [];

				for (var i=1; i<$scope.uiSelectOptions.length; i++) {
					allValuesArr.push($scope.uiSelectOptions[i]);
					if (optionKey) {
						allValuesArr.push($scope.uiSelectOptions[i][optionKey]);
					}
				}
				return allValuesArr;
			};

			var unbindModelWatch = $scope.$watch('model', function(newValue) {
				if ($scope.selectOptions.constructor.toString().indexOf("Array") != -1) {
					buildSelectmodel($scope.selectOptions);
				} else {
					if (typeof $scope.selectOptions === 'object') {
						helpers.getPosts($scope.selectOptions.postType, $scope.selectOptions.postFilter, function(results) {
							buildSelectmodel(results);
						});
					}
				}

				$scope.$watch('selectModel', function(newValue) {
					$scope.outputValue = '';
					if (typeof newValue !== 'undefined') {
						if ($scope.selectOptions.only) {
							$scope.model = newValue[$scope.optionKey];
							$scope.outputValue = newValue[$scope.optionKey];
						} else if ($scope.selectOptions.constructor.toString().indexOf("Array") != -1) {
							$scope.model = newValue;
							$scope.outputValue = newValue[$scope.optionVal];
						} else {
							$scope.model = newValue;
							$scope.outputValue = newValue;

							if (typeof $scope.outputValue === "object") {
								$scope.outputValue = JSON.stringify($scope.outputValue);
							}
						}

						if (newValue.constructor === Array) {
							var allOptionsFound = newValue.some(function(el) {
								return el.id === 'all_options';
							});
							if (allOptionsFound) {
								if ($scope.selectOptions.only) {
									$scope.model = buildAllValuesArr($scope.optionKey);
									$scope.outputValue = buildAllValuesArr($scope.optionKey);
								} else if ($scope.selectOptions.constructor.toString().indexOf("Array") != -1) {
									$scope.model = buildAllValuesArr();
									$scope.outputValue = buildAllValuesArr($scope.optionVal);
								} else {
									$scope.model = buildAllValuesArr();
									$scope.outputValue = buildAllValuesArr();

									if (typeof $scope.outputValue === "object") {
										$scope.outputValue = JSON.stringify($scope.outputValue);
									}
								}

							}
						}
					}
				});

				// unbind after watching once
				unbindModelWatch();
			});

		}],
		link: function(scope, elem, attrs) {
		}
	};
}];

/**
 * The directive for simple repeater forms.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', 'helpers', function($http, $log, $templateCache, $compile, $templateRequest, $timeout, helpers) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			inData: '=data',
			fieldName: '@',
			label: '@',
			fields: '=',
		},
		controller: ['$scope', function($scope) {
			$scope.$watch('inData', function(newValue) {
				var clonedData = helpers.clone($scope.inData);
				if (typeof clonedData !== 'undefined') {
					$scope.curData = helpers.isJson(clonedData) ? JSON.parse(clonedData) : clonedData;
				} else {
					$scope.curData = [];
				}
				$scope.inData = JSON.stringify($scope.curData);
				$scope.newItem = [];

				$scope.editorFlags = [];
				for(var i=0, l=$scope.curData.length; i<l; i++) {
					$scope.editorFlags.push({editing: false});
				}
			});
		}],
		link: function(scope, element, attrs) {
			$templateRequest('../templates/partials/forms/fields/simpleRepeater.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});

			scope.addItem = function() {
				var i, l, dataOutput = {};
				for (i=0, l=scope.fields.length; i < l; i++) {
					var fieldName = scope.fields[i].fieldName;
					dataOutput[fieldName] = scope.newItem[i];
				}
				scope.curData.push(dataOutput);
				scope.inData = JSON.stringify(scope.curData);
				scope.newItem = [];
				scope.editorFlags.push({editing: false});
			};

			scope.removeItem = function(index) {
				scope.curData.splice(index, 1);
				scope.editorFlags.splice(index, 1);
				scope.inData = JSON.stringify(scope.curData);
			};

			scope.editItem = function(index) {
				if (scope.editorFlags[index].editing) {
					scope.inData = JSON.stringify(scope.curData);
				}

				scope.editorFlags[index].editing = !scope.editorFlags[index].editing;
			};

		}
	};
}];

/**
 * The directive for rendering editable post fields.
 */
'use strict';

module.exports = ['$compile', '$http', '$log', '$timeout', '$filter', 'helpers', 'config', function($compile, $http, $log, $timeout, $filter, helpers, config) {
	var tpl = "<form class='post-field' ng-submit='savePostField()'> \
		<ng-include src='fieldInclude'></ng-include> \
		<div ng-show='editMode' class='edit-controls'> \
		<a class='btn small btn-primary save-link' ng-click='savePostField()'>Save</a> \
		<a class='btn small btn-primary cancel-link' ng-click='closeEditField()'>Cancel</a> \
		</div> \
		</form>";

	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldType: "@type",
			label: "@",
			keys: "=",
			adminOnly: "=",
			relationship: '=',
			isTitle: '=',
			inData: '=fieldData',
			formattedOutput: '@?',
			simpleSelect: '=?',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.relation = typeof $scope.relationship !== 'undefined' ? $scope.relationship : false;
			$scope.editAccess = $scope.$parent.editAccess;
			$scope.postType = $scope.$parent.postType;
			$scope.postID = $scope.$parent.postData.id;

			$scope.editBtn = "<a ng-hide='$parent.editMode' class='edit-link' ng-click='$parent.editPostField()'>Edit</a>";

			$scope.fieldInclude = '../templates/partials/single/fields/' + $scope.fieldType + 'field.html';
			$scope.editMode = false;

			$scope.applyFilter = function(model, filter) {
				if (filter) {
					return $filter(filter)(model);
				} else {
					return model;
				}
			};

			$scope.$watch('formattedOutput', function(newValue) {
				if (newValue && (typeof $scope.fieldData !== 'undefined')) {
					$scope.fieldData.displayValue = newValue;
				}
			});

			$scope.$watch('inData', function(newValue) {
				// $timeout(function() {
					if (typeof newValue !== 'undefined') {
						var inDataVal = newValue.initValue;
						if ($scope.fieldType === 'repeater') {
							inDataVal = newValue.initValue;
						}
						if ($scope.fieldType === 'datetime') {
							inDataVal = $filter('date')(newValue.initValue, config.dateFormat, config.dateOffset);
						}

						$scope.fieldData = {displayValue: inDataVal, value: inDataVal, newValue: '', oldValue: null, selectOptions: $scope.selectOptions};
					}
					if (newValue && ($scope.fieldType === "select" || $scope.fieldType === "multiselect")) {
						if (typeof $scope.inData.selectOptions !== 'undefined') {
							$scope.selectOptions = $scope.inData.selectOptions;
						} else {
							$scope.optionsPostType = newValue.postType;
							$scope.optionsPostFilter = newValue.postFilter;
							$scope.optionsOnly = newValue.only;
							$scope.allowAllOptions = false;
							if (newValue.allowAll) {
								$scope.allowAllOptions = true;
							}
							$scope.selectOptions = {postType: $scope.optionsPostType, postFilter: $scope.optionsPostFilter, only: $scope.optionsOnly, allowAll: $scope.allowAllOptions};
						}

						if (newValue.optionKeyVal) {
							$scope.optionKey = newValue.optionKeyVal[0];
							$scope.optionVal = newValue.optionKeyVal[1];
						} else {
							if ($scope.optionsOnly) {
								$scope.optionKey = $scope.optionsOnly;
								$scope.optionVal = $scope.optionsOnly;
							} else {
								$scope.optionKey = 0;
								$scope.optionVal = 1;
							}
						}

						if ($scope.fieldData.value) {
							if ((typeof $scope.fieldData.value === 'object')) {
								$scope.fieldData.displayValue = $scope.fieldData.value[$scope.optionKey];
							} else {
								$scope.fieldData.displayValue = $scope.fieldData.value;
							}
							if($scope.fieldType === "multiselect") {
								$scope.fieldData.displayValue = [];

								if (typeof $scope.fieldData.value !== 'undefined') {
									for (var j=0; j < $scope.fieldData.value.length; j++) {
										if (typeof $scope.fieldData.value[j] === 'object') {
											$scope.fieldData.displayValue.push($scope.fieldData.value[j][$scope.optionKey]);
										} else {
											$scope.fieldData.displayValue.push($scope.fieldData.value[j]);
										}
									}
								}
							}
						}
					}
					if ($scope.formattedOutput) {
						$scope.fieldData.displayValue = $scope.formattedOutput;
					}
				// }, 500);
			});

			$scope.isArray = angular.isArray;
			$scope.testValueForArray = function(value) {
				if(angular.isArray(value)) {
					return value;
				} else {
					return [value];
				}
			};
		}],
		link: function(scope, element, attrs) {

			scope.editPostField = function() {
				if (scope.fieldData.value && (typeof scope.fieldData.displayValue !== 'undefined') && (typeof scope.fieldData.value !== 'undefined')) {
					scope.fieldData.oldDisplayValue = scope.fieldData.displayValue;

					if (scope.fieldData.value.constructor.toString().indexOf("Object") != -1) {
						scope.fieldData.oldValue = JSON.parse(JSON.stringify(scope.fieldData.value));
					} else {
						scope.fieldData.oldValue = scope.fieldData.value;
					}
				}

				$('#field-save-msg').fadeOut('fast', function() {
					$('#field-save-msg').remove();
				});
				scope.editMode = true;
			};

			scope.savePostField = function() {
				if (scope.fieldData.newValue) {
					scope.fieldData.displayValue = scope.fieldData.newValue;
					scope.saveValue = scope.fieldData.newValue;
					scope.fieldData.newValue = '';
				} else {
					scope.fieldData.displayValue = scope.fieldData.value;
					scope.saveValue = scope.fieldData.value;

					if (typeof scope.inData.selectOptions !== 'undefined') {
						if (scope.optionKey && scope.optionVal) {
							scope.fieldData.displayValue = scope.fieldData.value[scope.optionKey];
							scope.saveValue = scope.fieldData.value[scope.optionVal];
						}
					}

					if (scope.inData.optionKeyVal) {
						scope.fieldData.displayValue = scope.fieldData.value[scope.optionKey];

						if(scope.fieldType === "multiselect") {
							scope.fieldData.displayValue = [];

							for (var j=0; j < scope.fieldData.value.length; j++) {
								scope.fieldData.displayValue.push(scope.fieldData.value[j][scope.optionKey]);
							}
						}
					}
				}
				if (scope.formattedOutput) {
					scope.fieldData.displayValue = scope.formattedOutput;
				}

				scope.editMode = false;

				$http.post('/api/save_post_field', {post_id: scope.$parent.postData.id, post_type: scope.$parent.postType, field_key: scope.keys, field_value: scope.saveValue, relationship: scope.relation})
					.then(function(results) {
						jQuery(element[0]).append('<span id="field-save-msg" class="success">' + results.data.success + '</span>');
						scope.$parent.postData[scope.keys] = scope.saveValue;
						// $log.log(results.data);
					}, function(error) {
						jQuery(element[0]).append('<span id="field-save-msg" class="error">' + error.data.error + '</span>');
						$log.log(error.data);
					});

				if ($('#field-save-msg').length > 0) {
					$timeout(function() {
						$('#field-save-msg').fadeOut('fast', function() {
							$('#field-save-msg').remove();
						});
					}, 6000);
				}
			};

			scope.closeEditField = function() {
				if (scope.fieldData.value !== scope.fieldData.oldValue) {
					if (scope.fieldType !== 'datetime') {
						scope.fieldData.displayValue = scope.fieldData.oldDisplayValue;
						scope.fieldData.value = scope.fieldData.oldValue;
						scope.fieldData.oldValue = null;
					}
				}
				scope.editMode = false;
			};

			scope.addItem = function() {
				var fieldKeys = Object.keys(scope.fieldData.displayValue[0]);
				scope.fieldData.displayValue[scope.fieldData.displayValue.length] = {};
				for (var i=0; i < fieldKeys.length; i++) {
					scope.fieldData.displayValue[scope.fieldData.displayValue.length - 1][fieldKeys[i]] = '';
				}
			};

			scope.removeItem = function($index) {
				scope.fieldData.displayValue.splice($index, 1);
			};

		}
	};
}];

module.exports = ['helpers', '$log', function(helpers, $log) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			axis: '@',
			model: '=',
			metricOpts: '=opts',
		},
		templateUrl: '../templates/partials/reports/chart-metrics.html',
		controller: function($scope) {
		},
		link: function(scope, element, attrs) {
		}
	};
}];

module.exports = ['$log', 'helpers', function($log, helpers) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../templates/partials/reports/report-filter.html',
		link: function(scope, element, attrs) {
			scope.filter.filterDetail = {};

			scope.$watch('filter.filterDetail', function(newValue) {
				scope.newWidgetFilterSelect = {
					filterSelect: scope.filter.filterSelect,
					filterDetail: {}
				};

				if (scope.filter.filterDetail.hasOwnProperty('reportStartDate') && scope.filter.filterDetail.hasOwnProperty('reportEndDate')) {
					if (scope.filter.filterDetail.hasOwnProperty('name')) {
						delete scope.filter.filterDetail.name;
					}
					if (scope.filter.filterDetail.hasOwnProperty('value')) {
						delete scope.filter.filterDetail.value;
					}

					scope.filter_date_range[0] = new Date(scope.filter.filterDetail.reportStartDate);
					scope.filter_date_range[1] = new Date(scope.filter.filterDetail.reportEndDate);
					scope.newWidgetFilterSelect.filterDetail.reportStartDate = helpers.dateToPDateTime(scope.filter_date_range[0]);
					scope.newWidgetFilterSelect.filterDetail.reportEndDate = helpers.dateToPDateTime(scope.filter_date_range[1]);
				} else {
					scope.newWidgetFilterSelect.filterDetail = scope.filter.filterDetail;
				}
			}, true);
		}
	};
}];

module.exports = [function() {
	var tpl = "{{ widget.id }} - {{ widget.type }} \
			<label>Filter By:</label> \
			<select class='form-control' ng-options='option.value as option.name for option in widgetFilters'> \
			<option>--select filter control--</option> \
			</select> \
			<input type='submit' class='btn btn-primary btn-sm' value='Add Another Filter' />";

	return {
		restrict: 'E',
		replace: true,
		template: tpl,
		link: function(scope, element, attrs) {
		}
	};
}];

module.exports = [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../templates/partials/reports/widget-metric.html',
		link: function(scope, element, attrs) {
		}
	};
}];

module.exports = ['$templateRequest', '$compile', function($templateRequest, $compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			type: '@',
		},
		// templateUrl: '../templates/partials/reports/report-tables/' + $scope.type + '.html',
		link: function(scope, element, attrs) {
			// console.log(scope.type);
			$templateRequest('../templates/partials/reports/report-tables/' + scope.type + '.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});
		}
	};
}];

module.exports = ['$timeout', 'WidgetTable', 'WidgetChart', '$log', 'helpers', 'ReportUtils', function($timeout, WidgetTable, WidgetChart, $log, helpers, ReportUtils) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../templates/partials/reports/widget-template.html',
		controller: function($scope) {
			$scope.widgetTitleEdit = false;
			$scope.widgetTypeEdit = false;
			// $scope.filtersCollapsed = true;
			$scope.metricsCollapsed = true;

			$scope.metrics = {};
			// $scope.filters = $scope.widget.filters !== 'undefined' ? $scope.widget.filters : [{'id': 'filter1', 'filterSelect': $scope.widgetFilterOpts[0]}];
			// $scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics :  [{'id': 'metric1', 'metricSelect': $scope.widgetMetricOpts[0]}];
			// $scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics :  [$scope.widgetMetricOpts[0]];
			$scope.metrics.x = $scope.widget.metrics.x !== 'undefined' ? $scope.widget.metrics.x : [$scope.widgetXMetricOpts[0]];
			$scope.metrics.y = $scope.widget.metrics.y !== 'undefined' ? $scope.widget.metrics.y : [$scope.widgetYMetricOpts[$scope.$parent.reportType][0]];
			// $log.log($scope.metrics);

		},
		link: function(scope, element, attrs) {

			// scope.addWidgetFilter = function() {
			// 	var newItemNo = scope.filters.length + 1;
			// 	scope.filters.push({'id':'filter'+newItemNo, 'filterSelect':scope.widgetFilterOpts[0]});
			// };


			// scope.addWidgetMetric = function() {
			// 	var newItemNo = scope.filters.length + 1;
			// 	scope.metrics.push({'id':'metric'+newItemNo, 'metricSelect':scope.widgetMetricOpts[0]});
			// };


			var getXMetricPT = function(input) {
				var postType;

				switch(input) {
					case 'user':
						postType = "User";
						break;
					case 'districts':
						postType = "District";
						break;
					case 'schools':
						postType = "School";
						break;
					case 'activity_types':
						postType = "Activity_Type";
						break;
					default:
						postType = null;
				}

				return postType;
			};


			// var renderWidgetData = function(filtersLength, metricsLength) {
			var renderWidgetData = function() {
				scope.chartData = [];
				var filterStr = '';

				// var filters = [];

				// if(!filtersLength) {
				// 	for (var f=0, fl=scope.filters.length; f<fl; f++) {
				// 		filters.push(scope.filters[f].filterSelect);
				// 	}
				// 	scope.widget.filters = filters;
				// } else {
				// 	filters = scope.widget.filters;
				// }


				// var metrics = [];

				// if(!metricsLength) {
				// 	for (var m=0, ml=scope.metrics.length; m<ml; m++) {
				// 		// if (scope.metrics[m] && typeof scope.metrics[m] !== 'undefined') {
				// 			// metrics.push(scope.metrics[m].metricSelect);
				// 			metrics.push(scope.metrics[m]);
				// 		// }
				// 	}
				// 	scope.widget.metrics = metrics;
				// } else {
				// 	metrics = scope.widget.metrics;
				// }

				var postData, metricPT, metricObj, chartDataArr = [];

				var chartDataCallback = function(metricXData, metricYData) {
					return function(results) {
						var chartLabels = [];
						var chartData = [];
						// var metricObj = {};

						for (var i=0, l=results.length; i<l; i++) {
							if (metricXData.value === 'user') {
								chartLabels.push(results[i].first_name + ' ' + results[i].last_name);
							} else {
								chartLabels.push(results[i].name);
							}

							// if (metricXData.value === 'districts' || metricXData.value === 'schools') {
							// }

							if (metricYData.value === 'time_spent') {
								// $log.log(scope.$parent.logs_data);
								chartData.push(ReportUtils.calcTimeSpent(results[i], metricXData.value, scope.$parent.logs_data));
							}
							// metricObj.label = metricData.label;
							// metricObj.value = results.length;

							// scope.chartData.push(metricObj);
						}

						if (typeof scope.chartElem !== 'undefined') {
							// $log.log(chartLabels);
							if (element.chart) {
								element.chart.destroy();
							}
							if (scope.widget.type !== 'table') {
								element.chart = WidgetChart.makeChart(scope.widget.type, scope.chartElem, chartLabels, chartData);
							} else {
								element.chart = WidgetTable.makeTable({});
							}
						}
					};
				};

				// if (metrics) {
					// for (var m=0, ml=metrics.length; m<ml; m++) {
						if ((scope.widget.metrics.x && typeof scope.widget.metrics.x !== 'undefined') && (scope.widget.metrics.y && typeof scope.widget.metrics.y !== 'undefined'))  {

							// postData = getPosts(metricPT, filterStr, postDataCallback(metricObj));
							metricXPT = getXMetricPT(scope.widget.metrics.x.value);
							helpers.getPosts(metricXPT, filterStr, chartDataCallback(scope.widget.metrics.x, scope.widget.metrics.y));

							// if (scope.widget.metrics.y && typeof scope.widget.metrics.y !== 'undefined') {
								// if (scope.widget.metrics.y.value === 'time_spent') {
									// ReportUtils.processYMetric(scope.widget.metrics.y.value, metricXPT, filterStr, chartDataCallback(scope.widget.metrics.y, function(results, returnObj) {
									// 	$log.log(results);

									// 	returnObj.label = scope.widget.metrics.y.label;
									// 	returnObj.value = results.length;

									// 	return returnObj;
									// }));
								// }
								// if (scope.widget.metrics.y.value === 'total_expenses') {
								// 	ReportUtils.processYMetric(metricXPT, filterStr, chartDataCallback(scope.widget.metrics.y))
								// }
							// }
						}
					// }
				// }

				// return [{label: "Red", value: 300}, {label: "Green", value: 50}, {label: "Yellow",  value: 100}, {label: "Fart", value: 666}, {label: "WHUHUHHHH", value: 43}];
				return scope.chartData;
			};

			scope.updateWidgetTitle = function(action) {
				if (action === 'save') {
					scope.widget.title = scope.widgetNewTitle;
					ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportPreset, scope.$parent.reportTitle, scope.$parent.reportFilter, scope.$parent.widgets);
				} else if (action === 'cancel') {
					scope.widgetNewTitle = scope.widget.title;
				}
				scope.widgetTitleEdit = false;
			};

			scope.updateWidgetType = function(action) {
				if (action === 'save') {
					var type = scope.selectedWidgetType;
					scope.widget.type = type.value;
					scope.widget.typeLabel = type.label;
					scope.updateWidget();
				}
				scope.widgetTypeEdit = false;
			};

			// scope.updateWidget = function(initFiltersNum, initMetricsNum) {
			scope.updateWidget = function() {
				renderWidgetData();
				// renderWidgetData(initFiltersNum, initMetricsNum);
				ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportPreset, scope.$parent.reportTitle, scope.$parent.reportFilter, scope.$parent.widgets);
			};

			scope.compileMetricsGroup = function(inGroup, outArr) {
				var metricsLength = typeof inGroup !== 'undefined' ? inGroup.length : 0;

				if(metricsLength) {
					for(var m=0; m<metricsLength; m++) {
						if (inGroup[m] && typeof inGroup[m] !== 'undefined') {
							widgetMetricOpt = helpers.getObjByValue(scope.widgetMetricOpts, inGroup[m].value);
						} else {
							widgetMetricOpt = null;
						}

						outArr.push(widgetMetricOpt);
					}
				}
			};

			scope.widgetInit = function() {
				$timeout(function() {
					// var widgetFilterOpt, widgetMetricOpt;
					// var filtersLength = typeof scope.widget.filters !== 'undefined' ? scope.widget.filters.length : 0;
					// var metricsXLength = typeof scope.widget.metrics.x !== 'undefined' ? scope.widget.metrics.x.length : 0;
					// var metricsYLength = typeof scope.widget.metrics.y !== 'undefined' ? scope.widget.metrics.y.length : 0;

					// if(filtersLength) {
					// 	scope.filters = [];
					// 	for(var f=0; f<filtersLength; f++) {
					// 		widgetFilterOpt = helpers.getObjByValue(scope.widgetFilterOpts, scope.widget.filters[f].value);
					// 		scope.filters.push({'id':'filter'+f, 'filterSelect':widgetFilterOpt});
					// 	}
					// }
					// if(metricsXLength) {
					// 	scope.metrics.x = [];
					// 	for(var m=0; m<metricsLength; m++) {
					// 		if (scope.widget.metrics.x[m] && typeof scope.widget.metrics.x[m] !== 'undefined') {
					// 			widgetMetricOpt = helpers.getObjByValue(scope.widgetMetricOpts, scope.widget.metrics[m].value);
					// 		} else {
					// 			widgetMetricOpt = null;
					// 		}
					// 		// scope.metrics.push({'id':'metric'+m, 'metricSelect':widgetMetricOpt});
					// 		scope.metrics.push(widgetMetricOpt);
					// 	}
					// }
					// scope.metrics.x = [];
					// scope.metrics.y = [];
// $log.log(scope.widget.metrics.x);
					scope.compileMetricsGroup(scope.widget.metrics.x, scope.metrics.x);
					scope.compileMetricsGroup(scope.widget.metrics.y, scope.metrics.y);


					scope.selectedWidgetType = helpers.getObjByValue(scope.widgetOptions, scope.widget.type);
					scope.chartElem = document.getElementById(scope.widget.id + '-' + scope.widget.type);

					renderWidgetData();
					// renderWidgetData(filtersLength, metricsLength);
					// scope.makeWidget(filtersLength, metricsLength);
				}, 300);
			};

			scope.widgetInit();

		}
	};
}];

/**
 * The directive for the app main ara.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: '=',
		templateUrl: '../templates/partials/sescst-main.html',
		controller: 'mainCtrl'
	};
};

/**
 * The directive for the app sidebar.
 */
'use strict';

module.exports = ['$log', function($log) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			type: '@',
		},
		template:'<ng-include src="tpl"/>',
		controller: 'sescSidebarCtrl',
		link: function(scope, element, attrs) {
			// $log.log(scope.type);
			scope.tpl = '../templates/partials/sidebar/sidebar-main.html';
			if (scope.type) {
				scope.tpl = '../templates/partials/sidebar/sidebar-' + scope.type + '.html';
			}
		}
	};
}];

/**
 * The directive for rendering and compiling dynamic html elements.
 */
'use strict';

module.exports = ['$compile', function ($compile) {
	return {
		restrict: 'E',
		scope: {
			html: "="
		},
		replace: true,
		link: function(scope, element, attrs) {
			var template = $compile(scope.html)(scope);
			element.replaceWith(template);
		},
	};
}];

/**
 * The directive for jsonText fields.
 */
'use strict';

module.exports = [function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			var lastValid;

			ngModelCtrl.$parsers.push(fromUser);
			ngModelCtrl.$formatters.push(toUser);

			element.bind('blur', function() {
				element.val(toUser(scope.$eval(attrs.ngModel)));
			});

			scope.$watch(attrs.ngModel, function(newValue, oldValue) {
				lastValid = lastValid || newValue;

				if (newValue !== oldValue) {
					ngModelCtrl.$setViewValue(toUser(newValue));

					ngModelCtrl.$render();
				}
			}, true);

			function fromUser(text) {
				if (!text || text.trim() === '') {
					return {};
				} else {
					try {
						lastValid = angular.fromJson(text);
						ngModelCtrl.$setValidity('invalidJson', true);
					} catch(e) {
						ngModelCtrl.$setValidity('invalidJson', false);
					}
					return lastValid;
				}
			}

			function toUser(object) {
				return angular.toJson(object, true);
			}
		}
	};
}];

/**
 * The directive for rendering static includes.
 */
'use strict';

module.exports = ['$templateRequest', '$compile', function($templateRequest, $compile) {
	return {
		restrict: 'A',
		transclude: true,
		replace: true,
		scope: false,
		link: function($scope, element, attrs, ctrl, transclude) {
			var templatePath = attrs.staticInclude;

			$templateRequest(templatePath)
				.then(function(response) {
					var contents = element.html(response).contents();
					$compile(contents)($scope.$new(false, $scope.$parent));
				});
		}
	};
}];

module.exports = ['ColorRange', '$log', function(ColorRange, $log) {
	var availColors, chartData, chartOptions;
	var WidgetChart = {};

	WidgetChart.makeChart = function(chartType, chartCanvas, chartLabels, chartDataVals, chartOptions) {
		var chartLabels, chartDataValues, chartDataSets, bgColor;
		var chartCtx = chartCanvas.getContext("2d")
		var midX = chartCanvas.width/2;
		var midY = chartCanvas.height/2

		// chartLabels = [];
		// chartDataValues = [];
		// for(var o in chartData) {
		// 	chartLabels.push(chartData[o].label);
		// 	chartDataValues.push(chartData[o].value);
		// }

		availColors = ColorRange.getColorRange(chartLabels.length);

		if (chartType === 'doughnut' || chartType === 'pie') {
			bgColor = availColors;
			chartOptions = {
				// fullWidth: false
				// showTooltips: false,
				// tooltips: {
				// 	enabled: false,
				// },
				// animation: {
				// 	onProgress: drawSegmentValues,
				// }
			};
		} else if (chartType === 'bar') {
			bgColor = availColors[0];
			chartOptions = {
				// fullWidth: false
			};
		}

		chartDataSets = [
			{
				// label: "Metric Label",
				data: chartDataVals,
				backgroundColor: bgColor,
			}
		];

		chartData = {
			labels: chartLabels,
			datasets: chartDataSets
		};

		var thisChart = new Chart(chartCtx, {
			type: chartType,
			data: chartData,
			options: chartOptions,
		});

		// var thisChart = new Chart(chartCtx).Pie(chartData, {
		// 	showTooltips: false,
		// 	onAnimationProgress: drawSegmentValues
		// });

		// var radius = thisChart.outerRadius;

		// function drawSegmentValues() {
		// 	$log.log('hey!');

		// 	for (var i=0; i<thisChart.segments.length; i++) {
		// 		chartCtx.fillStyle="white";
		// 		var textSize = chartCanvas.width/10;
		// 		chartCtx.font = textSize + 'px Verdana';
		// 		// Get needed variables
		// 		var value = thisChart.segments[i].value;
		// 		var startAngle = thisChart.segments[i].startAngle;
		// 		var endAngle = thisChart.segments[i].endAngle;
		// 		var middleAngle = startAngle + ((endAngle = startAngle)/2);

		// 		//Computer text location
		// 		var posX = (radius/2) * Math.cos(middleAngle) + midX;
		// 		var posY = (radius/2) * Math.sin(middleAngle) + midY;

		// 		//Text offside by middle
		// 		var w_offset = chartCtx.measureText(value).width/2;
		// 		var h_offset = textSize/4;

		// 		chartCtx.fillText(value, posX - w_offset, posY + h_offset);
		// 	}
		// }

		return thisChart;
	};

	return WidgetChart;
}];

module.exports = ['$uibModal', function($uibModal) {

	var colorRange = [];

	function changeHue(rgb, degree) {
	    var hsl = rgbToHSL(rgb);
	    hsl.h += degree;
	    if (hsl.h > 360) {
	        hsl.h -= 360;
	    }
	    else if (hsl.h < 0) {
	        hsl.h += 360;
	    }
	    return hslToRGB(hsl);
	}
	// exepcts a string and returns an object
	function rgbToHSL(rgb) {
	    // strip the leading # if it's there
	    rgb = rgb.replace(/^\s*#|\s*$/g, '');

	    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	    if(rgb.length == 3){
	        rgb = rgb.replace(/(.)/g, '$1$1');
	    }

	    var r = parseInt(rgb.substr(0, 2), 16) / 255,
	        g = parseInt(rgb.substr(2, 2), 16) / 255,
	        b = parseInt(rgb.substr(4, 2), 16) / 255,
	        cMax = Math.max(r, g, b),
	        cMin = Math.min(r, g, b),
	        delta = cMax - cMin,
	        l = (cMax + cMin) / 2,
	        h = 0,
	        s = 0;

	    if (delta == 0) {
	        h = 0;
	    }
	    else if (cMax == r) {
	        h = 60 * (((g - b) / delta) % 6);
	    }
	    else if (cMax == g) {
	        h = 60 * (((b - r) / delta) + 2);
	    }
	    else {
	        h = 60 * (((r - g) / delta) + 4);
	    }

	    if (delta == 0) {
	        s = 0;
	    }
	    else {
	        s = (delta/(1-Math.abs(2*l - 1)))
	    }

	    return {
	        h: h,
	        s: s,
	        l: l
	    }
	}

	// expects an object and returns a string
	function hslToRGB(hsl) {
	    var h = hsl.h,
	        s = hsl.s,
	        l = hsl.l,
	        c = (1 - Math.abs(2*l - 1)) * s,
	        x = c * ( 1 - Math.abs((h / 60 ) % 2 - 1 )),
	        m = l - c/ 2,
	        r, g, b;

	    if (h < 60) {
	        r = c;
	        g = x;
	        b = 0;
	    }
	    else if (h < 120) {
	        r = x;
	        g = c;
	        b = 0;
	    }
	    else if (h < 180) {
	        r = 0;
	        g = c;
	        b = x;
	    }
	    else if (h < 240) {
	        r = 0;
	        g = x;
	        b = c;
	    }
	    else if (h < 300) {
	        r = x;
	        g = 0;
	        b = c;
	    }
	    else {
	        r = c;
	        g = 0;
	        b = x;
	    }

	    r = normalize_rgb_value(r, m);
	    g = normalize_rgb_value(g, m);
	    b = normalize_rgb_value(b, m);

	    return rgbToHex(r,g,b);
	}

	function normalize_rgb_value(color, m) {
	    color = Math.floor((color + m) * 255);
	    if (color < 0) {
	        color = 0;
	    }
	    return color;
	}

	function rgbToHex(r, g, b) {
	    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	this.getColorRange = function(numColors) {
		var curHue = '#394894';
		for (var i = 0; i < numColors; i++) {
			colorRange.push(curHue);
			curHue = changeHue(curHue, 69);
		}

		return colorRange;
	};
}];

module.exports = ['$log', '$location', '$http', '$window', '$routeParams', 'helpers', function($log, $location, $http, $window, $routeParams, helpers) {
	var rison = require('rison');
	return {
		buildReportURL: function($reportType, $reportPreset, $reportTitle, $reportFilters, $widgets) {
			var $widgets = typeof $widgets !== 'undefined' ? $widgets : null;
			var risonWidgetData;
			var editingID = null;
			if ($location.search('edit')) {
				editingID = $routeParams.edit;
			}
			var curPath = $location.path();
			var newUrl = curPath + '?';

			newUrl += 'reportType=' + encodeURI($reportType);
			newUrl += '&reportPreset=' + JSON.stringify($reportPreset);
			newUrl += '&reportTitle=' + encodeURI($reportTitle);
			newUrl += '&reportFilters=' + encodeURI($reportFilters);

			if ($widgets.length) {
				newUrl += '&reportWidgets=';

				var widgetsObj = {};

				for(var i=0, l=$widgets.length; i<l; i++) {
					widgetsObj[$widgets[i].id] = $widgets[i];
				}

				newUrl += rison.encode(widgetsObj) + '&';
			// $log.log(newUrl);
			}

			if (editingID) {
				newUrl += '&edit=' + editingID;
			}

			$location.url(newUrl);
		},
		buildReportFromURL: function($filter, $widgetsArr, $callback) {
			var urlParams = $location.search();
			if (Object.keys(urlParams).length) {
				var $widgets, key, widgetKey, reportData;

				for (key in urlParams) {
					if(urlParams.hasOwnProperty(key)) {
						if(key !== 'edit') {
							if (key === 'reportFilters') {
								// $log.log(urlParams[key]);
								$filter = decodeURI(urlParams[key]);
							}
							if (key === 'reportWidgets') {
								$widgets = rison.decode(urlParams[key]);

								if (Object.keys($widgets).length) {
									for (widgetKey in $widgets) {
										$widgetsArr.push($widgets[widgetKey]);
									}
								}
							}
						}
					}
				}

				reportData = {
					reportType: decodeURI(urlParams.reportType),
					reportPreset: JSON.parse(urlParams.reportPreset),
					reportTitle: decodeURI(urlParams.reportTitle),
					reportFilters: $filter,
					reportWidgets: $widgetsArr,
				};
				$callback(reportData);
			}
		},
		saveReport: function(editID) {
			var reportURL= $location.url();
			reportURL = helpers.removeURLParameter(reportURL, 'edit');

			$window.onbeforeunload = null;

			$http.post('/api/save-report-url', {report_url: reportURL, editing_id: editID})
				.then(function(results) {
					$window.location.href = results.data;
					$log.log(results.data);
				}, function(error) {
					$log.log(error.data);
				});
		},
		deleteReport: function(report_id) {
			if (confirm("Delete this saved report?")) {
				$http.post('/api/delete_post', {'post_type': 'Report_URL', 'post_id': report_id})
					.then(function(results) {
						$window.location.href = results.data;
						$window.location.reload();
						// $log.log(results.data);
					}, function(error) {
						$log.log(error);
					});
			}
		},
		calcTimeSpent: function(postObj, logKeyX, logs) {
			$log.log(logs);
			var totalHours = 0;

			function idExistsInArr(id, arr) {
				return arr.some(function(el) {
					return el.id === id;
				});
			}

			for (var i=0, l=logs.length; i<l; i++) {
				if ((logs[i][logKeyX].id === postObj.id) || (angular.isArray(logs[i][logKeyX]) && idExistsInArr(postObj.id, logs[i][logKeyX]))) {
					if (logs[i].activity_hours && typeof logs[i].activity_hours !== 'undefined') {
						totalHours += logs[i].activity_hours;
					}
				}
			}

			return totalHours;
		},
		// processYMetric: function(metric_val, post_type, filter, callback) {
		// 	helpers.getPosts(post_type, filter, callback);
		// },
	};
}];

module.exports = [function() {
	var chartOptions;
	var WidgetTable = {};

	WidgetTable.makeTable = function(tableData) {
	};

	return WidgetTable;
}];
