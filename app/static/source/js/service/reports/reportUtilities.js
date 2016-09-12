module.exports = ['$log', '$location', '$http', '$window', '$routeParams', 'helpers', function($log, $location, $http, $window, $routeParams, helpers) {
	var rison = require('rison');
	return {
		buildReportURL: function($reportType, $reportTitle, $getPostType, $reportFilters, $widgets) {
			var $widgets = typeof $widgets !== 'undefined' ? $widgets : null;
			var risonWidgetData;
			var editingID = null;
			if ($location.search('edit')) {
				editingID = $routeParams.edit;
			}
			var curPath = $location.path();
			var newUrl = curPath + '?';

			newUrl += 'reportType=' + JSON.stringify($reportType);
			newUrl += '&postType=' + encodeURI($getPostType);
			newUrl += '&reportTitle=' + encodeURI($reportTitle);
			newUrl += '&reportFilters=' + encodeURI($reportFilters);

			if ($widgets.length) {
				newUrl += '&reportWidgets=';

				var widgetsObj = {};

				for(var i=0, l=$widgets.length; i<l; i++) {
					// risonWidgetData = rison.encode($widgets[i]);
					// $log.log(risonWidgetData);
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
					reportType: JSON.parse(urlParams.reportType),
					getPostType: decodeURI(urlParams.postType),
					reportTitle: decodeURI(urlParams.reportTitle),
					reportFilters: $filter,
					reportWidgets: $widgetsArr
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
		}
	};
}];
