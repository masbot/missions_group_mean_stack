angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'view/main.html',
        })
        .when('/signin', {
            templateUrl: 'view/signin.html'
        })
        .when('/signup', {
            templateUrl: 'view/signup.html'
        })
        .when('/group', {
            templateUrl: 'view/group.html'
        })
        .when('/eachgroup/:groupnum', {
            templateUrl: 'view/eachgroup.html'
        })
        .when('/switch/:group1/:group2', {
            templateUrl: 'view/switch.html'
        })
        .when('/mission', {
            templateUrl: 'view/mission.html'
        })
        .when('/missionteam/:teamname', {
            templateUrl: 'view/missionteam.html'
        })
        .when('/createmissionteam', {
           templateUrl: 'view/createmissionteam.html'
        })
        .when('/allteams', {
            templateUrl: 'view/allteams.html'
        })
        .when('/mperson', {
            templateUrl: 'view/mpeople.html'
        });

    // $locationProvider.html5Mode(true);
});
