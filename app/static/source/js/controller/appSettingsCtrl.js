/**
 * The main controller for the application settings page. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$http', '$log', '$window', 'helpers', function($scope, $http, $log, $window, helpers) {
	$scope.curRoles = [];
	helpers.getPosts('Role', '', function(results) {
		for (var i = 0, l = results.length; i < l; i++) {
			$scope.curRoles.push(results[i].name);
		}
	});

	$scope.curActivityTypes = [];
	helpers.getPosts('Activity_Type', '', function(results) {
		for (var i = 0, l = results.length; i < l; i++) {
			$scope.curActivityTypes.push(results[i].name);
		}
	});

	$scope.saveAppSettings = function() {
		$log.log("Settings Saved!");

		$http.post('/api/save_app_settings', {roles: $scope.curRoles, activity_types: $scope.curActivityTypes})
			.then(function(results) {
				$window.location.href = results;
				$window.location.reload();
				// $log.log(results.data);
			}, function(error) {
				$log.log(error);
			});
	};
}];
