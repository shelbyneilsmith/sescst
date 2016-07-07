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
	.filter('titleCase', function() {
		return function(input) {
			input = input || '';
			return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
	});
