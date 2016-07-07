/**
 * The directive for rendering and compiling dynamic html elements.
 */
'use strict';

module.exports = ['$compile', function ($compile) {
	return {
		restrict: 'E',
		scope: {
			html: "="
		},
		replace: true,
		link: function(scope, element, attrs) {
			var template = $compile(scope.html)(scope);
			element.replaceWith(template);
		},
	};
}];
