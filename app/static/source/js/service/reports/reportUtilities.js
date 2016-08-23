module.exports = ['$log', '$location', '$http', '$window', '$routeParams', 'helpers', function($log, $location, $http, $window, $routeParams, helpers) {
	var rison = require('rison');
	return {
		buildReportURL: function($widgets) {
			var risonWidgetData;
			var editingID = null;
			if ($location.search('edit')) {
				editingID = $routeParams.edit;
			}
			var curPath = $location.path();
			var newUrl = curPath + '?';

			for(var i=0, l=$widgets.length; i<l; i++) {
				risonWidgetData = rison.encode($widgets[i]);
				// $log.log(risonWidgetData);
				newUrl += $widgets[i].id + '=' + risonWidgetData + '&';
			}
			if (editingID) {
				newUrl += 'edit=' + editingID;
			}

			$location.url(newUrl);
		},
		buildReportFromURL: function($widgetsArr) {
			var urlParams = $location.search();
			if (Object.keys(urlParams).length) {
				var $widgets = [];

				for (var key in urlParams) {
					if(key !== 'edit') {
						if(urlParams.hasOwnProperty(key)) {
							$widgetsArr.push(rison.decode(urlParams[key]));
						}
					}
				}

			}
		},
		saveReport: function(editID) {
			var reportURL= $location.url();
			reportURL = helpers.removeURLParameter(reportURL, 'edit');

			// $log.log(isEditing);
			$http.post('/api/save-report-url', {report_url: reportURL, editing_id: editID})
				.then(function(results) {
					$window.location.href = results.data;
					// $location.url(results.data);
					// $window.location.reload();
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
