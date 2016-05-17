/**
 * The single post view controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$sce', '$location', function($scope, $routeParams, $http, $log, $filter, helpers, $sce, $location) {
	$scope.postType = $routeParams.post_type;
	$scope.postData = {};

	$scope.singleTemplate = '../templates/partials/single/single-' + $filter('dasherize')($filter('lowercase')($scope.postType)) + '.html'

	helpers.getPostData($scope.postType, $routeParams.id, function(results) {
		$scope.postData = results;
	});

	$scope.editAccess = function(post_id, post_type, admin_only) {
		var admin_only = typeof admin_only !== 'undefined' ? admin_only : false;
		if ($scope.curUser['urole'] === 'admin') {
			return true;
		}

		if (!admin_only) {
			if (post_type === "User") {
				if (post_id === $scope.curUser['id']) {
					return true;
				}
			}
		}

		return false;
	};

	$scope.deletePost = function(post_id, post_type) {
		$location.path('/confirm').search({post_id: post_id, post_type: post_type, action_url: '/api/delete_post', action_callback: 'redirect'});
	};

}];
