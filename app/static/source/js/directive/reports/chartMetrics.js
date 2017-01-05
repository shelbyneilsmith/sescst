module.exports = ['helpers', '$log', function(helpers, $log) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			axis: '@',
			model: '=',
			change: '=?',
			metricOpts: '=opts',
			metricSelectPlaceholder: '@placeholder',
		},
		templateUrl: '../templates/partials/reports/chart-metrics.html',
		controller: function($scope) {
		},
		link: function(scope, element, attrs) {
			if (!scope.metricSelectPlaceholder) {
				scope.metricSelectPlaceholder = 'Choose a Metric';
			}
		}
	};
}];
