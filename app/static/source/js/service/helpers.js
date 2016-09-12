/**
 * The service for helper functions.
 */
'use strict';

module.exports = angular.module('helper-services', [])
	.factory('helpers', ['$http', '$log', '$q', function($http, $log, $q) {
		return {
			getCurrentUser: function(callback) {
				$http.get('/api/get_cur_user')
					.then(function(results) {
						callback(results.data.current_user[0]);
						// $log.log(results.data.current_user[0]);
					}, function(error) {
						$log.log(error);
					});
			},
			getPostID: function(postType, postName, callback) {
				$http.post('/api/get_post_id', {"post_type": postType, 'post_name': postName})
					.then(function(results) {
						// $log.log(results);
						callback(results.data.post_id);
					}, function(error) {
						$log.log(error);
					});
			},
			getPostData: function(postType, postID, callback) {
				$http.post('/api/get_post', {"post_type": postType, "id": postID})
					.then(function(results) {
						// $log.log(results.data);
						callback(results.data.post);
					}, function(error) {
						$log.log(error);
					});

			},
			getPosts: function(post_type, filter, callback) {
				filter = typeof filter !== 'undefined' ? filter : '';
				$http.post('/api/get_posts', {"post_type": post_type, "post_filter": filter})
					.then(function(results) {
						// $log.log(results);
						callback(results.data.posts);
					}, function(error) {
						$log.log(error);
					});
			},
			getDeferredPosts: function(post_type, filter, callback) {
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
			},
			isJson: function(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			},
			dateToPDateTime: function(date) {
				Number.prototype.padLeft = function(base,chr){
					var  len = (String(base || 10).length - String(this).length)+1;
					return len > 0? new Array(len).join(chr || '0')+this : this;
				}
				var datetime = [date.getFullYear(),
						(date.getMonth()+1).padLeft(),
						date.getDate().padLeft()].join('-')+' '+
						[date.getHours().padLeft(),
						date.getMinutes().padLeft(),
						date.getSeconds().padLeft()].join(':');
               			return datetime;
			},
			getObjByValue: function(arr, value) {
				var o;
				for (var i=0, l=arr.length; i<l; i++) {
					o = arr[i];

					for (var p in o) {
						if (o.hasOwnProperty(p) && o[p] === value) {
							return o;
						}
					}
				}
			},
			clone: function(obj) {
				if (null === obj || "object" != typeof obj) return obj;
				var copy = obj.constructor();
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
				}
				return copy;
			},
			arrayClean: function(arr, deleteValue) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === deleteValue) {
						arr.splice(i, 1);
						i--;
					}
				}
				return arr;
			},
			getURLParameter: function(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
			},
			removeURLParameter: function(url, parameter) {
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
			},
			getTotalExpenses: function(postData, globalSettings) {
				var expense_total = 0;
				expense_total += (postData.total_mileage * (globalSettings.mileage_reimbursement * 0.01));
				/// HOW DOES CELL REIMBURSEMENT FIT IN??
				var expense_repeaters = [];

				expense_repeaters.push(typeof postData.itemized_meals === "string" ? JSON.parse(postData.itemized_meals) : postData.itemized_meals);
				expense_repeaters.push(typeof postData.hotel_reimbursement === "string" ? JSON.parse(postData.hotel_reimbursement) : postData.hotel_reimbursement);
				expense_repeaters.push(typeof postData.other_reimbursement === "string" ? JSON.parse(postData.other_reimbursement) : postData.other_reimbursement);

				for (var i=0, l=expense_repeaters.length; i<l; i++) {
					for(var r=0, rl=expense_repeaters[i]['field_rows'].length; r<rl; r++) {
						for (var f=0, fl=expense_repeaters[i]['field_rows'][r].length; f<fl; f++) {
							if ((expense_repeaters[i]['field_rows'][r][f]['field_id'] === 'cost') || (expense_repeaters[i]['field_rows'][r][f]['field_id'] === 'item_cost')) {
								expense_total += expense_repeaters[i]['field_rows'][r][f]['field_val'];
							}
						}
					}
				}

				return expense_total;
			},
		};
	}]);
