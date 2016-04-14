/**
 * The controller for the staff tools app header. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', 'UserAuth', function($scope, $filter, UserAuth) {
	$scope.loggedIn = UserAuth.loggedIn;
}];
