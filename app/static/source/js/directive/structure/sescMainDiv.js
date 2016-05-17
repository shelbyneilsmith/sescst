/**
 * The directive for the app main ara.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: '=',
		templateUrl: '../templates/partials/sescst-main.html',
		controller: 'mainCtrl'
	};
};
