/**
 * The controller for the staff tools app sidebar. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', 'UserAuth', function($scope, $filter, UserAuth) {
	$scope.loggedIn = UserAuth.loggedIn;

	$scope.sidebarNav = ['one', 'two', 'three'];
	$scope.blah = "BLAH";
}];
