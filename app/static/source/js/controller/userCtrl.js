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
