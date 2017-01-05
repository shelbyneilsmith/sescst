/**
 * The directive for more complex repeater fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', '$filter', 'config', function($http, $log, $timeout, $filter, config) {
	var tpl = "<div><label ng-if='label' for='{[ fieldName ]}'>{[ label ]}</label> \
		<input id='{[ fieldName ]}' name='{[ fieldName ]}' type='text' ng-hide='true' ng-model='serializedFieldVal'> \
		<table class='ui table'><thead><tr><th ng-repeat='f in fields track by $index'><strong>{[ f.field_label ]}</strong></th><th><button type='button' class='repeater-add btn btn-default' ng-click='addItem(\"{[ fieldName ]}\")' aria-label='Add Item' title='Add Item'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button></th></tr></thead> \
		<tr data-toggle='fieldset-entry' ng-repeat='i in getNumber(rows) track by $index'> \
		<td ng-repeat='f in fields track by $index'> \
		<form-field model='fieldModels[\"field_rows\"][$parent.$index][$index][\"field_val\"]' name='{[ fieldName ]}-{[ $parent.$index ]}-{[ f.field_id ]}' placeholder='{[ f.field_label ]}' type='{[ f.field_type ]}'></form-field> \
		</td> \
		<td><button ng-if='rows > 1' type='button' class='repeater-remove btn btn-default' ng-click='removeItem($parent.$index)' aria-label='Remove Item' title='Remove Item'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button></td> \
		</tr></table></div>";


	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldName: '@',
			label: '@',
			fields: '=',
			fieldModels: '=?model',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.rows = 1;
			$scope.serializedFieldVal = '';

			$scope.getNumber = function(num) {
				return new Array(num);
			};

			$scope.buildFieldsObj = function(filtered, curVal) {
				var $i, $j, $c, fieldObj, fieldID, filter, fieldVal, $rowsArr;
				curVal = typeof curVal !== 'undefined' ? curVal : {'field_rows': []};
				$rowsArr = curVal['field_rows'];

				for ($i=0; $i < $scope.rows; $i++) {
					if (!$rowsArr[$i]) {
						$rowsArr[$i] = [];
					}
					for ($j=0, $c=$scope.fields.length; $j < $c; $j++) {
						fieldObj = {};

						fieldObj['field_id'] = $scope.fields[$j]['field_id'];
						fieldObj['field_type'] = $scope.fields[$j]['field_type'];
						fieldObj['field_label'] = $scope.fields[$j]['field_label'];
						fieldObj['filter'] = $scope.fields[$j]['filter'];

						if (typeof $rowsArr[$i][$j] !== 'undefined') {
							fieldVal = $rowsArr[$i][$j]['field_val'];
						} else {
							fieldVal = '';
						}

						fieldObj['field_val'] = fieldVal;

						if (filtered) {
							filter = $scope.fields[$j]['filter'];
							if (filter) {
								if (filter === 'date') {
									fieldVal = $filter(filter)(fieldVal, config.dateFormat, config.dateOffset);
								} else {
									fieldVal = $filter(filter)(fieldVal);
								}
							}
						}
						$rowsArr[$i][$j] = fieldObj;
					}
				}

				return curVal;
			};

			$scope.updateModels = function() {
				$scope.fieldModels = $scope.buildFieldsObj(false, $scope.fieldModels);
				$scope.rows = $scope.fieldModels['field_rows'].length;
			};

			if (typeof $scope.fieldModels !== 'undefined' || typeof $scope.fields === 'undefined') {
				$timeout(function() {
					$scope.updateModels();
				}, 1000);
			} else {
				$scope.updateModels();
			}

			$scope.$watch('fieldModels', function(newValue) {
				if (typeof newValue !== 'undefined') {
					var $newValue = (JSON.parse(JSON.stringify(newValue)));
					var filteredValue = $scope.buildFieldsObj(true, $newValue);

					$scope.serializedFieldVal = JSON.stringify(filteredValue);
				}
			}, true);

		}],
		link: function(scope, elem, attrs) {

			scope.addItem = function() {
				scope.rows++;
				scope.updateModels();
			};
			scope.removeItem = function($index) {
				scope.fieldModels['field_rows'].splice($index, 1);
				scope.rows--;
				scope.updateModels();
			};

		}
	};
}];
