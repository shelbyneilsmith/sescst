/**
 * The main controller for the staff tools app. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', '$templateCache', function($scope, $routeParams, $http, $log, $filter, $templateCache) {
	$scope.postType = $routeParams.post_type;


	// fire the API request
	$http.post('/api/list-posts', {"post_type": $scope.postType})
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
