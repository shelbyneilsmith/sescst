/**
 * The directive for including a dynamic form.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'E',
		scope: '=',
		template: '<ng-include src="template"/>',
		link: function(scope, element, attrs) {
			var formPrefix = attrs.type;
			scope.template = '../templates/partials/forms/' + formPrefix + '-form.html';
		}
	};
};
