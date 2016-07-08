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
			model: '=',
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

			if ($scope.keyVal) {
				$scope.optionKey = $scope.keyVal[0];
				$scope.optionVal = $scope.keyVal[1];
			} else {
				if ($scope.optionsConfig.only) {
					$scope.optionKey = $scope.optionsConfig.only;
					$scope.optionVal = $scope.optionsConfig.only;
				} else {
					$scope.optionKey = $scope.model;
					$scope.optionVal = $scope.model;
				}
			}

			var unbindModelWatch = $scope.$watch('model', function(newValue) {

				if (typeof $scope.selectOptions === 'object') {
					$scope.optionsConfig = $scope.selectOptions;
						helpers.getPosts($scope.optionsConfig.postType, $scope.optionsConfig.postFilter, function(results) {
							$scope.uiSelectOptions = results;
							$scope.selectModel = '';
							if ($scope.optionsConfig.only) {
								if ($scope.model) {
									$scope.selectModel = {};
									$scope.selectModel[$scope.optionKey] = $scope.model;
								}

								$scope.uiSelectOptions = [];
								for (var i=0; i < results.length; i++) {
									$scope.uiSelectOptions[i] = {};
									$scope.uiSelectOptions[i][$scope.optionKey] = results[i][$scope.optionsConfig.only];
									$scope.uiSelectOptions[i][$scope.optionVal] = results[i][$scope.optionsConfig.only];
								}
							} else {
								if ($scope.model) {
									$scope.selectModel = $scope.model;
								}
							}

							$scope.$watch('selectModel', function(newValue) {
								$scope.outputValue = '';
								if (typeof newValue !== 'undefined') {
									if (typeof $scope.model !== 'undefined') {
										if ($scope.optionsConfig.only) {
											$scope.model = newValue[$scope.optionKey];
										} else {
											$scope.model = newValue;
										}
										// $log.log($scope.model);
									} else {
										if ($scope.optionsConfig.only) {
											$scope.outputValue = newValue[$scope.optionKey];
										} else {
											$scope.outputValue = newValue;

											if (typeof $scope.outputValue === "object") {
												$scope.outputValue = JSON.stringify($scope.outputValue);
											}
										}
										// $log.log($scope.outputValue);
									}
								}
							});
						});
				} else {
					$scope.uiSelectOptions = $scope.selectOptions;
					$scope.optionKey = 0;
					$scope.optionVal = 1;
				}

				// unbind after watching once
				unbindModelWatch();
			});

		}],
		link: function(scope, elem, attrs) {
		}
	};
}];
