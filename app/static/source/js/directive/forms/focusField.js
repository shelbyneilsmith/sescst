/**
 * The directive for the field focus feature.
 */
'use strict';

module.exports = ['$timeout', '$parse', function($timeout, $parse) {
	return {
		scope: { trigger: '@focusMe' },
		link: function(scope, element, attrs) {
			scope.$watch('trigger', function(value) {
				if(value === "true") {
					$timeout(function() {
						element[0].focus();
					})
				}
			});
		}
	};
}];
