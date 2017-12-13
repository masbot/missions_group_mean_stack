angular.module('mainCtrl', ['mainService'])

    .controller('mainController', function($rootScope, $location, Auth, $scope, Main, Mission){
        
		var vm = this;

		// vm.loggedIn = Auth.isLoggedIn();

		// Auth.getUser()
		// 	.then(function(data){
		// 		vm.user = data.data;
		// 	});
        //
		// vm.doLogout = function(){
		// 	Auth.logout();
		// };


		Mission.getmperson()
			.then(function(data){
				vm.mperson = data.data.persons;
			});

		//every req check logged in user. 
		//if the route is changing,then we want to  
		// $rootScope.$on('$routeChangeStart', function(){
        //
		// 	vm.loggedIn = Auth.isLoggedIn();
        //
		// 	//if the user is logged in then you get to get user's info
		// 	Auth.getUser()
		// 		.then(function(data){
		// 			vm.user = data.data;
		// 		});
		// });

		// vm.signIn = function(){
		// 	vm.processing = true;
		// 	vm.error = '';
		// 	Auth.signin(vm.data)
		// 		.success(function(data){
		// 			vm.processing = false;
		// 			Auth.getUser()
		// 				.then(function(data){
		// 					vm.user = data.data;
		// 				});
        //
		// 			if(data.success)
		// 				$location.path('/');
		// 			else
		// 				vm.error = data.message;
		// 		});
		// }

		$scope.fileNameChanged = function(files) {
			var file = files[0];
			var reader = new FileReader();

			reader.onload = function() {
				var data = this.result;
				var json = CSV2JSON(data);
				var persons = JSON.parse(json);
				var length = persons.length;
				var num = Math.ceil(length/20);

				var start;
				var end;
				for(var i = 0; i < num; i++){
					start = (i*20);
					end = 20*(i+1);
					json = persons.slice(start, end);
					console.log(json);
					Main.csv(json)
						.then(function(data){
							console.log(data);
						});
				}
			}
			reader.readAsText(file);
		}

		$scope.missions = function(files) {

			if(vm.mperson.length == 0){
				var file = files[0];
				var reader = new FileReader();

				reader.onload = function() {
					var data = this.result;
					var json = CSV2JSON(data);
					var persons = JSON.parse(json);
					var length = persons.length;
					var num = Math.ceil(length/20);

					var start;
					var end;
					for(var i = 0; i < num; i++){
						start = (i*20);
						end = 20*(i+1);
						json = persons.slice(start, end);

						Main.missions(json)
							.then(function(data){

							});
					}
				};
				reader.readAsText(file);
				$location.path( "/mperson" );
			}else{
				alert("list is already loaded");
			}
		};

		function CSVToArray(strData, strDelimiter) {
			strDelimiter = (strDelimiter || ",");
			var objPattern = new RegExp((
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
			var arrData = [[]];
			var arrMatches = null;
			while (arrMatches = objPattern.exec(strData)) {
				var strMatchedDelimiter = arrMatches[1];
				if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
					arrData.push([]);
				}
				if (arrMatches[2]) {
					var strMatchedValue = arrMatches[2].replace(
						new RegExp("\"\"", "g"), "\"");
				} else {
					var strMatchedValue = arrMatches[3];
				}
				arrData[arrData.length - 1].push(strMatchedValue);
			}
			return (arrData);
		}

		function CSV2JSON(csv) {
			var array = CSVToArray(csv);
			var objArray = [];
			for (var i = 1; i < array.length; i++) {
				objArray[i - 1] = {};
				for (var k = 0; k < array[0].length && k < array[i].length; k++) {
					var key = array[0][k];
					objArray[i - 1][key] = array[i][k]
				}
			}
			var json = JSON.stringify(objArray);
			var str = json.replace(/},/g, "},\r\n");
			return str;
		}

    });