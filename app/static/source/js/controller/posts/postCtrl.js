/**
 * The single post view controller. The controller:
 * -
 */
'use strict';

module.exports = ['$scope', '$routeParams', '$http', '$log', '$filter', 'helpers', '$sce', '$location', function($scope, $routeParams, $http, $log, $filter, helpers, $sce, $location) {
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

	/**
	 * The function for deleting the current post
	 * @param  {integer} post_id   The id of the post to be deleted
	 * @param  {string} post_type The type of the post to be deleted
	 */
	$scope.deletePost = function(post_id, post_type) {
		var actionCallback, deleteRelMsg = '', deleteRelType = null, deleteRelID = null;

		// Check type of post, ask user if they want to
		// delete corresponding activity log or expense sheet
		if ($scope.postData.expense_sheet) {
			if (post_type === 'Activity_Log') {
				deleteRelMsg = 'Delete Related Expense Sheet as Well?';
				deleteRelID = $scope.postData.expense_sheet;
				deleteRelType = 'Expense_Sheet';
			}
		}
		if ($scope.postData.activity_log) {
			if (post_type === 'Expense_Sheet') {
				deleteRelMsg = 'Delete Related Activity Log as Well?';
				deleteRelID = $scope.postData.activity_log.id;
				deleteRelType = 'Activity_Log';
			}
		}

		if (deleteRelID) {
			actionCallback = 'deleteRelConfirm';
		} else {
			actionCallback = 'redirect';
		}
		$location.path('/confirm').search({post_id: post_id, post_type: post_type, action_url: '/api/delete_post', action_callback: actionCallback, delete_rel_type: deleteRelType, delete_rel_id: deleteRelID, delete_rel_msg: deleteRelMsg});
	};

}];
