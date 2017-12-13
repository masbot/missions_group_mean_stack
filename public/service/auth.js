angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken){

	var authFactory = {};

	authFactory.signin = function(data){
		return $http.post('/api/signin', data)
		//promise function if success then run
		.success(function(data){
			AuthToken.setToken(data.token)
			return data;
		})
	}

	authFactory.logout = function(){
		AuthToken.setToken();
	}

	//check if user is loggedIn
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.get('/api/me');
		}else{
			return $q.reject({ message: "User has no token"});
		}
	}


	return authFactory;

})

//get token from the browser $window
.factory('AuthToken', function($window){

	var authTokenFactory = {};

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	authTokenFactory.setToken = function(token){
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken){

	var interceptorFactory = {}

	interceptorFactory.request = function(config){
		//console.log('config: ', config);

		var token = AuthToken.getToken();

		if(token){
			config.headers['x-access-token'] = token;
		}
		return config;

	}

	// if you do not have token this will intercept you and 
	// send you to the login page.
	interceptorFactory.responseError = function(response){
		if(response.status == 403)
			$location.path('login');
		return $q.reject(response);
	}

	return interceptorFactory;
});