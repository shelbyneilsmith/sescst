module.exports = ['$log', function($log) {
	return {
		restrict: 'E',
		scope: {
			widgetXMetricSelect: '=',
			widgetYMetricSelect: '=',
			widgetFilter: '=',
			widgetLocSelect: '=?',
		},
		replace: true,
		templateUrl: '../templates/partials/reports/widget-settings.html',
		link: function(scope, element, attrs) {

			scope.filterChoiceTitle = '';

			scope.setUserFilterOpts = function() {
				scope.filterChoiceTitle = 'User';
				scope.widgetFilterOpts = scope.$parent.allUsers;
				scope.widgetLocSelect = {name: 'User', value: 'user'};
			};


			if (scope.$parent.widget && scope.$parent.widget.filter) {
				if (scope.widgetXMetricSelect.value !== 'user') {
					scope.setUserFilterOpts();
				} else {
					scope.widgetLocSelect = scope.$parent.widget.filter[1].filterType;
				}

				scope.widgetFilter = scope.$parent.widget.filter[1].filterData;
			}


			// Watch for user changes to the X Metric
			scope.onXMetricChange = function(newVal) {
				if (typeof newVal !== 'undefined') {
					if(newVal.value !== 'user') {
						scope.setUserFilterOpts();
					} else {
						scope.filterChoiceTitle = '';
						scope.widgetLocSelect = scope.$parent.widgetFilterLocationOpts[0];
					}
				}
			};


			// Watch for changes to the user/location options
			scope.$watch('widgetLocSelect', function(newVal) {
				if (newVal) {
					if(newVal.value === 'district') {
						scope.widgetFilterOpts = scope.$parent.allDistricts;
					}
					if(newVal.value === 'school') {
						scope.widgetFilterOpts = scope.$parent.allSchools;
					}
				}
			});
		}
	};
}];
