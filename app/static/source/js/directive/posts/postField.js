/**
 * The directive for rendering editable post fields.
 */
'use strict';

module.exports = ['$compile', '$http', '$log', '$timeout', '$filter', 'helpers', function($compile, $http, $log, $timeout, $filter, helpers) {
	var tpl = "<form class='post-field' ng-submit='savePostField()'> \
		<ng-include src='fieldInclude'></ng-include> \
		<a ng-show='editMode' class='btn small btn-primary save-link' ng-click='savePostField()'>Save</a> \
		<a ng-show='editMode' class='btn small btn-primary cancel-link' ng-click='closeEditField()'>Cancel</a> \
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
			isTitle: '=',
			inData: '=fieldData',
			formattedOutput: '@?',
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

			$scope.applyFilter = function(model, filter) {
				if (filter) {
					return $filter(filter)(model);
				} else {
					return model;
				}
			};

			$scope.$watch('formattedOutput', function(newValue) {
				if (newValue && (typeof $scope.fieldData !== 'undefined')) {
					$scope.fieldData.displayValue = newValue;
				}
			});

			$scope.$watch('inData', function(newValue) {
				// $timeout(function() {
					if (typeof newValue !== 'undefined') {
						var inDataVal = newValue.initValue;
						if ($scope.fieldType === 'repeater') {
							inDataVal = newValue.initValue;
						}
						if ($scope.fieldType === 'datetime') {
							inDataVal = $filter('date')(newValue.initValue, "MMM d, y", '+0500');
						}

						$scope.fieldData = {displayValue: inDataVal, value: inDataVal, newValue: '', oldValue: null, selectOptions: $scope.selectOptions};
					}
					if (newValue && ($scope.fieldType === "select" || $scope.fieldType === "multiselect")) {
						if (typeof $scope.inData.selectOptions !== 'undefined') {
							$scope.selectOptions = $scope.inData.selectOptions;
						} else {
							$scope.optionsPostType = newValue.postType;
							$scope.optionsPostFilter = newValue.postFilter;
							$scope.optionsOnly = newValue.only;
							$scope.allowAllOptions = false;
							if (newValue.allowAll) {
								$scope.allowAllOptions = true;
							}
							$scope.selectOptions = {postType: $scope.optionsPostType, postFilter: $scope.optionsPostFilter, only: $scope.optionsOnly, allowAll: $scope.allowAllOptions};
						}

						if (newValue.optionKeyVal) {
							$scope.optionKey = newValue.optionKeyVal[0];
							$scope.optionVal = newValue.optionKeyVal[1];
						} else {
							if ($scope.optionsOnly) {
								$scope.optionKey = $scope.optionsOnly;
								$scope.optionVal = $scope.optionsOnly;
							} else {
								$scope.optionKey = 0;
								$scope.optionVal = 1;
							}
						}

						if ($scope.fieldData.value) {
							if ((typeof $scope.fieldData.value === 'object')) {
								$scope.fieldData.displayValue = $scope.fieldData.value[$scope.optionKey];
							} else {
								$scope.fieldData.displayValue = $scope.fieldData.value;
							}
							if($scope.fieldType === "multiselect") {
								$scope.fieldData.displayValue = [];

								if (typeof $scope.fieldData.value !== 'undefined') {
									for (var j=0; j < $scope.fieldData.value.length; j++) {
										if (typeof $scope.fieldData.value[j] === 'object') {
											$scope.fieldData.displayValue.push($scope.fieldData.value[j][$scope.optionKey]);
										} else {
											$scope.fieldData.displayValue.push($scope.fieldData.value[j]);
										}
									}
								}
							}
						}
					}
					if ($scope.formattedOutput) {
						$scope.fieldData.displayValue = $scope.formattedOutput;
					}
				// }, 500);
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
				if ((typeof scope.fieldData.displayValue !== 'undefined') && (typeof scope.fieldData.value !== 'undefined')) {
					scope.fieldData.oldDisplayValue = scope.fieldData.displayValue;

					if (scope.fieldData.value.constructor.toString().indexOf("Object") != -1) {
						scope.fieldData.oldValue = JSON.parse(JSON.stringify(scope.fieldData.value));
					} else {
						scope.fieldData.oldValue = scope.fieldData.value;
					}
				}

				$('#field-save-msg').fadeOut('fast', function() {
					$('#field-save-msg').remove();
				});
				scope.editMode = true;
			};

			scope.savePostField = function() {
				if (scope.fieldData.newValue) {
					scope.fieldData.displayValue = scope.fieldData.newValue;
					scope.saveValue = scope.fieldData.newValue;
					scope.fieldData.newValue = '';
				} else {
					scope.fieldData.displayValue = scope.fieldData.value;
					scope.saveValue = scope.fieldData.value;

					if (typeof scope.inData.selectOptions !== 'undefined') {
						scope.fieldData.displayValue = scope.fieldData.value[scope.optionKey];
						scope.saveValue = scope.fieldData.value[scope.optionVal];
					}

					if (scope.inData.optionKeyVal) {
						scope.fieldData.displayValue = scope.fieldData.value[scope.optionKey];

						if(scope.fieldType === "multiselect") {
							scope.fieldData.displayValue = [];

							for (var j=0; j < scope.fieldData.value.length; j++) {
								scope.fieldData.displayValue.push(scope.fieldData.value[j][scope.optionKey]);
							}
						}
					}

				}

				scope.editMode = false;

				$http.post('/api/save_post_field', {post_id: scope.$parent.postData.id, post_type: scope.$parent.postType, field_key: scope.keys, field_value: scope.saveValue, relationship: scope.relation})
					.then(function(results) {
						jQuery(element[0]).append('<span id="field-save-msg" class="success">' + results.data.success + '</span>');
						scope.$parent.postData[scope.keys] = scope.saveValue;
						// $log.log(results.data);
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
