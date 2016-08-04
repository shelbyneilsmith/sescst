/**
 * The directive for the app sidebar.
 */
'use strict';

module.exports = ['$log', function($log) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			type: '@',
		},
		template:'<ng-include src="tpl"/>',
		controller: 'sescSidebarCtrl',
		link: function(scope, element, attrs) {
			$log.log(scope.type);
			scope.tpl = '../templates/partials/sidebar/sidebar-main.html';
			if (scope.type) {
				scope.tpl = '../templates/partials/sidebar/sidebar-' + scope.type + '.html';
			}
		}
	};
}];
