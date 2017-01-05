/**
 * The directive for jsonText fields.
 */
'use strict';

module.exports = [function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			var lastValid;

			ngModelCtrl.$parsers.push(fromUser);
			ngModelCtrl.$formatters.push(toUser);

			element.bind('blur', function() {
				element.val(toUser(scope.$eval(attrs.ngModel)));
			});

			scope.$watch(attrs.ngModel, function(newValue, oldValue) {
				lastValid = lastValid || newValue;

				if (newValue !== oldValue) {
					ngModelCtrl.$setViewValue(toUser(newValue));

					ngModelCtrl.$render();
				}
			}, true);

			function fromUser(text) {
				if (!text || text.trim() === '') {
					return {};
				} else {
					try {
						lastValid = angular.fromJson(text);
						ngModelCtrl.$setValidity('invalidJson', true);
					} catch(e) {
						ngModelCtrl.$setValidity('invalidJson', false);
					}
					return lastValid;
				}
			}

			function toUser(object) {
				return angular.toJson(object, true);
			}
		}
	};
}];
