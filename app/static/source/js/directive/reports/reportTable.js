module.exports = ['$templateRequest', '$compile', function($templateRequest, $compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			type: '@',
		},
		// templateUrl: '../templates/partials/reports/report-tables/' + $scope.type + '.html',
		link: function(scope, element, attrs) {
			$templateRequest('../templates/partials/reports/report-tables/' + scope.type + '.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});
		}
	};
}];
