'use strict';

module.exports = angular.module('sescst-posts', [])
	.controller('PostCtrl', require('../controller/posts/postCtrl'))
	.controller('ActivityLogFormCtrl', require('../controller/posts/activityLogFormCtrl'))

	.directive('postfield', require('../directive/posts/postField'))
