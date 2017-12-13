angular.module('userCtrl', ['userService', 'authService'])

    .controller('userController', function(){
        var vm = this;

    })
    .controller('userCreateController', function(User, $location, $window){
		var vm = this;
		vm.signupUser = function(){
			vm.message = '';
			User.create(vm.data)
				.then(function(response){
					// vm.userData = {};

					// vm.message = response.data.message;
					// //store the token in the browser
					$window.localStorage.setItem('token', response.data.token);
					// $location.path('/discussionboard');
				});
		}
	});
