/**
 * The directive for the hide/show password checkbox feature.
 */
'use strict';

module.exports = function() {
	return {
		restrict: 'E',
		replace: true,
		scope: '=',
		templateUrl: '../templates/partials/forms/hideshow-password.html',
		link: function(scope) {
			scope.passwordInputType = 'password';

			scope.hideShowPassword = function() {
				if (scope.passwordInputType === 'password') {
					scope.passwordInputType = 'text';
				} else {
					scope.passwordInputType = 'password';
				}
			};
		}
	};
};
