


angular.module('missionService', [])

    .factory('Mission', function($http) {

        var missionFactory = {};

        missionFactory.getmperson = function(data) {
            return $http.get('/api/getmperson', data);
        };

        missionFactory.updatemperson = function(data){
            return $http.post('/api/updatemperson', data);
        };

        missionFactory.createmissionteam = function(data){
            return $http.post('/api/createmissionteam', data);
        };

        missionFactory.getmissionteams = function(data){
            return $http.get('/api/getmissionteams', data);
        };

        missionFactory.getallteams = function(data){
            return $http.get('/api/getallteams', data);
        };

        missionFactory.missionteam = function(data){
            return $http.post('/api/missionteam', data);
        };

        missionFactory.deletemissionteam = function(data){
            return $http.post('/api/deletemissionteam', data);
        };

        missionFactory.createnewperson = function(data){
            return $http.post('/api/createnewperson', data);
        };

        missionFactory.deleteperson = function(data){
            return $http.post('/api/deleteperson', data);
        };

        missionFactory.sort = function(data){
            return $http.post('/api/sort', data);
        };

        missionFactory.clearteam = function( data ){
            return $http.post('/api/postclearteams', data);
        };

        missionFactory.switch = function( data ){
            return $http.post('/api/switch', data);
        };

        missionFactory.getSorted = function ( data ){
            return $http.get('/api/getSorted');
        };

        // missionFactory.getDeleteAllTeam = function ( data ){
        //     return $http.get('/api/getDeleteAllTeam');
        // };

        missionFactory.postScheConflict = function ( data ){
            return $http.post('/api/postScheConflict', data );
        };

        missionFactory.postDeletePersonTeam = function ( data ){
            return $http.post('/api/postDeletePersonTeam', data );
        };

        return missionFactory;

    });