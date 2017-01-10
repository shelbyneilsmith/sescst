/**
 * The service for helper functions.
 */
'use strict';

module.exports = angular.module('helper-services', [])
	.factory('helpers', ['$http', '$log', '$q', '$location', function($http, $log, $q, $location) {
		var helpers = {};

		helpers.getCurrentUser = function(callback) {
			$http.get('/api/get_cur_user')
				.then(function(results) {
					callback(results.data.current_user[0]);
					// $log.log(results.data.current_user[0]);
				}, function(error) {
					$log.log(error);
				});
		};

		helpers.makeSpinner = function() {
			var numBalls = 8;
			var spinnerHTML = '<div class="spinner">';

			for (var i=0; i<numBalls; i++) {
				spinnerHTML += '<div><div></div></div>';
			}

			spinnerHTML += '</div>';

			return spinnerHTML;
		};

		helpers.makeSpinnerOverlay = function() {
			var overlayHTML = '<div class="spinner-overlay">';
			overlayHTML += helpers.makeSpinner();
			overlayHTML += '</div>';

			return overlayHTML;
		};

		helpers.getPostID = function(postType, postName, callback) {
			$http.post('/api/get_post_id', {"post_type": postType, 'post_name': postName})
				.then(function(results) {
					// $log.log(results);
					callback(results.data.post_id);
				}, function(error) {
					$log.log(error);
				});
		};

		helpers.getPostData = function(postType, postID, callback) {
			$http.post('/api/get_post', {"post_type": postType, "id": postID})
				.then(function(results) {
					// $log.log(results.data);
					callback(results.data.post);
				}, function(error) {
					$log.log(error);
				});

		};

		helpers.getPosts = function(post_type, filter, callback) {
			filter = typeof filter !== 'undefined' ? filter : '';
			$http.post('/api/get_posts', {"post_type": post_type, "post_filter": filter})
				.then(function(results) {
					// $log.log(results);
					callback(results.data.posts);
				}, function(error) {
					$log.log(error);
				});
		};

		helpers.getDeferredPosts = function(post_type, filter, callback) {
			var deferred = $q.defer();
			$http.post('/api/get_posts', {"post_type": post_type, "post_filter": filter})
				.then(function(results) {
					// $log.log(results);
					callback(results.data.posts, function(returnData) {
						deferred.resolve(returnData);
					});
				}, function(error) {
					$log.log(error);
				});

			return deferred.promise;
		};

		/**
		 * The function for deleting the current post
		 * @param  {integer} post_id   The id of the post to be deleted
		 * @param  {string} post_type The type of the post to be deleted
		 */
		helpers.deletePost = function(post_id, post_type, post_data) {
			var actionCallback, deleteRelMsg = '', deleteRelType = null, deleteRelID = null;
			post_data = typeof post_data !== 'undefined' ? post_data : null;

			// Check type of post, ask user if they want to
			// delete corresponding activity log or expense sheet
			if (post_data) {
				if (post_data.expense_sheet) {
					if (post_type === 'Activity_Log') {
						deleteRelMsg = 'Delete Related Expense Sheet as Well?';
						deleteRelID = post_data.expense_sheet;
						deleteRelType = 'Expense_Sheet';
					}
				}
				if (post_data.activity_log) {
					if (post_type === 'Expense_Sheet') {
						deleteRelMsg = 'Delete Related Activity Log as Well?';
						deleteRelID = post_data.activity_log.id;
						deleteRelType = 'Activity_Log';
					}
				}
			}

			if (deleteRelID) {
				actionCallback = 'deleteRelConfirm';
			} else {
				actionCallback = 'redirect';
			}
			$location.path('/confirm').search({post_id: post_id, post_type: post_type, action_url: '/api/delete_post', action_callback: actionCallback, delete_rel_type: deleteRelType, delete_rel_id: deleteRelID, delete_rel_msg: deleteRelMsg});
		};

		helpers.isJson = function(str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		};

		helpers.dateToPDateTime = function(date) {
			Number.prototype.padLeft = function(base,chr){
				var  len = (String(base || 10).length - String(this).length)+1;
				return len > 0? new Array(len).join(chr || '0')+this : this;
			};

			var datetime = [date.getFullYear(),
					(date.getMonth()+1).padLeft(),
					date.getDate().padLeft()].join('-')+' '+
					[date.getHours().padLeft(),
					date.getMinutes().padLeft(),
					date.getSeconds().padLeft()].join(':');
            			return datetime;
		};

		helpers.getObjByValue = function(arr, value) {
			var o;
			for (var i=0, l=arr.length; i<l; i++) {
				o = arr[i];

				for (var p in o) {
					if (o.hasOwnProperty(p) && o[p] === value) {
						return o;
					}
				}
			}
		};

		helpers.clone = function(obj) {
			if (null === obj || "object" != typeof obj) return obj;
			var copy = obj.constructor();
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
			}
			return copy;
		};

		helpers.arrayClean = function(arr, deleteValue) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === deleteValue) {
					arr.splice(i, 1);
					i--;
				}
			}
			return arr;
		};

		helpers.getURLParameter = function(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
		};

		helpers.removeURLParameter = function(url, parameter) {
			//prefer to use l.search if you have a location/link object
			var urlparts= url.split('?');
			if (urlparts.length>=2) {

				var prefix= encodeURIComponent(parameter)+'=';
				var pars= urlparts[1].split(/[&;]/g);

				//reverse iteration as may be destructive
				for (var i= pars.length; i-- > 0;) {
					//idiom for string.startsWith
					if (pars[i].lastIndexOf(prefix, 0) !== -1) {
						pars.splice(i, 1);
					}
				}

				url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
				return url;
			} else {
				return url;
			}
		};

		helpers.getTotalExpenses = function(postData, globalSettings) {
			var expense_total = 0;
			expense_total += (postData.total_mileage * (globalSettings.mileage_reimbursement * 0.01));
			/// HOW DOES CELL REIMBURSEMENT FIT IN??
			var expense_repeaters = [];

			expense_repeaters.push(typeof postData.itemized_meals === "string" ? JSON.parse(postData.itemized_meals) : postData.itemized_meals);
			expense_repeaters.push(typeof postData.hotel_reimbursement === "string" ? JSON.parse(postData.hotel_reimbursement) : postData.hotel_reimbursement);
			expense_repeaters.push(typeof postData.other_reimbursement === "string" ? JSON.parse(postData.other_reimbursement) : postData.other_reimbursement);

			for (var i=0, l=expense_repeaters.length; i<l; i++) {
				for(var r=0, rl=expense_repeaters[i].field_rows.length; r<rl; r++) {
					for (var f=0, fl=expense_repeaters[i].field_rows[r].length; f<fl; f++) {
						if ((expense_repeaters[i].field_rows[r][f].field_id === 'cost') || (expense_repeaters[i].field_rows[r][f].field_id === 'item_cost')) {
							expense_total += expense_repeaters[i].field_rows[r][f].field_val;
						}
					}
				}
			}

			return expense_total;
		};

		helpers.buildQueryFilter = function(filtersArr, postType, datekeys) {
			var curFilter, filterType, filterData;
			var filter_date_range = [0, new Date()];
			var filter = '[';
			var logLevel2 = '';

			filtersArr = typeof filtersArr !== 'undefined' ? filtersArr : [];

			for (var i=0, l=filtersArr.length; i<l; i++) {
				curFilter = filtersArr[i];

				filterType =  typeof curFilter.filterSelect !== 'undefined' ? curFilter.filterSelect.value : curFilter.filterType;

				if (curFilter.hasOwnProperty('filterData')) {
					filterData = curFilter.filterData;
				}

				if (filterType === 'date_range' || (filterType.hasOwnProperty('value') && filterType.value === 'date_range')) {
					filter_date_range[0] = new Date(curFilter.reportStartDate);
					filter_date_range[1] = new Date(curFilter.reportEndDate);

					filter += postType + "." + datekeys[0] + " >= '" + helpers.dateToPDateTime(filter_date_range[0]) + "', ";
					filter += postType + "." + datekeys[1] + " <= '" + helpers.dateToPDateTime(filter_date_range[1]) + "'";
				}

				if (filterType === 'user' || (filterType.hasOwnProperty('value') && filterType.value === 'user')) {
					if (curFilter.hasOwnProperty('reportActivity')) {
						filterData = curFilter.reportUser;
					}
					filter += postType + ".user.has(id=" + filterData.value + ")";
				}

				if (filterType === 'district' || (filterType.hasOwnProperty('value') && filterType.value === 'district')) {
					if (curFilter.hasOwnProperty('reportDistrict')) {
						filterData = curFilter.reportDistrict;
					}
					filter += postType + ".districts.any(id=" + filterData.value + ")";
				}

				if (filterType === 'school' || (filterType.hasOwnProperty('value') && filterType.value === 'school')) {
					if (curFilter.hasOwnProperty('reportSchool')) {
						filterData = curFilter.reportSchool;
					}
					filter += postType + ".schools.any(id=" + filterData.value + ")";
				}

				if (filterType === 'activity_type' || (filterType.hasOwnProperty('value') && filterType.value === 'activity_type')) {
					if (curFilter.hasOwnProperty('reportActivity')) {
						filterData = curFilter.reportActivity;
					}
					filter += postType + ".activity_types.any(id=" + filterData.value + ")";
				}

				if (i < (l - 1)) {
					filter += ', ';
				}
			}

			filter += ']';

			return filter;
		};

		helpers.getHighestWidgetID = function(widgets) {
			var id_array = [];

			for (var i=0, l=widgets.length; i<l; i++) {
				id_array.push(widgets[i].id.split('-')[1]);
			}

			return Math.max.apply( Math, id_array );
		};

		return helpers;
	}]);
