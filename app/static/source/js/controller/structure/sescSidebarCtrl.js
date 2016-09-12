/**
 * The controller for the staff tools app sidebar. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$filter', '$location', '$log', function($scope, $filter, $location, $log) {
	$scope.initSettingsPanel = function() {
		if ($location.url() === '' || $location.url() === '/') {
			$scope.$parent.changeSettingPanel('access-roles');
		} else {
			$scope.$parent.changeSettingPanel($location.path().replace(/^\//, ''));
		}
	};

	// console.log($location.url());
	$scope.isActive = function (viewLocation) {
		var active = (viewLocation === $location.url());
		return active;
	};
}];
