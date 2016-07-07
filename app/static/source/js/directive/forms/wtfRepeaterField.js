/**
 * The directive for wtforms repeater fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', '$filter', function($http, $log, $timeout, $filter) {
	var tpl = "<div><label for='{[ fieldName ]}'>{[ label ]}</label> \
		<input id='{[ fieldName ]}' name='{[ fieldName ]}' type='text' ng-hide='true' ng-model='serializedFieldVal'><br /> \
		<table class='ui table'><thead><tr><td ng-repeat='f in fields track by $index'><strong>{[ f.fieldLabel ]}</strong></td><td><button type='button' class='repeater-add btn btn-default' ng-click='addItem(\"{[ fieldName ]}\")' aria-label='Add Item' title='Add Item'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button></td></tr></thead> \
		<tr data-toggle='fieldset-entry' ng-repeat='i in getNumber(numFields) track by $index'> \
		<td ng-repeat='f in fields track by $index'><input ng-model='fieldModels[$parent.$index][f.fieldID]' class='form-control' name='{[ fieldName ]}-{[ $parent.$index ]}-{[ f.fieldID ]}' placeholder='{[ f.fieldLabel ]}' type='{[ f.fieldType ]}'></td> \
		<td><button ng-if='numFields > 1' type='button' class='repeater-remove btn btn-default' ng-click='removeItem($parent.$index)' aria-label='Remove Item' title='Remove Item'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button></td> \
		</tr></table></div>";


	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldName: '@',
			label: '@',
			fields: '=',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.numFields = 1;
			$scope.serializedFieldVal = '';

			$scope.getNumber = function(num) {
				return new Array(num);
			};

			$scope.buildFieldsObj = function(filtered, curVal) {
				var $i, $j, $c, fieldsObj, fieldID, filter, fieldVal;
				curVal = typeof curVal !== 'undefined' ? curVal : [];
				var arr = curVal;

				for ($i=0; $i < $scope.numFields; $i++) {
					if (!arr[$i]) {
						arr[$i] = {};
					}
					for ($j=0, $c=$scope.fields.length; $j < $c; $j++) {
						fieldID = $scope.fields[$j].fieldID;

						if (typeof curVal[$i][fieldID] !== 'undefined') {
							fieldVal = curVal[$i][fieldID];
						} else {
							fieldVal = '';
						}

						if (filtered) {
							filter = $scope.fields[$j].filter;
							if (filter) {
								fieldVal = $filter(filter)(fieldVal);
							}
						}
						arr[$i][fieldID] = fieldVal;
					}
				}

				return arr;
			};

			$scope.updateModels = function() {
				$scope.fieldModels = $scope.buildFieldsObj(false, $scope.fieldModels);
			};

			$scope.updateModels();

			$scope.$watch('fieldModels', function(newValue) {
				var $newValue = (JSON.parse(JSON.stringify(newValue)));
				var filteredValue = $scope.buildFieldsObj(true, $newValue);

				$scope.serializedFieldVal = JSON.stringify(filteredValue);
			}, true);

		}],
		link: function(scope, elem, attrs) {

			scope.addItem = function() {
				scope.numFields++;
				scope.updateModels();
			};
			scope.removeItem = function($index) {
				scope.fieldModels.splice($index, 1);
				scope.numFields--;
				scope.updateModels();
			};

		}
	};
}];
