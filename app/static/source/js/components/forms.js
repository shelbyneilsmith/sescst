'use strict';

module.exports = angular.module('sescst-forms', [])
	.controller('formCtrl', require('../controller/formCtrl'))

	.directive('formInclude', require('../directive/forms/formInclude'))

	.directive('formField', require('../directive/forms/formField'))

	.directive('hideshowpass', require('../directive/forms/hideShowPassword'))
	.directive('focusMe', require('../directive/forms/focusField'))
	// .directive('blurMe', require('../directive/forms/blurField'))

	.directive('multiSelectChecker', require('../directive/forms/multiSelectChecker'))

	.directive('select2Field', require('../directive/forms/select2Field'))
	.directive('datePickerField', require('../directive/forms/datePickerField'))
	.directive('simpleRepeaterForm', require('../directive/forms/simpleRepeaterForm'))
	.directive('complexRepeaterField', require('../directive/forms/complexRepeaterField'))
