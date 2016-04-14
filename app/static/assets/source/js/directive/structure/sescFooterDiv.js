/**
 * The directive for the app footer.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'static/templates/inc/sescst-footer.html',
		controller: 'sescFooterCtrl'
	};
};
