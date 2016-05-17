'use strict';

module.exports = angular.module('sescst-forms', [])
	.controller('formCtrl', require('../controller/formCtrl'))

	.directive('hideshowpass', require('../directive/forms/hideShowPassword'))
	.directive('focusMe', require('../directive/forms/focusField'))
	// .directive('blurMe', require('../directive/forms/blurField'))
