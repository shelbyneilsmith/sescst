'use strict';

module.exports = angular.module('sescst-utils', [])
	.directive('dynamicElement', require('../directive/utils/dynamicElement'))
	.directive('staticInclude', require('../directive/utils/staticInclude'));
