'use strict';

module.exports = angular.module('sescst-structure', [])
	.directive('sidebar', require('../directive/structure/sescSidebarDiv'))
	.directive('main', require('../directive/structure/sescMainDiv'))

	.controller('sescHeaderCtrl', require('../controller/structure/sescHeaderCtrl'))
	.controller('sescSidebarCtrl', require('../controller/structure/sescSidebarCtrl'))
	.controller('sescFooterCtrl', require('../controller/structure/sescFooterCtrl'));
