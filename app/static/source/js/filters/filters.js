'use strict';

module.exports = angular.module('app-filters', [])
	.filter('keylength', function(){
		return function(input){
			if(!angular.isObject(input)){
				throw Error("Usage of non-objects with keylength filter!!");
			}
			return Object.keys(input).length;
		};
	})
	.filter('underscoreHyphen', function() {
		return function(input) {
			if (input) {
				return input.replace('-', '_');
			}
		};
	})
	.filter('underscoreless', function () {
		return function (input) {
			return input.replace(/_/g, ' ');
		};
	})
	.filter('num', function() {
		return function(input) {
			return parseInt(input, 10);
		};
	})
	.filter('parsejson', function() {
		return function(input) {
			var obj = JSON.parse(input);
			return obj;
		};
	})
	.filter('cellreimformat', ['$filter', '$http', '$log', function($filter, $http, $log) {
		var cached = {};
		var apiUrl = '/api/get_posts';
		function cellreimformatFilter(input) {
			if (input  || input === 0) {
				if (input in cached) {
					// avoid returning a promise!
					return typeof cached[input].then !== 'function' ? cached[input] : undefined;
				} else {
					cached[input] = $http.post(apiUrl, {"post_type": 'AppSettings', "post_filter": ''})
						.then(function(results) {
							var appSettings = results.data.posts;

							for (var i=0, l=appSettings.length; i < l; i++) {
								if (appSettings[i].setting_name === 'cell_reimbursement') {
									var globalcellreimrate = appSettings[i].setting_val * 100;

									if (input == globalcellreimrate) {
										cached[input] = "Full (" + $filter('currency')(globalcellreimrate / 100) + "/mo)";
									} else if (input == (globalcellreimrate * 0.5)) {
										cached[input] = "Half (" + $filter('currency')((globalcellreimrate / 100) * 0.5) + "/mo)";
									} else {
										cached[input] = "No Reimbursement";
									}
								}
							}
						}, function(error) {
							$log.log(error);
						});
				}
			}
		}

		cellreimformatFilter.$stateful = true;
		return cellreimformatFilter;
	}])
	.filter('titleCase', function() {
		return function(input) {
			input = input || '';
			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
	});
