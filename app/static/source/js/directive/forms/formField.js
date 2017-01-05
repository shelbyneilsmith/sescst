/**
 * The directive for creating simple fields.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', function($http, $log, $templateCache, $compile, $templateRequest, $timeout) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldModel: '=?model',
			name: '@',
			placeholder: '@',
			type: '@',
			autoFocus: '@',
			selectOptions: '=?',
			simpleSelect: '=?',
			keyVal: '=?',
			rows: '@',
		},
		link: function(scope, element, attrs) {
			if (scope.type !== 'select' && scope.type !== 'multiselect') {
				scope.fieldModel = typeof scope.fieldModel !== 'undefined' ? scope.fieldModel : '';
			}

			$templateRequest('../templates/partials/forms/fields/' + scope.type + '.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});
		}
	};
}];
