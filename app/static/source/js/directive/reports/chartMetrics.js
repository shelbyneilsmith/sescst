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
			// if ($scope.axis === 'y') {
			// 	$scope.metricOpts = $scope.metricOpts[$scope.$parent.reportType];
			// 	$log.log($scope.metricOpts);
			// }
		},
		link: function(scope, element, attrs) {
		}
	};
}];
