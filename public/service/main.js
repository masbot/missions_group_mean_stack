angular.module('mainService', [])

    .factory('Main', function($http) {

        var userFactory = {};

        userFactory.csv = function(data) {
            return $http.post('/api/csv', data);
        }

        userFactory.missions = function(data){
            return $http.post('/api/missions', data);
        }

        return userFactory;

    });