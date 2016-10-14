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
			// $scope.postData.expense_total = helpers.getTotalExpenses($scope.postData, $scope.globalSettings);
		}
	});


	$scope.editAccess = function(post_id, post_type, admin_only) {
		var admin_only = typeof admin_only !== 'undefined' ? admin_only : false;
		if ($scope.curUser['urole'] === 'Administrator') {
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
		var actionCallback, deleteRelMsg = '', deleteRelType = null, deleteRelID = null;
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
