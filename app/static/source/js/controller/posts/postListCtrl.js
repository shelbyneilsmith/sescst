/**
 * The post list controller for the staff tools app.
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', '$templateCache', '$sce', 'helpers', '$rootScope', function($scope, $routeParams, $http, $log, $filter, $templateCache, $sce, helpers, $rootScope) {
	$scope.postType = $routeParams.post_type;
	$scope.postFilter = typeof $routeParams.post_filter !== 'undefined' ? $routeParams.post_filter : '';
	$scope.postFilterKey = typeof $routeParams.post_filter_key !== 'undefined' ? $routeParams.post_filter_key : '';
	$scope.postFilterVal = typeof $routeParams.post_filter_val !== 'undefined' ? $routeParams.post_filter_val : '';

	$scope.createPostURL = '/admin/create-' + $filter('dasherize')($filter('lowercase')($scope.postType));
	if ($scope.postType === 'Report_URL') {
		$scope.createPostURL = '/admin/report-builder';
	}

	// fire the API request
	$('.post-list-wrap .spinner-wrap').hide();
	$scope.postsLoadingSpinner = $sce.trustAsHtml(helpers.makeSpinnerOverlay());
	$('.post-list-wrap .spinner-wrap').fadeIn();

	$http.post('/api/get_posts', {"post_type": $scope.postType, "post_filter": $scope.postFilter})
		.then(function(results) {
			$scope.postList = results.data;

			$('.post-list-wrap .spinner-wrap').fadeOut(250, function() {
				$scope.postsLoadingSpinner = null;
			});
			$scope.getListTemplate = function() {
				if ($scope.postList.posts.length) {
					return '../templates/partials/archive/posts-' + $filter('dasherize')($filter('lowercase')($scope.postType)) + '.html';
				}
				return '../templates/partials/archive/empty-results.html';
			};
		}, function(error) {
			$log.log(error);
		});

	$scope.deletePost = helpers.deletePost;
}];
