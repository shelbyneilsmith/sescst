/**
 * The directive for bootstrap datepicker fields.
 */
'use strict';

module.exports = ['$http', '$log', '$timeout', '$filter', function($http, $log, $timeout, $filter) {
	var tpl = "<div class='input-group date' data-provide='datepicker'> \
		<input id='{[fieldName]}' name='{[fieldName]}' type='text' class='form-control' ng-click='open()' uib-datepicker-popup='{[ format ]}' ng-model='dateInput' is-open='popup.opened' datepicker-options='dateOptions' ng-required='true' close-text='Close' alt-input-formats='altInputFormats' /> \
		<span class='input-group-btn'><button type='button' class='btn btn-default' ng-click='open()'><i class='glyphicon glyphicon-calendar'></i></button></span></div>";
	return {
		restrict: 'E',
		replace: true,
		scope: {
			'initDate': '=',
			'model': '=',
			'fieldName': '@',
		},
		template: tpl,
		controller: ['$scope', function($scope) {

			if ($scope.model) {
				$scope.model = new Date($scope.model);
				$scope.dateInput = $scope.model;

				$scope.$watch('dateInput', function(newValue) {
					$scope.model = newValue;
				});
			} else {
				if ($scope.initDate) {
					$scope.dateInput = new Date($scope.initDate);
				} else {
					$scope.dateInput = new Date();
				}
				// $scope.$watch('dateInput', function(newValue) {
				// 	$log.log($scope.dateInput);
				// });
			}


			$scope.clear = function() {
				$scope.model = null;
			};

			$scope.inlineOptions = {
				customClass: getDayClass,
				minDate: new Date(),
				showWeeks: true
			};

			$scope.dateOptions = {
				// dateDisabled: disabled,
				formatYear: 'yy',
				maxDate: new Date(2020, 5, 22),
				minDate: new Date(),
				startingDay: 1
			};

			// Disable weekend selection
			function disabled(data) {
				var date = data.date,
				mode = data.mode;
				return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
			}

			$scope.toggleMin = function() {
				$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
				$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
			};

			$scope.toggleMin();

			$scope.open = function() {
				$scope.popup.opened = true;
			};

			$scope.formats = ["MMM d, y", 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];
			$scope.altInputFormats = ['M!/d!/yyyy'];

			$scope.popup = {
				opened: false
			};

			function getDayClass(data) {
				var date = data.date,
				mode = data.mode;
				if (mode === 'day') {
					var dayToCheck = new Date(date).setHours(0,0,0,0);

					for (var i = 0; i < $scope.events.length; i++) {
						var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

						if (dayToCheck === currentDay) {
							return $scope.events[i].status;
						}
					}
				}

				return '';
			}
		}],
		link: function(scope, elem, attrs) {
		}
	};
}];
