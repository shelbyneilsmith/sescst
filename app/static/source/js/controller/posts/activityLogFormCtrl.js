/**
 * The activity log controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$window', function($scope, $routeParams, $http, $log, $window) {
	// $scope.createActivityLog = function(al_form_data, es_form_data) {
	// 	$log.log(al_form_data);
	// 	// $scope.saveActivityLog(function() {
	// 	// 	$scope.saveExpenseSheet(function() {
	// 	// 		// $window.location.href = '/#/posts?post_type=Activity_Log';
	// 	// 	});
	// 	// })
	// };

	$scope.saveActivityLog = function(callback) {
		$http.post('/api/save_activity_log', {})
			.then(function(results) {
				callback();
				$log.log(results.data);
			}, function(error) {
				$log.log(error.data);
			});
	};

	$scope.saveExpenseSheet = function(callback) {
		$http.post('/api/save_expense_sheet', {})
			.then(function(results) {
				callback();
				$log.log(results.data);
			}, function(error) {
				$log.log(error.data);
			});
	};
}];
