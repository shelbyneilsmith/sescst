/**
 * The confirm page controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$window', function($scope, $routeParams, $http, $log, $filter, helpers, $window) {
	$scope.postType = $routeParams.post_type;
	$scope.postID = $routeParams.post_id;

	var action_url = $routeParams.action_url;
	var action_callback = $routeParams.action_callback;

	$scope.redirect = function(url) {
		$window.location.href = url;
		$window.location.reload();
	};

	$scope.confirm = function() {
		$http.post(action_url, {'post_type': $scope.postType, 'post_id': $scope.postID})
			.then(function(results) {
				$scope[action_callback](results.data);
				// $log.log(results.data);
			}, function(error) {
				$log.log(error);
			});
	};

	$scope.cancel = function() {
		window.history.back();
	};
}];
