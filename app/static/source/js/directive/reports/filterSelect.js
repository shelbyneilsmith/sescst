module.exports = ['$log', 'helpers', function($log, helpers) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../templates/partials/reports/report-filter.html',
		link: function(scope, element, attrs) {
			scope.filter.filterDetail = {};

			scope.$watch('filter.filterDetail', function(newValue) {
				scope.newWidgetFilterSelect = {
					filterSelect: scope.filter.filterSelect,
					filterDetail: {}
				};

				if (scope.filter.filterDetail.hasOwnProperty('reportStartDate') && scope.filter.filterDetail.hasOwnProperty('reportEndDate')) {
					if (scope.filter.filterDetail.hasOwnProperty('name')) {
						delete scope.filter.filterDetail.name;
					}
					if (scope.filter.filterDetail.hasOwnProperty('value')) {
						delete scope.filter.filterDetail.value;
					}

					scope.filter_date_range[0] = new Date(scope.filter.filterDetail.reportStartDate);
					scope.filter_date_range[1] = new Date(scope.filter.filterDetail.reportEndDate);
					scope.newWidgetFilterSelect.filterDetail.reportStartDate = helpers.dateToPDateTime(scope.filter_date_range[0]);
					scope.newWidgetFilterSelect.filterDetail.reportEndDate = helpers.dateToPDateTime(scope.filter_date_range[1]);
				} else {
					scope.newWidgetFilterSelect.filterDetail = scope.filter.filterDetail;
				}
			}, true);
		}
	};
}];
