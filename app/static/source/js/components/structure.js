'use strict';

module.exports = angular.module('sescst-structure', [])
	.directive('header', require('../directive/structure/sescHeaderDiv'))
	.directive('sidebar', require('../directive/structure/sescSidebarDiv'))
	.directive('main', require('../directive/structure/sescMainDiv'))
	.directive('footer', require('../directive/structure/sescFooterDiv'))

	.controller('sescHeaderCtrl', require('../controller/structure/sescHeaderCtrl'))
	.controller('sescSidebarCtrl', require('../controller/structure/sescSidebarCtrl'))
	.controller('sescMainCtrl', require('../controller/structure/sescMainCtrl'))
	.controller('sescFooterCtrl', require('../controller/structure/sescFooterCtrl'));
