/**
 * The directive for repeater forms.
 */
'use strict';

module.exports = ['$http', '$log', '$templateCache', '$compile', '$templateRequest', '$timeout', 'helpers', '$filter', 'config', function($http, $log, $templateCache, $compile, $templateRequest, $timeout, helpers, $filter, config) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldName: '@',
			label: '@',
			fields: '=',
			repeaterType: '@',
			inData: '=?model',
		},
		link: function(scope, element, attrs) {
			scope.newItem = [];
			scope.editorFlags = [];

			$templateRequest('../templates/partials/forms/fields/' + scope.repeaterType + 'Repeater.html').then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});

			var unbind = scope.$watch('inData', function(newValue) {
				var rowsLength;

				if (typeof newValue !== 'undefined') {
					rowsLength = newValue.length;

					if (newValue.hasOwnProperty('field_rows')) {
						rowsLength = newValue.field_rows.length;
					}

					if (scope.repeaterType === 'simple') {
						for(var i=0, l=rowsLength; i<l; i++) {
							scope.editorFlags.push({editing: false});
						}
					}

					scope.updateModels(newValue, false);

					unbind();
				} else {
					if (scope.repeaterType === 'complex') {
						scope.updateModels({'field_rows': ['']}, false);
					}
				}
			});


			scope.buildFieldsObj = function(filtered, curVal) {
				var $i, $l, $j, $c, rowData, fieldData, fieldVal;

				if (typeof curVal.field_rows !== 'undefined') {
					$l = curVal.field_rows.length;
				} else {
					if (curVal.length > 0) {
						$l = curVal.length;
					} else {
						$l = 1;
					}
				}

				var newVal = {'field_rows': []};
				if ((typeof scope.newItem !== 'undefined') && (scope.newItem.length > 0)) {
					newVal = typeof curVal.field_rows !== 'undefined' ? curVal : {'field_rows': []};
					$l = 1;
				}

				for ($i=0; $i < $l; $i++) {
					rowData = [];

					for ($j=0, $c=scope.fields.length; $j < $c; $j++) {
						fieldData = {};

						fieldData.field_id = scope.fields[$j].field_id;
						fieldData.field_label = scope.fields[$j].field_label;
						fieldData.field_type = scope.fields[$j].field_type;
						fieldData.filter = scope.fields[$j].filter;

						if ((typeof scope.newItem !== 'undefined') && (scope.newItem.length > 0) && scope.newItem[$j]) {
							fieldVal = scope.newItem[$j];
						} else {
							if ((typeof curVal.field_rows !== 'undefined') && (typeof curVal.field_rows[$i] !== 'undefined') && (typeof curVal.field_rows[$i][$j] !== 'undefined')) {
								fieldVal = curVal.field_rows[$i][$j].field_val;
							} else {
								if (typeof curVal[$i] !== 'undefined') {
									fieldVal = curVal[$i][scope.fields[$j].field_id];
								} else {
									fieldVal = '';
								}
							}
						}

						// if (filtered) {
						// 	filter = scope.fields[$j]['filter'];
						// 	if (filter) {
						// 		if (filter === 'date') {
						// 			fieldVal = $filter(filter)(fieldVal, config.dateFormat, config.dateOffset);
						// 		} else {
						// 			fieldVal = $filter(filter)(fieldVal);
						// 		}
						// 	}
						// }

						fieldData.field_val = fieldVal;

						rowData.push(fieldData);
					}

					newVal.field_rows.push(rowData);
				}

				return newVal;
			};

			scope.updateModels = function(data, filter) {
				scope.inData = scope.buildFieldsObj(filter, data);
			};

			scope.addItem = function() {
				if (scope.repeaterType === 'complex') {
					scope.inData.field_rows.push({});
				}

				scope.updateModels(scope.inData, false);

				if (scope.repeaterType === 'simple') {
					scope.editorFlags.push({editing: false});

					for (var i=0; i < scope.newItem.length; i++) {
						scope.newItem[i] = '';
					}
				}

			};

			scope.removeItem = function(index) {
				if (scope.repeaterType === 'simple') {
					scope.editorFlags.splice(index, 1);
				}

				scope.inData.field_rows.splice(index, 1);
			};

			scope.editItem = function(index) {
				scope.editorFlags[index].editing = !scope.editorFlags[index].editing;

				for (var i=0, l=scope.editorFlags.length; i<l; i++) {
					if ((i !== index) && scope.editorFlags[i].editing) {
						scope.editorFlags[i].editing = false;
					}
				}
			};
		}
	};
}];
