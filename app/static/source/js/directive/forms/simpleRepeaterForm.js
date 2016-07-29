/**
 * The directive for simple repeater forms.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', 'helpers', function($http, $log, $timeout, helpers) {
	var tpl = "<form class='post-field' ng-submit='addItem()'><fieldset class='form-group'> \
		<input id='{[ fieldName ]}' name='{[ fieldName ]}' type='text' ng-hide='true' ng-model='inData'><br /> \
		<table ng-if='curData' class='table table-striped table-hover table-responsive'> \
		<thead><tr><th ng-repeat='field in fields track by $index'>{[ field.fieldLabel ]}</th></tr></thead> \
		<tbody><tr class='hover-link' ng-repeat='row in curData track by $index'> \
		<td ng-repeat='field in row track by $index'>{[ field ]}</td> \
		<td><a class='edit-link' ng-click='removeItem($index)'>Delete</a></td> \
		<td>&nbsp;</td></tr> \
		<tr><td ng-repeat='f in fields track by $index'><form-field model='newItem[$index]' placeholder='{[ f.fieldLabel ]}' type='{[ f.fieldType ]}'></form-field></td> \
		<td><a class='btn btn-small btn-primary' ng-click='addItem()'>Add {[ label ]}</a></td> \
		</tr></tbody></table></fieldset></form>";

	return {
		restrict: 'E',
		replace: true,
		scope: {
			inData: '=data',
			fieldName: '@',
			label: '@',
			fields: '=',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$timeout(function() {
				var clonedData = helpers.clone($scope.inData);
				if (typeof clonedData !== 'undefined') {
					$scope.curData = helpers.isJson(clonedData) ? JSON.parse(clonedData) : clonedData;
				} else {
					$scope.curData = [];
				}
				$scope.inData = JSON.stringify($scope.curData);
				$scope.newItem = [];
			}, 300);
		}],
		link: function(scope, elem, attrs) {
			scope.addItem = function() {
				$log.log(scope.newItem);
				var i, l, dataOutput = {};
				for (i=0, l=scope.fields.length; i < l; i++) {
					var fieldName = scope.fields[i]['fieldName'];
					dataOutput[fieldName] = scope.newItem[i];
				}
				scope.curData.push(dataOutput);
				scope.inData = JSON.stringify(scope.curData);
				scope.newItem = [];
			};

			scope.removeItem = function(index) {
				scope.curData.splice(index, 1);
				scope.inData = JSON.stringify(scope.curData);
			};

		}
	};
}];
