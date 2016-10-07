/**
 * The directive for repeater forms.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', 'helpers', '$filter', 'config', function($http, $log, $templateCache, $compile, $templateRequest, $timeout, helpers, $filter, config) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			inData: '=?data',
			fieldName: '@',
			label: '@',
			fields: '=',
			repeaterType: '@',
			fieldModels: '=?model',
		},
		controller: ['$scope', function($scope) {
			$scope.rows = 1;
			$scope.serializedFieldVal = '';

			$scope.buildFieldsObj = function(filtered, curVal) {
				var $i, $j, $c, fieldObj, fieldID, filter, fieldVal, $rowsArr;
				curVal = typeof curVal['field_rows'] !== 'undefined' ? curVal : {'field_rows': []};
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

			if ($scope.repeaterType === 'simple') {

				$scope.$watch('inData', function(newValue) {
					if (typeof newValue !== 'undefined') {
						$scope.rows = newValue.length;
					}

					var clonedData = helpers.clone($scope.inData);
					if (typeof clonedData !== 'undefined') {
						$scope.curData = helpers.isJson(clonedData) ? JSON.parse(clonedData) : clonedData;
					} else {
						$scope.curData = [];
					}
					$scope.serializedFieldVal = JSON.stringify($scope.curData);
					$scope.newItem = [];

					$scope.editorFlags = [];
					for(var i=0, l=$scope.curData.length; i<l; i++) {
						$scope.editorFlags.push({editing: false});
					}
				});
			}
			if ($scope.repeaterType === 'complex') {

				// $scope.getNumber = function(num) {
				// 	return new Array(num);
				// };



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
			}
		}],
		link: function(scope, element, attrs) {
			$templateRequest('../templates/partials/forms/fields/' + scope.repeaterType + 'Repeater.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});

			scope.addItem = function() {
				if (scope.repeaterType === 'simple') {
					var i, l, dataOutput = {};
					for (i=0, l=scope.fields.length; i < l; i++) {
						dataOutput['field_id'] = scope.fields[i].fieldName;
						dataOutput['field_label'] = scope.fields[i].fieldLabel;
						dataOutput['field_type'] = scope.fields[i].fieldType;
						dataOutput['field_val'] = scope.newItem[i];
					}
					scope.curData.push(dataOutput);
					scope.inData = JSON.stringify(scope.curData);
					scope.newItem = [];
					scope.editorFlags.push({editing: false});

					scope.serializedFieldVal = scope.buildFieldsObj(false, scope.curData);
					// scope.serializedFieldVal = scope.curData;
				}

				if (scope.repeaterType === 'complex') {
					scope.rows++;
					scope.updateModels();
				}
			};

			scope.removeItem = function(index) {
				if (scope.repeaterType === 'simple') {
					scope.curData.splice(index, 1);
					scope.editorFlags.splice(index, 1);
					scope.inData = JSON.stringify(scope.curData);
				}

				if (scope.repeaterType === 'complex') {
					scope.fieldModels['field_rows'].splice($index, 1);
					scope.rows--;
					scope.updateModels();
				}
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
