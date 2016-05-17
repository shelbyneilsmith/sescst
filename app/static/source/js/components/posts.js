'use strict';

module.exports = angular.module('sescst-posts', [])
	.controller('PostCtrl', require('../controller/postCtrl'))

	.directive('postfield', require('../directive/posts/postField'))
