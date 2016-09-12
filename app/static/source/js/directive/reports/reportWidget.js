module.exports = ['$timeout', 'WidgetTable', 'WidgetChart', '$log', 'helpers', 'ReportUtils', function($timeout, WidgetTable, WidgetChart, $log, helpers, ReportUtils) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../templates/partials/reports/widget-template.html',
		controller: function($scope) {
			$scope.widgetTitleEdit = false;
			$scope.widgetTypeEdit = false;
			// $scope.filtersCollapsed = true;
			$scope.metricsCollapsed = true;

			// $scope.filters = $scope.widget.filters !== 'undefined' ? $scope.widget.filters : [{'id': 'filter1', 'filterSelect': $scope.widgetFilterOpts[0]}];
			// $scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics :  [{'id': 'metric1', 'metricSelect': $scope.widgetMetricOpts[0]}];
			// $scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics :  [$scope.widgetMetricOpts[0]];
			$scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics : [$scope.widgetMetricOpts[0]];
			// $log.log($scope.metrics);

		},
		link: function(scope, element, attrs) {

			// scope.addWidgetFilter = function() {
			// 	var newItemNo = scope.filters.length + 1;
			// 	scope.filters.push({'id':'filter'+newItemNo, 'filterSelect':scope.widgetFilterOpts[0]});
			// };


			// scope.addWidgetMetric = function() {
			// 	var newItemNo = scope.filters.length + 1;
			// 	scope.metrics.push({'id':'metric'+newItemNo, 'metricSelect':scope.widgetMetricOpts[0]});
			// };


			var getMetricPT = function(input) {
				var postType;

				switch(input) {
					case 'consultants':
						postType = "User";
						break;
					case 'schools':
						postType = "School";
						break;
					case 'districts':
						postType = "District";
						break;
					case 'activity_types':
						postType = "Activity_Type";
						break;
					default:
						postType = null;
				}

				return postType;
			};


			var renderWidgetData = function(filtersLength, metricsLength) {
				scope.chartData = [];
				var filterStr = '';

				// var filters = [];

				// if(!filtersLength) {
				// 	for (var f=0, fl=scope.filters.length; f<fl; f++) {
				// 		filters.push(scope.filters[f].filterSelect);
				// 	}
				// 	scope.widget.filters = filters;
				// } else {
				// 	filters = scope.widget.filters;
				// }


				var metrics = [];

				if(!metricsLength) {
					for (var m=0, ml=scope.metrics.length; m<ml; m++) {
						// if (scope.metrics[m] && typeof scope.metrics[m] !== 'undefined') {
							// metrics.push(scope.metrics[m].metricSelect);
							metrics.push(scope.metrics[m]);
						// }
					}
					scope.widget.metrics = metrics;
				} else {
					metrics = scope.widget.metrics;
				}

				var postData, metricPT, metricObj, chartDataArr = [];

				var chartDataCallback = function(metricData) {
					return function(results) {
						var metricObj = {};
						metricObj.label = metricData.label;
						metricObj.value = results.length;

						scope.chartData.push(metricObj);

						if (typeof scope.chartElem !== 'undefined') {
							if (element.chart) {
								element.chart.destroy();
							}
							if (scope.widget.type !== 'table') {
								element.chart = WidgetChart.makeChart(scope.widget.type, scope.chartElem, scope.chartData);
							} else {
								element.chart = WidgetTable.makeTable({});
							}
						}
					};
				};

				if (metrics) {
					for (var m=0, ml=metrics.length; m<ml; m++) {
						if (metrics[m] && typeof metrics[m] !== 'undefined') {
							metricPT = getMetricPT(metrics[m].value);

							// postData = getPosts(metricPT, filterStr, postDataCallback(metricObj));
							helpers.getPosts(metricPT, filterStr, chartDataCallback(metrics[m]));
						}
					}
				}

				// return [{label: "Red", value: 300}, {label: "Green", value: 50}, {label: "Yellow",  value: 100}, {label: "Fart", value: 666}, {label: "WHUHUHHHH", value: 43}];
				return scope.chartData;
			};

			scope.updateWidgetTitle = function(action) {
				if (action === 'save') {
					scope.widget.title = scope.widgetNewTitle;
					ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportTitle, scope.$parent.getPostType, scope.$parent.reportFilter, scope.$parent.widgets);
				} else if (action === 'cancel') {
					scope.widgetNewTitle = scope.widget.title;
				}
				scope.widgetTitleEdit = false;
			};

			scope.updateWidgetType = function(action) {
				if (action === 'save') {
					var type = scope.selectedWidgetType;
					scope.widget.type = type.value;
					scope.widget.typeLabel = type.label;
					scope.updateWidget();
				}
				scope.widgetTypeEdit = false;
			};

			scope.updateWidget = function(initFiltersNum, initMetricsNum) {
				renderWidgetData(initFiltersNum, initMetricsNum);
				ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportTitle, scope.$parent.getPostType, scope.$parent.reportFilter, scope.$parent.widgets);
			};

			scope.widgetInit = function() {
				$timeout(function() {
					var widgetFilterOpt, widgetMetricOpt;
					var filtersLength = typeof scope.widget.filters !== 'undefined' ? scope.widget.filters.length : 0;
					var metricsLength = typeof scope.widget.metrics !== 'undefined' ? scope.widget.metrics.length : 0;

					// if(filtersLength) {
					// 	scope.filters = [];
					// 	for(var f=0; f<filtersLength; f++) {
					// 		widgetFilterOpt = helpers.getObjByValue(scope.widgetFilterOpts, scope.widget.filters[f].value);
					// 		scope.filters.push({'id':'filter'+f, 'filterSelect':widgetFilterOpt});
					// 	}
					// }
					if(metricsLength) {
						scope.metrics = [];
						for(var m=0; m<metricsLength; m++) {
							if (scope.widget.metrics[m] && typeof scope.widget.metrics[m] !== 'undefined') {
								widgetMetricOpt = helpers.getObjByValue(scope.widgetMetricOpts, scope.widget.metrics[m].value);
							} else {
								widgetMetricOpt = null;
							}
							// scope.metrics.push({'id':'metric'+m, 'metricSelect':widgetMetricOpt});
							scope.metrics.push(widgetMetricOpt);
						}
					}

					scope.selectedWidgetType = helpers.getObjByValue(scope.widgetOptions, scope.widget.type);
					scope.chartElem = document.getElementById(scope.widget.id + '-' + scope.widget.type).getContext("2d");

					renderWidgetData(filtersLength, metricsLength);
					// scope.makeWidget(filtersLength, metricsLength);
				}, 300);
			};

			scope.widgetInit();

		}
	};
}];
