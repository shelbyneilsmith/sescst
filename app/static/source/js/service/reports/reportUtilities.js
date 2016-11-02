module.exports = ['$log', '$location', '$http', '$window', '$routeParams', 'helpers', function($log, $location, $http, $window, $routeParams, helpers) {
	var rison = require('rison');
	return {
		buildReportURL: function($reportType, $reportPreset, $reportTitle, $reportFilters, $widgets) {
			var $widgets = typeof $widgets !== 'undefined' ? $widgets : null;
			var risonWidgetData;
			var editingID = null;
			if ($location.search('edit')) {
				editingID = $routeParams.edit;
			}
			var curPath = $location.path();
			var newUrl = curPath + '?';

			newUrl += 'reportType=' + encodeURI($reportType);
			newUrl += '&reportPreset=' + JSON.stringify($reportPreset);
			newUrl += '&reportTitle=' + encodeURI($reportTitle);
			newUrl += '&reportFilters=' + encodeURI($reportFilters);

			if ($widgets.length) {
				newUrl += '&reportWidgets=';

				var widgetsObj = {};

				for(var i=0, l=$widgets.length; i<l; i++) {
					widgetsObj[$widgets[i].id] = $widgets[i];
				}

				newUrl += rison.encode(widgetsObj) + '&';
			$log.log(newUrl);
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
								// $log.log(urlParams[key]);
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
				};
				$callback(reportData);
			}
		},
		saveReport: function(editID) {
			var reportURL= $location.url();
			reportURL = helpers.removeURLParameter(reportURL, 'edit');

			$window.onbeforeunload = null;

			$http.post('/api/save-report-url', {report_url: reportURL, editing_id: editID})
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
		calcTimeSpent: function(userObj, logs) {
			// $log.log(logs);
			var totalHours = 0;
			for (var i=0, l=logs.length; i<l; i++) {
				if (logs[i].user.id === userObj.id) {
					if (logs[i].activity_hours && typeof logs[i].activity_hours !== 'undefined') {
						totalHours += logs[i].activity_hours;
					}
				}
			}

			return totalHours;
		},
		// processYMetric: function(metric_val, post_type, filter, callback) {
		// 	helpers.getPosts(post_type, filter, callback);
		// },
	};
}];
