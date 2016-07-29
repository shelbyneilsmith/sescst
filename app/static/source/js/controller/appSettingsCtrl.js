/**
 * The main controller for the application settings page. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$http', '$log', '$window', 'helpers', function($scope, $http, $log, $window, helpers) {

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

	$scope.curRoles = [];
	helpers.getPosts('Role', '', function(results) {
		if (results) {
			for (var i = 0, l = results.length; i < l; i++) {
				$scope.curRoles.push({"name": results[i].name, "description": results[i].description});
			}
		}
	});

	$scope.curActivityTypes = [];
	helpers.getPosts('Activity_Type', '', function(results) {
		if (results) {
			for (var i = 0, l = results.length; i < l; i++) {
				$scope.curActivityTypes.push({"name": results[i].name, "description": results[i].description});
			}
		}
	});

	$scope.curSchoolTypes = [];
	helpers.getPosts('School_Type', '', function(results) {
		if (results) {
			for (var i = 0, l = results.length; i < l; i++) {
				$scope.curSchoolTypes.push({"name": results[i].name});
			}
		}
	});

	$scope.curSchoolLevels = [];
	helpers.getPosts('School_Level', '', function(results) {
		if (results) {
			for (var i = 0, l = results.length; i < l; i++) {
				$scope.curSchoolLevels.push({"name": results[i].name});
			}
		}
	});

	$scope.curDistrictSchoolServices = [];
	helpers.getPosts('Location_Service', '', function(results) {
		if (results) {
			for (var i = 0, l = results.length; i < l; i++) {
				$scope.curDistrictSchoolServices.push({"name": results[i].name});
			}
		}
	});

	$scope.saveAppSettings = function() {
		$log.log("Settings Saved!");

		$http.post('/api/save_app_settings', {
				roles: $scope.curRoles,
				activity_types: $scope.curActivityTypes,
				school_types: $scope.curSchoolTypes,
				school_levels: $scope.curSchoolLevels,
				location_services: $scope.curDistrictSchoolServices,
				mileage_reimbursement: $scope.curAppSettings.mileage_reimbursement,
				cell_reimbursement: $scope.curAppSettings.cell_reimbursement,
				global_data_links: $scope.curAppSettings.global_data_links
			}).then(function(results) {
				$window.location.href = results;
				$window.location.reload();
				// $log.log(results.data);
			}, function(error) {
				$log.log(error);
			});
	};
}];
