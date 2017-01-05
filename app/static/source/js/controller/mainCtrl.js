/**
 * The main/global controller for the staff tools app.
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$rootScope', '$location', 'helpers', '$timeout', function($scope, $routeParams, $http, $log, $rootScope, $location, helpers, $timeout) {
	// Hide any alerts/messages on the page after a delay
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
