module.exports = ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/',  {
			templateUrl: '/static/partials/staff-tools-index.html',
			controller: require('../controller/mainCtrl')
		})
		.when('/user-account', {
			templateUrl: '/static/partials/user-account.html',
			controller: require('../controller/userCtrl')
		})
		.otherwise({
			redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
}];
