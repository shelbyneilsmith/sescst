/**
 * The directive for the app main ara.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: '=',
		templateUrl: 'static/templates/inc/sescst-main.html',
		controller: 'sescMainCtrl'
	};
};
