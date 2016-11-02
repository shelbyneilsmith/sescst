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

			$scope.metrics = {};
			// $scope.filters = $scope.widget.filters !== 'undefined' ? $scope.widget.filters : [{'id': 'filter1', 'filterSelect': $scope.widgetFilterOpts[0]}];
			// $scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics :  [{'id': 'metric1', 'metricSelect': $scope.widgetMetricOpts[0]}];
			// $scope.metrics = $scope.widget.metrics !== 'undefined' ? $scope.widget.metrics :  [$scope.widgetMetricOpts[0]];
			$scope.metrics.x = $scope.widget.metrics.x !== 'undefined' ? $scope.widget.metrics.x : [$scope.widgetXMetricOpts[0]];
			$scope.metrics.y = $scope.widget.metrics.y !== 'undefined' ? $scope.widget.metrics.y : [$scope.widgetYMetricOpts[$scope.$parent.reportType][0]];
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


			var getXMetricPT = function(input) {
				var postType;

				switch(input) {
					case 'users':
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


			// var renderWidgetData = function(filtersLength, metricsLength) {
			var renderWidgetData = function() {
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


				// var metrics = [];

				// if(!metricsLength) {
				// 	for (var m=0, ml=scope.metrics.length; m<ml; m++) {
				// 		// if (scope.metrics[m] && typeof scope.metrics[m] !== 'undefined') {
				// 			// metrics.push(scope.metrics[m].metricSelect);
				// 			metrics.push(scope.metrics[m]);
				// 		// }
				// 	}
				// 	scope.widget.metrics = metrics;
				// } else {
				// 	metrics = scope.widget.metrics;
				// }

				var postData, metricPT, metricObj, chartDataArr = [];

				var chartDataCallback = function(metricXData, metricYData) {
					return function(results) {
						var chartLabels = [];
						var chartData = [];
						// var metricObj = {};

						for (var i=0, l=results.length; i<l; i++) {
							if (metricXData.value === 'users') {
								chartLabels.push(results[i].first_name + ' ' + results[i].last_name);
							}

							if (metricXData.value === 'districts') {
								chartLabels.push(results[i].name);
							}

							if (metricYData.value === 'time_spent') {
								// $log.log(scope.$parent.logs_data);
								chartData.push(ReportUtils.calcTimeSpent(results[i], scope.$parent.logs_data));
							}
							// metricObj.label = metricData.label;
							// metricObj.value = results.length;

							// scope.chartData.push(metricObj);
						}

						if (typeof scope.chartElem !== 'undefined') {
							if (element.chart) {
								element.chart.destroy();
							}
							if (scope.widget.type !== 'table') {
								element.chart = WidgetChart.makeChart(scope.widget.type, scope.chartElem, chartLabels, chartData);
							} else {
								element.chart = WidgetTable.makeTable({});
							}
						}
					};
				};

				// if (metrics) {
					// for (var m=0, ml=metrics.length; m<ml; m++) {
						if ((scope.widget.metrics.x && typeof scope.widget.metrics.x !== 'undefined') && (scope.widget.metrics.y && typeof scope.widget.metrics.y !== 'undefined'))  {

							// postData = getPosts(metricPT, filterStr, postDataCallback(metricObj));
							metricXPT = getXMetricPT(scope.widget.metrics.x.value);
							helpers.getPosts(metricXPT, filterStr, chartDataCallback(scope.widget.metrics.x, scope.widget.metrics.y));

							// if (scope.widget.metrics.y && typeof scope.widget.metrics.y !== 'undefined') {
								// if (scope.widget.metrics.y.value === 'time_spent') {
									// ReportUtils.processYMetric(scope.widget.metrics.y.value, metricXPT, filterStr, chartDataCallback(scope.widget.metrics.y, function(results, returnObj) {
									// 	$log.log(results);

									// 	returnObj.label = scope.widget.metrics.y.label;
									// 	returnObj.value = results.length;

									// 	return returnObj;
									// }));
								// }
								// if (scope.widget.metrics.y.value === 'total_expenses') {
								// 	ReportUtils.processYMetric(metricXPT, filterStr, chartDataCallback(scope.widget.metrics.y))
								// }
							// }
						}
					// }
				// }

				// return [{label: "Red", value: 300}, {label: "Green", value: 50}, {label: "Yellow",  value: 100}, {label: "Fart", value: 666}, {label: "WHUHUHHHH", value: 43}];
				return scope.chartData;
			};

			scope.updateWidgetTitle = function(action) {
				if (action === 'save') {
					scope.widget.title = scope.widgetNewTitle;
					ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportPreset, scope.$parent.reportTitle, scope.$parent.reportFilter, scope.$parent.widgets);
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

			// scope.updateWidget = function(initFiltersNum, initMetricsNum) {
			scope.updateWidget = function() {
				renderWidgetData();
				// renderWidgetData(initFiltersNum, initMetricsNum);
				ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportPreset, scope.$parent.reportTitle, scope.$parent.reportFilter, scope.$parent.widgets);
			};

			scope.compileMetricsGroup = function(inGroup, outArr) {
				var metricsLength = typeof inGroup !== 'undefined' ? inGroup.length : 0;

				if(metricsLength) {
					for(var m=0; m<metricsLength; m++) {
						if (inGroup[m] && typeof inGroup[m] !== 'undefined') {
							widgetMetricOpt = helpers.getObjByValue(scope.widgetMetricOpts, inGroup[m].value);
						} else {
							widgetMetricOpt = null;
						}

						outArr.push(widgetMetricOpt);
					}
				}
			};

			scope.widgetInit = function() {
				$timeout(function() {
					// var widgetFilterOpt, widgetMetricOpt;
					// var filtersLength = typeof scope.widget.filters !== 'undefined' ? scope.widget.filters.length : 0;
					// var metricsXLength = typeof scope.widget.metrics.x !== 'undefined' ? scope.widget.metrics.x.length : 0;
					// var metricsYLength = typeof scope.widget.metrics.y !== 'undefined' ? scope.widget.metrics.y.length : 0;

					// if(filtersLength) {
					// 	scope.filters = [];
					// 	for(var f=0; f<filtersLength; f++) {
					// 		widgetFilterOpt = helpers.getObjByValue(scope.widgetFilterOpts, scope.widget.filters[f].value);
					// 		scope.filters.push({'id':'filter'+f, 'filterSelect':widgetFilterOpt});
					// 	}
					// }
					// if(metricsXLength) {
					// 	scope.metrics.x = [];
					// 	for(var m=0; m<metricsLength; m++) {
					// 		if (scope.widget.metrics.x[m] && typeof scope.widget.metrics.x[m] !== 'undefined') {
					// 			widgetMetricOpt = helpers.getObjByValue(scope.widgetMetricOpts, scope.widget.metrics[m].value);
					// 		} else {
					// 			widgetMetricOpt = null;
					// 		}
					// 		// scope.metrics.push({'id':'metric'+m, 'metricSelect':widgetMetricOpt});
					// 		scope.metrics.push(widgetMetricOpt);
					// 	}
					// }
					// scope.metrics.x = [];
					// scope.metrics.y = [];
$log.log(scope.widget.metrics.x);
					scope.compileMetricsGroup(scope.widget.metrics.x, scope.metrics.x);
					scope.compileMetricsGroup(scope.widget.metrics.y, scope.metrics.y);


					scope.selectedWidgetType = helpers.getObjByValue(scope.widgetOptions, scope.widget.type);
					scope.chartElem = document.getElementById(scope.widget.id + '-' + scope.widget.type);

					renderWidgetData();
					// renderWidgetData(filtersLength, metricsLength);
					// scope.makeWidget(filtersLength, metricsLength);
				}, 300);
			};

			scope.widgetInit();

		}
	};
}];
