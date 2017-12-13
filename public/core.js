angular.module('directoryApp', ['appRoutes', 'ngRoute', 'directoryCtrl', 'mainCtrl', 'userCtrl', 'userService', 'authService', 'mainService', 'groupCtrl', 'groupService','missionCtrl','missionService', 'ngMaterial', 'ngMessages'])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });