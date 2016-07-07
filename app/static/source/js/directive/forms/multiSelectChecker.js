/**
 * The directive for the multi select field checker.
 */
'use strict';

module.exports = ['$compile',  function ($compile) {
	return {
		restrict: 'A',
		replace: false,
		terminal: true, //terminal means: compile this directive only
		priority: 50000, //priority means: the higher the priority, the "firster" the directive will be compiled
		compile: function compile(element, attrs) {
			element.removeAttr("multi-select-checker"); //remove the attribute to avoid indefinite loop
			element.removeAttr("data-multi-select-checker"); //also remove the same attribute with data- prefix in case users specify data-multi-select-checker in the html

			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {  },
				post: function postLink(scope, iElement, iAttrs, controller) {
					if(scope.options.Multiple === true) {
						iElement[0].setAttribute('multiple',''); //set the multiple directive, doing it the JS way, not jqLite way.
					}
					$compile(iElement)(scope);
				}
			};
		}
	};
}];
