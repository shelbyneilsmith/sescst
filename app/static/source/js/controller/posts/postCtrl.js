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
			var expense_total = 0;
			expense_total += ($scope.postData.total_mileage * ($scope.globalSettings.mileage_reimbursement * 0.01));
			/// HOW DOES CELL REIMBURSEMENT FIT IN??
			var expense_repeaters = [
				$scope.postData.itemized_meals,
				$scope.postData.hotel_reimbursement,
				$scope.postData.other_reimbursement,
			];
			for (var i=0, l=expense_repeaters.length; i<l; i++) {
				for(var r=0, rl=expense_repeaters[i]['field_rows'].length; r<rl; r++) {
					for (var f=0, fl=expense_repeaters[i]['field_rows'][r].length; f<fl; f++) {
						if ((expense_repeaters[i]['field_rows'][r][f]['field_id'] === 'cost') || (expense_repeaters[i]['field_rows'][r][f]['field_id'] === 'item_cost')) {
							expense_total += expense_repeaters[i]['field_rows'][r][f]['field_val'];
						}
					}
				}
			}

			$scope.postData.expense_total = expense_total;
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
