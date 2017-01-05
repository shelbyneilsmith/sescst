/**
 * The directive for rendering static includes.
 */
'use strict';

module.exports = ['$templateRequest', '$compile', function($templateRequest, $compile) {
	return {
		restrict: 'A',
		transclude: true,
		replace: true,
		scope: false,
		link: function($scope, element, attrs, ctrl, transclude) {
			var templatePath = attrs.staticInclude;

			$templateRequest(templatePath)
				.then(function(response) {
					var contents = element.html(response).contents();
					$compile(contents)($scope.$new(false, $scope.$parent));
				});
		}
	};
}];
