'use strict';

module.exports = angular.module('sescst-utils', [])
	.directive('jsonText', require('../directive/utils/jsonText'))
	.directive('dynamicElement', require('../directive/utils/dynamicElement'));
	// .directive('staticInclude', require('../directive/utils/staticInclude'));
