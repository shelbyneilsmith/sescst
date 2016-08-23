/**
 * The main controller for the staff tools app. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', '$templateCache', function($scope, $routeParams, $http, $log, $filter, $templateCache) {
	$scope.postType = $routeParams.post_type;
	$scope.postFilter = typeof $routeParams.post_filter !== 'undefined' ? $routeParams.post_filter : '';
	$scope.postFilterKey = typeof $routeParams.post_filter_key !== 'undefined' ? $routeParams.post_filter_key : '';
	$scope.postFilterVal = typeof $routeParams.post_filter_val !== 'undefined' ? $routeParams.post_filter_val : '';

	$scope.createPostURL = '/admin/create-' + $filter('dasherize')($filter('lowercase')($scope.postType));
	if ($scope.postType === 'Report_URL') {
		$scope.createPostURL = '/admin/report-builder';
	}

	// fire the API request
	$http.post('/api/get_posts', {"post_type": $scope.postType, "post_filter": $scope.postFilter})
		.then(function(results) {
			$scope.postList = results.data;

			$scope.getListTemplate = function() {
				if ($scope.postList.posts.length) {
					return '../templates/partials/archive/posts-' + $filter('dasherize')($filter('lowercase')($scope.postType)) + '.html';
				}
				return '../templates/partials/archive/empty-results.html';
			};
		}, function(error) {
			$log.log(error);
		});
}];
