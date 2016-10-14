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
