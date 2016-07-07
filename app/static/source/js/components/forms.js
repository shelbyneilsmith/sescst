'use strict';

module.exports = angular.module('sescst-forms', [])
	.controller('formCtrl', require('../controller/formCtrl'))

	.directive('formInclude', require('../directive/forms/formInclude'))

	.directive('hideshowpass', require('../directive/forms/hideShowPassword'))
	.directive('focusMe', require('../directive/forms/focusField'))
	// .directive('blurMe', require('../directive/forms/blurField'))

	.directive('multiSelectChecker', require('../directive/forms/multiSelectChecker'))

	.directive('select2Field', require('../directive/forms/select2Field'))
	.directive('datePickerField', require('../directive/forms/datePickerField'))
	.directive('repeaterField', require('../directive/forms/repeaterField'))
	.directive('wtfRepeaterField', require('../directive/forms/wtfRepeaterField'))
