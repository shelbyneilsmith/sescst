/**
 * The service for helper functions.
 */
'use strict';

module.exports = angular.module('helper-services', [])
	.factory('helpers', ['$http', '$log', function($http, $log) {
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
				var filter = typeof filter !== 'undefined' ? filter : '';
				$http.post('/api/get_posts', {"post_type": post_type, "post_filter": filter})
					.then(function(results) {
						// $log.log(results);
						callback(results.data.posts);
					}, function(error) {
						$log.log(error);
					});
			},
		};
	}]);
