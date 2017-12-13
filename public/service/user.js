angular.module('userService', [])

	.factory('User', function($http) {

		var userFactory = {};

		userFactory.create = function(data) {
			return $http.post('/api/signup', data);
		}

		return userFactory;

	});