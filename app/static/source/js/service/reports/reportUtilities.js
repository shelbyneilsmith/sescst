module.exports = ['$log', '$location', '$http', '$window', '$routeParams', 'helpers', '$filter', function($log, $location, $http, $window, $routeParams, helpers, $filter) {
	var rison = require('rison');
	return {
		buildReportURL: function($reportType, $reportPreset, $reportTitle, $reportDateRange, $reportFilters, $widgets) {
			var risonWidgetData, editingID = null;
			if ($location.search('edit')) {
				editingID = $routeParams.edit;
			}
			var curPath = $location.path();
			var newUrl = curPath + '?';
			$widgets = typeof $widgets !== 'undefined' ? $widgets : null;

			newUrl += 'reportType=' + encodeURI($reportType);
			newUrl += '&reportPreset=' + JSON.stringify($reportPreset);
			newUrl += '&reportTitle=' + encodeURI($reportTitle);
			newUrl += '&reportDateRange=' + JSON.stringify($reportDateRange);
			newUrl += '&reportFilters=' + encodeURI($reportFilters);

			if ($widgets.length) {
				newUrl += '&reportWidgets=';

				var widgetsObj = {};

				for(var i=0, l=$widgets.length; i<l; i++) {
					widgetsObj[$widgets[i].id] = $widgets[i];
				}

				newUrl += rison.encode(widgetsObj) + '&';
			}

			if (editingID) {
				newUrl += '&edit=' + editingID;
			}

			$location.url(newUrl);
		},
		buildReportFromURL: function($filter, $widgetsArr, $callback) {
			var urlParams = $location.search();

			if (Object.keys(urlParams).length) {
				var $widgets, key, widgetKey, reportData;

				for (key in urlParams) {
					if(urlParams.hasOwnProperty(key)) {
						if(key !== 'edit') {
							if (key === 'reportFilters') {
								$filter = decodeURI(urlParams[key]);
							}
							if (key === 'reportWidgets') {
								$widgets = rison.decode(urlParams[key]);

								if (Object.keys($widgets).length) {
									for (widgetKey in $widgets) {
										$widgetsArr.push($widgets[widgetKey]);
									}
								}
							}
						}
					}
				}

				reportData = {
					reportType: decodeURI(urlParams.reportType),
					reportPreset: JSON.parse(urlParams.reportPreset),
					reportTitle: decodeURI(urlParams.reportTitle),
					reportFilters: $filter,
					reportWidgets: $widgetsArr,
					reportDateRange: JSON.parse(urlParams.reportDateRange),
				};

				$callback(reportData);
			}
		},
		saveReport: function(reportTitle, editID) {
			var reportURL= $location.url();
			reportURL = helpers.removeURLParameter(reportURL, 'edit');

			$window.onbeforeunload = null;

			$http.post('/api/save-report-url', {report_title: reportTitle, report_url: reportURL, editing_id: editID})
				.then(function(results) {
					$window.location.href = results.data;
					$log.log(results.data);
				}, function(error) {
					$log.log(error.data);
				});
		},
		deleteReport: function(report_id) {
			if (confirm("Delete this saved report?")) {
				$http.post('/api/delete_post', {'post_type': 'Report_URL', 'post_id': report_id})
					.then(function(results) {
						$window.location.href = results.data;
						$window.location.reload();
						// $log.log(results.data);
					}, function(error) {
						$log.log(error);
					});
			}
		},
		calcTimeSpent: function(logsData, postID, logKeyX) {
			var totalHours = 0;

			function idExistsInArr(id, arr) {
				return arr.some(function(el) {
					return el.id === id;
				});
			}

			for (var i=0, l=logsData.length; i<l; i++) {
				if ((logsData[i][logKeyX].id === postID) || (angular.isArray(logsData[i][logKeyX]) && idExistsInArr(postID, logsData[i][logKeyX]))) {
					if (logsData[i].activity_hours && typeof logsData[i].activity_hours !== 'undefined') {
						totalHours += logsData[i].activity_hours;
					}
				}
			}

			return totalHours;
		},
		calcTotalExpenses: function(logsData, postID, logKeyX, globalSettings) {
			var curXDataVal, totalExpenses = 0;

			function idExistsInArr(id, arr) {
				return arr.some(function(el) {
					return el.id === id;
				});
			}

			for (var i=0, l=logsData.length; i<l; i++) {
				if (!logsData[i].activity_log) {
					continue;
				}
				curXDataVal = logsData[i].activity_log[logKeyX];

				if ((curXDataVal.id === postID) || (angular.isArray(curXDataVal) && idExistsInArr(postID, curXDataVal))) {
					totalExpenses += parseFloat(helpers.getTotalExpenses(logsData[i], globalSettings));
				}
			}

			return totalExpenses.toFixed(3);

		}
	};
}];
