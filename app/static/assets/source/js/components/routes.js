module.exports = ['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/',  { templateUrl: 'static/templates/staff-tools-index.html', controller: require('../controller/mainCtrl') })
		.otherwise({
			redirectTo: '/'
	});
}];
