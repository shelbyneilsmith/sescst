/**
 * The directive for the app main ara.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: '=',
		templateUrl: '/static/partials/sescst-main.html',
		controller: 'sescMainCtrl'
	};
};
