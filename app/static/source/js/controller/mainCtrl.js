/**
 * The main controller for the staff tools app. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$rootScope', '$location', 'helpers', function($scope, $routeParams, $http, $log, $rootScope, $location, helpers) {
	setTimeout(function() {
		$('.alert').fadeOut('fast');
	}, 6000);

	helpers.getCurrentUser(function(userData) {
		$scope.curUser = userData;
	});

}];
