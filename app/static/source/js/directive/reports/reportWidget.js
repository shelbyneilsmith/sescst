module.exports = ['$timeout', 'WidgetChart', '$log', 'helpers', 'ReportUtils', function($timeout, WidgetChart, $log, helpers, ReportUtils) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../templates/partials/reports/widget-template.html',
		controller: function($scope) {
			$scope.widgetTitleEdit = false;
			$scope.widgetTypeEdit = false;
			$scope.metricsCollapsed = true;

			$scope.metrics = {};

			$scope.metrics.x = $scope.widget.metrics.x !== 'undefined' ? $scope.widget.metrics.x : [$scope.widgetXMetricOpts[0]];
			$scope.metrics.y = $scope.widget.metrics.y !== 'undefined' ? $scope.widget.metrics.y : [$scope.widgetYMetricOpts[$scope.$parent.reportType][0]];
		},
		link: function(scope, element, attrs) {

			var getXMetricPT = function(input) {
				var postType;

				switch(input) {
					case 'user':
						postType = "User";
						break;
					case 'districts':
						postType = "District";
						break;
					case 'schools':
						postType = "School";
						break;
					case 'activity_types':
						postType = "Activity_Type";
						break;
					default:
						postType = null;
				}

				return postType;
			};

			var renderWidgetData = function() {
				scope.chartData = [];
				var filterStr = '';

				var postData, metricPT, metricObj, chartDataArr = [];

				var chartDataCallback = function(metricXData, metricYData) {
					return function(results) {
						var chartLabels = [];
						var dataIDs = [];
						var chartData = [];
						var curLabel, curID, curXDataVal;

						for (var i=0, l=results.length; i<l; i++) {
							curXDataVal = results[i][metricXData.value];
							if (metricYData.value === 'total_expenses') {
								if (!results[i].activity_log) {
									continue;
								}
								curXDataVal = results[i].activity_log[metricXData.value];
							}

							if ($.isArray(curXDataVal)) {
								for (var n=0, nl=curXDataVal.length; n<nl; n++) {
									curID = curXDataVal[n].id;

									if (metricXData.value === 'user') {
										curLabel = curXDataVal[n].first_name + ' ' + curXDataVal[n].last_name;
									} else {
										curLabel = curXDataVal[n].name;
									}

									if ($.inArray(curID, dataIDs) === -1) {
										chartLabels.push(curLabel);
										dataIDs.push(curID);
									}
								}
							} else {
								curID = results[i][metricXData.value].id;

								if (metricXData.value === 'user') {
									curLabel = results[i][metricXData.value].first_name + ' ' + results[i][metricXData.value].last_name;
								} else {
									curLabel = results[i][metricXData.value].name;
								}

								if ($.inArray(curID, dataIDs) === -1) {
									chartLabels.push(curLabel);
									dataIDs.push(curID);
								}
							}
						}


						for (var id=0, lid=dataIDs.length; id<lid; id++) {
							if (metricYData.value === 'time_spent') {
								chartData.push(ReportUtils.calcTimeSpent(results, dataIDs[id], metricXData.value));
							}
							if (metricYData.value === 'total_expenses') {
								chartData.push(ReportUtils.calcTotalExpenses(results, dataIDs[id], metricXData.value, scope.$parent.globalSettings));
							}
						}

						var chartValFormatter = '';
						if (metricYData.value === 'total_expenses') {
							chartValFormatter = 'currency';
						}

						if (typeof scope.chartElem !== 'undefined') {
							if (element.chart) {
								element.chart.destroy();
							}

							element.chart = WidgetChart.makeChart(scope.widget.type, scope.chartElem, chartLabels, chartData, chartValFormatter);
						}
					};
				};

				if ((scope.widget.metrics.x && typeof scope.widget.metrics.x !== 'undefined') && (scope.widget.metrics.y && typeof scope.widget.metrics.y !== 'undefined'))  {
					var reportType = 'Activity_Log';
					var dateKeys = [
						'activity_date_start',
						'activity_date_end'
					];

					if (scope.widget.metrics.y.value === 'total_expenses') {
						reportType = 'Expense_Sheet';
						dateKeys = [
							'expense_sheet_start',
							'expense_sheet_end'
						];
					}

					metricXPT = getXMetricPT(scope.widget.metrics.x.value);
					filterStr = helpers.buildQueryFilter(scope.widget.filter, reportType, dateKeys);

					helpers.getPosts(reportType, filterStr, chartDataCallback(scope.widget.metrics.x, scope.widget.metrics.y));

				}

				return scope.chartData;
			};


			scope.updateWidgetTitle = function(action) {
				if (action === 'save') {
					scope.widget.title = scope.widgetNewTitle;
					ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportPreset, scope.$parent.reportTitle, scope.$parent.reportDateRange, scope.$parent.reportFilter, scope.$parent.widgets);
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


			scope.updateWidget = function() {
				renderWidgetData();
				ReportUtils.buildReportURL(scope.$parent.reportType, scope.$parent.reportPreset, scope.$parent.reportTitle, scope.$parent.reportDateRange, scope.$parent.reportFilter, scope.$parent.widgets);
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
					scope.compileMetricsGroup(scope.widget.metrics.x, scope.metrics.x);
					scope.compileMetricsGroup(scope.widget.metrics.y, scope.metrics.y);


					scope.selectedWidgetType = helpers.getObjByValue(scope.widgetOptions, scope.widget.type);
					scope.chartElem = document.getElementById(scope.widget.id + '-' + scope.widget.type);

					renderWidgetData();
				}, 300);
			};

			scope.widgetInit();

		}
	};
}];
