/**
 * The controller for the staff tools app sidebar. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', '$location', function($scope, $filter, $location) {

	console.log($location.url());
	$scope.isActive = function (viewLocation) {
		var active = (viewLocation === $location.url());
		return active;
	};
}];
