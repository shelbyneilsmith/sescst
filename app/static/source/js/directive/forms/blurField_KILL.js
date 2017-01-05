/**
 * The directive for the hide/show password checkbox feature.
 */
'use strict';

module.exports = ['$timeout', '$parse', function($timeout, $parse) {
	return {
		link: function(scope, elem, attrs) {
			elem.bind('blur', function(e) {
				scope.$apply(attrs.blurMe);
			});
		}
	};
}];
