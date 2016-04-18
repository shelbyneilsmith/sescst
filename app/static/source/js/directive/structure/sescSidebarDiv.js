/**
 * The directive for the app sidebar.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: '=',
		templateUrl: '/static/partials/sescst-sidebar.html',
		controller: 'sescSidebarCtrl'
	};
};
