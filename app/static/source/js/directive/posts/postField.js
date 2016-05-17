/**
 * The directive for rendering editable post fields.
 */
'use strict';

module.exports = ['$compile', '$http', '$log', '$timeout', function($compile, $http, $log, $timeout) {
	var tpl = "<form class='post-field' ng-submit='savePostField()'> \
		<ng-include src='fieldInclude'></ng-include> \
		<a ng-if='$parent.editAccess($parent.postData.id, $parent.postType, adminOnly)' ng-hide='editMode' class='edit-link' ng-click='editPostField()'>Edit</a> \
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
			initValue: '=',
			options: '=',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$log.log($scope.$parent.postData);
			$scope.fieldInclude = '../templates/partials/single/fields/' + $scope.fieldType + 'field.html';
			$scope.editMode = false;

			$scope.$watch('initValue', function(newValue) {
				if (newValue !== undefined) {
					$scope.fieldData = {value: $scope.initValue, newValue: ''};
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
				$('#field-save-msg').fadeOut('fast', function() {
					$('#field-save-msg').remove();
				});
				scope.editMode = true;

				if(jQuery(element[0].querySelector('select')).length > 0) {
					jQuery(element[0].querySelector('select')).select2({
						data: scope.fieldData.value,
						width: '100%'
					});
				}
			}

			scope.savePostField = function() {
				$log.log(scope.fieldData.newValue);
				scope.closeEditField();

				$http.post('/api/save_post_field', {post_id: scope.$parent.postData.id, post_type: scope.$parent.postType, field_key: scope.keys, field_value: scope.fieldData.newValue})
					.then(function(results) {
						scope.fieldData.value = results.data.field_value;
						scope.fieldData.newValue = '';

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
			}

			scope.closeEditField = function() {
				scope.editMode = false;
				jQuery(element[0].querySelector('select')).select2('destroy');
			}

		}
	};
}];
