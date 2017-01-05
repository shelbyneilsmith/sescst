/**
 * The activity log controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$window', function($scope, $routeParams, $http, $log, $window) {
	/**
	 * Save Activity Log
	 * @param  {Function} callback Processing function to run after save
	 */
	$scope.saveActivityLog = function(callback) {
		$http.post('/api/save_activity_log', {})
			.then(function(results) {
				callback();
				$log.log(results.data);
			}, function(error) {
				$log.log(error.data);
			});
	};

	/**
	 * Save Expense Sheet
	 * @param  {Function} callback Processing function to run after save
	 */
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
