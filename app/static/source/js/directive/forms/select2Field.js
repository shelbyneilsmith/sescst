/**
 * The directive for select2 fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', 'helpers', function($http, $log, $timeout, helpers) {
	var tpl = "<div class='select2container'> \
		<input id='{[ fieldName ]}' name='{[ fieldName ]}' type='text' ng-hide='true' ng-model='outputValue'> \
		<ui-select ng-model='$parent.selectModel' multi-select-checker style='min-width: {[ minWidth ]};'> \
		<ui-select-match allow-clear='true' placeholder='Select {[ label ]}'> \
		<span ng-if='!multiple'>{[$select.selected[optionKey]]}</span> \
		<span ng-if='multiple'>{[$item[optionKey]]}</span> \
		</ui-select-match> \
		<ui-select-choices repeat='item in (uiSelectOptions | filter: $select.search)' value='{[$select.selected[optionVal]]}''> \
		<span ng-bind-html='item[optionKey] | highlight: $select.search'></span> \
		</ui-select-choices></ui-select></div>";

	return {
		restrict: 'E',
		scope: {
			selectOptions: '=',
			model: '=?',
			keyVal: '=',
			multiple: '=',
			label: '@',
			fieldName: '@',
			minWidth: '@',
		},
		template: tpl,
		controller: ['$scope', function($scope) {
			$scope.options = {};
			$scope.options.Multiple = $scope.multiple;

			if ((typeof $scope.keyVal !== 'undefined') && (typeof $scope.keyVal[0] !== 'undefined')) {
				$scope.optionKey = $scope.keyVal[0];
				$scope.optionVal = $scope.keyVal[1];
			} else {
				if ($scope.selectOptions.only) {
					$scope.optionKey = $scope.selectOptions.only;
					$scope.optionVal = $scope.selectOptions.only;
				} else if ($scope.selectOptions.constructor.toString().indexOf("Array") !== -1) {
					$scope.optionKey = 0;
					$scope.optionVal = 1;
				} else {
					$scope.optionKey = $scope.model;
					$scope.optionVal = $scope.model;
				}
			}

			var buildSelectmodel = function(selectOptions) {
				$scope.uiSelectOptions = selectOptions;
				$scope.selectModel = '';
				if ($scope.selectOptions.only) {
					if ($scope.model) {
						$scope.selectModel = {};
						$scope.selectModel[$scope.optionKey] = $scope.model;
					}

					$scope.uiSelectOptions = [];
					for (var i=0; i < selectOptions.length; i++) {
						$scope.uiSelectOptions[i] = {};
						$scope.uiSelectOptions[i][$scope.optionKey] = selectOptions[i][$scope.selectOptions.only];
						$scope.uiSelectOptions[i][$scope.optionVal] = selectOptions[i][$scope.selectOptions.only];
					}
				} else {
					if ($scope.model) {
						$scope.selectModel = $scope.model;
					}
				}
				$log.log($scope.selectModel);
			}

			var unbindModelWatch = $scope.$watch('model', function(newValue) {
				if ($scope.selectOptions.constructor.toString().indexOf("Array") != -1) {
					buildSelectmodel($scope.selectOptions);
				} else {
					if (typeof $scope.selectOptions === 'object') {
						helpers.getPosts($scope.selectOptions.postType, $scope.selectOptions.postFilter, function(results) {
							buildSelectmodel(results);
						});
					}
				}

				$scope.$watch('selectModel', function(newValue) {
					$scope.outputValue = '';
					if (typeof newValue !== 'undefined') {
						if ($scope.selectOptions.only) {
							$scope.model = newValue[$scope.optionKey];
							$scope.outputValue = newValue[$scope.optionKey];
						} else if ($scope.selectOptions.constructor.toString().indexOf("Array") != -1) {
							$scope.model = newValue;
							$scope.outputValue = newValue[$scope.optionVal];
						} else {
							$scope.model = newValue;
							$scope.outputValue = newValue;

							if (typeof $scope.outputValue === "object") {
								$scope.outputValue = JSON.stringify($scope.outputValue);
							}
						}

					}
				});

				// unbind after watching once
				unbindModelWatch();
			});

		}],
		link: function(scope, elem, attrs) {
		}
	};
}];
