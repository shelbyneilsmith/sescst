module.exports = ['helpers', '$log', function(helpers, $log) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			axis: '@',
			model: '=',
			metricOpts: '=opts',
		},
		templateUrl: '../templates/partials/reports/chart-metrics.html',
		controller: function($scope) {
		},
		link: function(scope, element, attrs) {
		}
	};
}];
