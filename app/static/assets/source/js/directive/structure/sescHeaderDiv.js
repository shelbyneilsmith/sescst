/**
 * The directive for the app header.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: '=',
		templateUrl: 'static/templates/inc/sescst-header.html',
		controller: 'sescHeaderCtrl'
	};
};
