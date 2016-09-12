module.exports = ['helpers', function(helpers) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			model: '=',
		},
		templateUrl: '../templates/partials/reports/chart-metrics.html',
		link: function(scope, element, attrs) {
		}
	};
}];
