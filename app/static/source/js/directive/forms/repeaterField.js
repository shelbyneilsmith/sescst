/**
 * The directive for repeater fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', function($http, $log, $timeout) {
	var tpl = "<form class='post-field' ng-submit='addItem()'><fieldset class='form-group'> \
		<ul><li class='hover-link' ng-repeat='item in curData'>{[ item ]} <a class='edit-link' ng-click='removeItem(item)'>Delete</a></li></ul> \
		<input type='text' placeholder='{[ placeholder ]}' ng-model='newItem' /> \
		<a class='btn btn-small btn-primary' ng-click='addItem()'>Add {[ label ]}</a> \
		</fieldset></form>";

	return {
		restrict: 'E',
		replace: true,
		scope: {
			curData: '=data',
			label: '@',
			placeholder: '@',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$log.log($scope.curData);
			$scope.newItem = '';
		}],
		link: function(scope, elem, attrs) {
			scope.addItem = function() {
				scope.curData.push(scope.newItem);
				scope.newItem = '';
			};

			scope.removeItem = function(item) {
				var index = scope.curData.indexOf(item);
				scope.curData.splice(index, 1);
			};
		}
	};
}];
