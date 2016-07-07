'use strict';

module.exports = angular.module('sescst-utils', [])
	// .run(['$rootScope', function($rootScope) {
	// 	// $rootScope.Utils = {
	// 	// 	keys: Object.keys
	// 	// };
	// 	$rootScope.constructor.prototype.getKeys = Object.keys;
	// }])
	.directive('dynamicElement', require('../directive/utils/dynamicElement'))
	.directive('staticInclude', require('../directive/utils/staticInclude'));
