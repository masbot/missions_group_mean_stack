angular.module('groupService', [])

    .factory('Group', function($http) {

        var groupFactory = {};

        groupFactory.getcsv = function(data) {
            return $http.get('/api/csv');
        }

        groupFactory.makegroup = function(data){
            return $http.post('/api/makegroup', data);
        }

        groupFactory.getgroups = function(){
            return $http.get('/api/getgroups');
        }

        groupFactory.getgroup = function(data){
            return $http.post('/api/getgroup', data);
        }

        groupFactory.addtogroup = function(data){
            return $http.post('/api/addtogroup', data);
        }

        groupFactory.deletefromgroup = function(data){
            return $http.post('/api/deletefromgroup', data);
        }

        groupFactory.switchgroup = function(data){
            return $http.post('/api/switchgroup', data);
        }

        groupFactory.sortgroup = function(data){
            return $http.post('/api/sortgroup', data);
        }

        return groupFactory;

    });