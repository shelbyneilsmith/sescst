module.exports = ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/',  {
			templateUrl: '../templates/staff-tools-index.html',
			controller: require('../controller/mainCtrl')
		})
		.when('/posts', {
			templateUrl: '../templates/post-list.html',
			controller: require('../controller/posts/postListCtrl')
		})
		.when('/post', {
			templateUrl: '../templates/single-post.html',
			controller: 'PostCtrl'
		})
		// .when('/create-activity-log', {
		// 	templateUrl: '../templates/partials/reports/activity-log-form.html',
		// 	controller: 'ActivityLogFormCtrl'
		// })
		.when('/confirm', {
			templateUrl: '../templates/confirm.html',
			controller: require('../controller/confirmCtrl')
		// })
		// .otherwise({
		// 	redirectTo: '/'
		});

	// $locationProvider.html5Mode(true, false, false);
}];

// module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
// 	//
// 	// For any unmatched url, redirect to /state1
// 	// $urlRouterProvider.otherwise("/state1");
// 	//
// 	// Now set up the states
// 	$stateProvider
// 	.state('staff-tools-index', {
// 		url: "/",
// 		templateUrl: '../templates/staff-tools-index.html',
// 		controller: require('../controller/mainCtrl')
// 	})
// 	.state('post-list', {
// 		url: "/posts",
// 		templateUrl: '../templates/post-list.html',
// 		controller: require('../controller/postListCtrl')
// 	});
// }];
