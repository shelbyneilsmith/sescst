'use strict';

module.exports = angular.module('app-filters', [])
	.filter('underscoreHyphen', function() {
		return function(input) {
			if (input) {
				return input.replace('-', '_');
			}
		}
	});

