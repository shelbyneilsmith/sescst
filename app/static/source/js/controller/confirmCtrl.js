/**
 * The confirm page controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$window', 'modalService', function($scope, $routeParams, $http, $log, $filter, helpers, $window, modalService) {
	$scope.postType = $routeParams.post_type;
	$scope.postID = $routeParams.post_id;
	$scope.deleteRelType = $routeParams.delete_rel_type;
	$scope.deleteRelID = $routeParams.delete_rel_id;
	$scope.deleteRelMsg = $routeParams.delete_rel_msg;

	var action_url = $routeParams.action_url;
	var action_callback = $routeParams.action_callback;

	$scope.redirect = function(url) {
		$window.location.href = url;
		$window.location.reload();
	};

	$scope.deleteRelConfirm = function() {
		var modalOptions = {
			closeButtonText: 'No',
			actionButtonText: 'Yes',
			headerText: 'Delete Corresponding ' + $filter('underscoreless')($scope.deleteRelType) + '?',
			bodyText: $scope.deleteRelMsg
		};

		modalService.showModal({}, modalOptions).then(function(result) {
			$http.post('/api/delete_post', {'post_type': $scope.deleteRelType, 'post_id': $scope.deleteRelID})
				.then(function(results) {
					$scope['redirect'](results.data);
					// $log.log(results.data);
				}, function(error) {
					$log.log(error);
				});
		}, function() {
			$scope['redirect']('/#/posts?post_type=' + $scope.postType);
		});
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
