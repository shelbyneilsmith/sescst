/**
 * The directive for rendering editable post fields.
 */
'use strict';

module.exports = ['$compile', '$http', '$log', '$timeout', '$filter', 'helpers', function($compile, $http, $log, $timeout, $filter, helpers) {
	var tpl = "<form class='post-field' ng-submit='savePostField()'> \
		<ng-include src='fieldInclude'></ng-include> \
		<a ng-show='editMode' class='btn btn-small btn-primary save-link' ng-click='savePostField()'>Save</a> \
		<a ng-show='editMode' class='btn btn-small btn-primary cancel-link' ng-click='closeEditField()'>Cancel</a> \
		</form>";

	return {
		restrict: 'E',
		replace: true,
		scope: {
			fieldType: "@type",
			label: "@",
			keys: "=",
			adminOnly: "=",
			relationship: '=',
			inData: '=fieldData',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.relation = typeof $scope.relationship !== 'undefined' ? $scope.relationship : false;
			$scope.editAccess = $scope.$parent.editAccess;
			$scope.postType = $scope.$parent.postType;
			$scope.postID = $scope.$parent.postData.id;

			$scope.editBtn = "<a ng-hide='$parent.editMode' class='edit-link' ng-click='$parent.editPostField()'>Edit</a>";

			$scope.fieldInclude = '../templates/partials/single/fields/' + $scope.fieldType + 'field.html';
			$scope.editMode = false;

			$scope.$watch('inData', function(newValue) {
				if (newValue !== undefined) {
					var inDataVal = $scope.inData.initValue;
					if ($scope.fieldType === 'repeater') {
						inDataVal = JSON.parse($scope.inData.initValue);
					}
					if ($scope.fieldType === 'datetime') {
						inDataVal = $filter('date')($scope.inData.initValue, "MMM d, y", '+0500');
					}
					$scope.fieldData = {displayValue: inDataVal, value: inDataVal, newValue: '', oldValue: null, selectOptions: $scope.selectOptions};
				}
				if ($scope.inData && ($scope.fieldType === "select" || $scope.fieldType === "multiselect")) {
					$scope.optionsPostType = $scope.inData.postType;
					$scope.optionsPostFilter = $scope.inData.postFilter;
					$scope.optionsOnly = $scope.inData.only;

					if ($scope.inData.optionKeyVal) {
						$scope.optionKey = $scope.inData.optionKeyVal[0];
						$scope.optionVal = $scope.inData.optionKeyVal[1];
					} else {
						if ($scope.optionsOnly) {
							$scope.optionKey = $scope.optionsOnly;
							$scope.optionVal = $scope.optionsOnly;
						} else {
							$scope.optionKey = $scope.inData.initValue;
							$scope.optionVal = $scope.inData.initValue;
						}
					}

					if (typeof $scope.fieldData.value === 'object') {
						$scope.fieldData.displayValue = $scope.fieldData.value[$scope.optionKey];
					} else {
						$scope.fieldData.displayValue = $scope.fieldData.value;
					}
					if($scope.fieldType === "multiselect") {
						$scope.fieldData.displayValue = [];

						for (var j=0; j < $scope.fieldData.value.length; j++) {
							if (typeof $scope.fieldData.value[j] === 'object') {
								$scope.fieldData.displayValue.push($scope.fieldData.value[j][$scope.optionKey]);
							} else {
								$scope.fieldData.displayValue.push($scope.fieldData.value[j]);
							}
						}

					}
				}
			});

			$scope.isArray = angular.isArray;
			$scope.testValueForArray = function(value) {
				if(angular.isArray(value)) {
					return value;
				} else {
					return [value];
				}
			};
		}],
		link: function(scope, element, attrs) {

			scope.editPostField = function() {
				scope.fieldData.oldDisplayValue = scope.fieldData.displayValue;
				scope.fieldData.oldValue = JSON.parse(JSON.stringify(scope.fieldData.value));

				$('#field-save-msg').fadeOut('fast', function() {
					$('#field-save-msg').remove();
				});
				scope.editMode = true;
			};

			scope.savePostField = function() {
				// $log.log(scope.fieldData.value);
				if (scope.fieldData.newValue) {
					scope.fieldData.displayValue = scope.fieldData.newValue;
					scope.saveValue = scope.fieldData.newValue;
					scope.fieldData.newValue = '';
				} else {
					scope.fieldData.displayValue = scope.fieldData.value;
					scope.saveValue = scope.fieldData.value;

					if (scope.inData.optionKeyVal) {
						scope.fieldData.displayValue = scope.fieldData.value[scope.optionKey];

						if(scope.fieldType === "multiselect") {
							scope.fieldData.displayValue = [];

							for (var j=0; j < scope.fieldData.value.length; j++) {
								scope.fieldData.displayValue.push(scope.fieldData.value[j][scope.optionKey]);
							}
						}
					}

					if (scope.fieldType === 'repeater') {
						scope.saveValue = JSON.stringify(scope.fieldData.value);
					}
				}
				$log.log(scope.relation);

				scope.editMode = false;

				$http.post('/api/save_post_field', {post_id: scope.$parent.postData.id, post_type: scope.$parent.postType, field_key: scope.keys, field_value: scope.saveValue, relationship: scope.relation})
					.then(function(results) {
						jQuery(element[0]).append('<span id="field-save-msg" class="success">' + results.data.success + '</span>');
						$log.log(results.data);
					}, function(error) {
						jQuery(element[0]).append('<span id="field-save-msg" class="error">' + error.data.error + '</span>');
						$log.log(error.data);
					});

				if ($('#field-save-msg').length > 0) {
					$timeout(function() {
						$('#field-save-msg').fadeOut('fast', function() {
							$('#field-save-msg').remove();
						});
					}, 6000);
				}
			};

			scope.closeEditField = function() {
				if (scope.fieldData.value !== scope.fieldData.oldValue) {
					if (scope.fieldType !== 'datetime') {
						scope.fieldData.displayValue = scope.fieldData.oldDisplayValue;
						scope.fieldData.value = scope.fieldData.oldValue;
						scope.fieldData.oldValue = null;
					}
				}
				scope.editMode = false;
			};

			scope.addItem = function() {
				var fieldKeys = Object.keys(scope.fieldData.displayValue[0]);
				scope.fieldData.displayValue[scope.fieldData.displayValue.length] = {};
				for (var i=0; i < fieldKeys.length; i++) {
					scope.fieldData.displayValue[scope.fieldData.displayValue.length - 1][fieldKeys[i]] = '';
				}
			};

			scope.removeItem = function($index) {
				scope.fieldData.displayValue.splice($index, 1);
			};

		}
	};
}];
