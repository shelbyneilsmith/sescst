/**
 * The controller for the staff tools app footer. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', 'UserAuth', function($scope, $filter, UserAuth) {
	$scope.loggedIn = UserAuth.loggedIn;
}];
