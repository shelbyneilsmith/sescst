/**
 * The directive for simple repeater forms.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', 'helpers', function($http, $log, $templateCache, $compile, $templateRequest, $timeout, helpers) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			inData: '=data',
			fieldName: '@',
			label: '@',
			fields: '=',
		},
		controller: ['$scope', function($scope) {
			$scope.$watch('inData', function(newValue) {
				var clonedData = helpers.clone($scope.inData);
				if (typeof clonedData !== 'undefined') {
					$scope.curData = helpers.isJson(clonedData) ? JSON.parse(clonedData) : clonedData;
				} else {
					$scope.curData = [];
				}
				$scope.inData = JSON.stringify($scope.curData);
				$scope.newItem = [];

				$scope.editorFlags = [];
				for(var i=0, l=$scope.curData.length; i<l; i++) {
					$scope.editorFlags.push({editing: false});
				}
			});
		}],
		link: function(scope, element, attrs) {
			$templateRequest('../templates/partials/forms/fields/simpleRepeater.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});

			scope.addItem = function() {
				var i, l, dataOutput = {};
				for (i=0, l=scope.fields.length; i < l; i++) {
					var fieldName = scope.fields[i].fieldName;
					dataOutput[fieldName] = scope.newItem[i];
				}
				scope.curData.push(dataOutput);
				scope.inData = JSON.stringify(scope.curData);
				scope.newItem = [];
				scope.editorFlags.push({editing: false});
			};

			scope.removeItem = function(index) {
				scope.curData.splice(index, 1);
				scope.editorFlags.splice(index, 1);
				scope.inData = JSON.stringify(scope.curData);
			};

			scope.editItem = function(index) {
				if (scope.editorFlags[index].editing) {
					scope.inData = JSON.stringify(scope.curData);
				}

				scope.editorFlags[index].editing = !scope.editorFlags[index].editing;
			};

		}
	};
}];
