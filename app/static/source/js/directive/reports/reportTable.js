module.exports = ['$templateRequest', '$compile', function($templateRequest, $compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			type: '@',
		},
		link: function(scope, element, attrs) {
			$templateRequest('../templates/partials/reports/report-tables/' + scope.type + '.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);

				$('.report-table-wrapper .spinner-wrap').fadeOut(250, function() {
					scope.$parent.$parent.reportLoadingSpinner = null;
				});

			});
		}
	};
}];
