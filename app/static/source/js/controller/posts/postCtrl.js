/**
 * The single post view controller.
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$sce', '$location', '$rootScope', function($scope, $routeParams, $http, $log, $filter, helpers, $sce, $location, $rootScope) {
	$scope.postType = $routeParams.post_type;
	$scope.postData = {};

	// Get the single template for the current post
	$scope.singleTemplate = '../templates/partials/single/single-' + $filter('dasherize')($filter('lowercase')($scope.postType)) + '.html'

	// Get the post data for the current post
	helpers.getPostData($scope.postType, $routeParams.id, function(results) {
		$scope.postData = results;
		for (var key in $scope.postData) {
			if ($scope.postData.hasOwnProperty(key)) {
				if ((typeof $scope.postData[key] === 'string') && helpers.isJson($scope.postData[key])) {
					$scope.postData[key] = JSON.parse($scope.postData[key]);
				}
			}
		}

		// Reimbursement Totals for Expense Sheets
		if ($scope.postType === 'Expense_Sheet') {
			$scope.getTotalExpenses = helpers.getTotalExpenses;
		}
	});

	/**
	 * Set whether or not the current user can edit the post
	 * @param  {integer} post_id    The id of the current post
	 * @param  {string} post_type  The type of the current post
	 * @param  {boolean} admin_only Whether or not the field can be edited by anyone beside the admin
	 * @return {boolean}            Whether or not the field can be edited by the current user
	 */
	$scope.editAccess = function(post_id, post_type, admin_only) {
		// set default for admin_only variable
		var admin_only = typeof admin_only !== 'undefined' ? admin_only : false;
		// check if current user is an admin - admins can always edit fields!
		if ($scope.curUser['urole'] === 'Administrator') {
			return true;
		}

		// check if field is set to "admin_only"
		// then check if the post is the user's own profile
		// (SHOULD WE LET USERS EDIT THEIR OWN ACTIVITY LOGS & EXPENSE SHEETS?)
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
		helpers.deletePost(post_id, post_type, $scope.postData);
	};
}];
