angular.module('missionCtrl', ['missionService'])

    .controller('missionController', function($rootScope, $location, Auth, $scope, Mission, $route){

        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();
        console.log('vm.loggedIn: ' ,vm.loggedIn);

        Auth.getUser()
            .then(function(data){
                vm.user = data.data;
            });

        vm.doLogout = function(){
            Auth.logout();
        };

        updatePage();

        function updatePage(){
            Mission.getmperson()
                .then(function(data){
                    vm.mperson = data.data.persons;
                });

            Mission.getmissionteams()
                .then(function(data){
                    vm.missionteams = data.data.mteams;
                    console.log(vm.missionteams);
                });
        }


        vm.people = [];

        vm.begDate = new Date();
        vm.endDate = new Date();
        vm.personBegDate;
        vm.personEndDate;
        vm.teamBegDate;
        vm.teamEndDate;

        vm.test = function(i, name ,data){
            console.log('data: ',i ,' ',name ,' ', data);
            vm.mperson[i].vacation = name;
        };

        vm.update = function(){
            Mission.updatemperson({vacationbeg:vm.personBegDate, vacationend:vm.personEndDate, missionperson: vm.mperson})
                .then(function(data){
                }).then( updatePage());
        };

        /*
        1. sorts people whose vacation dates are set
        2. sorts people who have skills
        3. and the rest

        for 2 and 3 people are placed based on type
         */

        vm.sortteam = function(){


            Mission.clearteam({teams: vm.missionteams})
                .then(function(data){
                    Mission.getmissionteams()
                        .then(function(data){
                            var MT = data.data.mteams;

                            var missionTeams = {};
                            var scheduleConflict = [];

                            //make array variables for each team
                            for(var num in MT) {

                                var teamname = MT[num].name;
                                missionTeams[teamname] = {
                                    members: [],
                                    photo: null,
                                    praise: null,
                                    video: null,
                                    active: 0,
                                    reserve: 0,
                                    member: 0,
                                    sang: 0,
                                    mel: 0,
                                    chol: 0,
                                    phelg: 0
                                };
                            }

                            for(var key in vm.mperson) {

                                var vacationbeg = vm.mperson[key].vacationbeg;
                                var vacationend = vm.mperson[key].vacationend;
                                var personality = vm.mperson[key].personality.toLowerCase();
                                var type = vm.mperson[key].type.toLowerCase();

                                if(vacationbeg){
                                    var counter1 = 0;
                                    for(var num in MT) {

                                        var datebeg = MT[num].datebeg;
                                        var dateend = MT[num].dateend;
                                        var teamname = MT[num].name;

                                        if(vacationbeg <= datebeg && vacationend >= dateend){

                                            if(counter1 > 0){
                                                //
                                            }else{
                                                missionTeams[teamname].members.push(vm.mperson[key]);
                                                //if person has skill
                                                if(vm.mperson[key].skill){
                                                    if(missionTeams[teamname].photo == null && vm.mperson[key].skill == 'Photo'){
                                                        missionTeams[teamname].photo = vm.mperson[key].name;
                                                    }else if(missionTeams[teamname].praise == null && vm.mperson[key].skill == 'Praise'){
                                                        missionTeams[teamname].praise = vm.mperson[key].name;
                                                    }else if(missionTeams[teamname].video == null && vm.mperson[key].skill == 'Video'){
                                                        missionTeams[teamname].video = vm.mperson[key].name;
                                                    }
                                                }
                                                missionTeams[teamname][type]++;
                                                missionTeams[teamname][personality]++;
                                                counter1++;
                                            }

                                        }else{
                                            if(counter1 == MT.length-1){
                                                scheduleConflict.push(vm.mperson[key]);
                                            }
                                            counter1++;
                                        }

                                    }
                                    counter1 = 0;
                                }
                                else if(vm.mperson[key].skill){
                                    var counter = 0;
                                    for(var team in missionTeams){
                                        if(counter == 0){
                                            if(missionTeams[team].photo == null && vm.mperson[key].skill == 'Photo'){
                                                missionTeams[team][type]++;
                                                missionTeams[team][personality]++;
                                                missionTeams[team].members.push(vm.mperson[key]);
                                                missionTeams[team].photo = vm.mperson[key].name;
                                                counter++;
                                            }else if(missionTeams[team].praise == null && vm.mperson[key].skill == 'Praise'){
                                                missionTeams[team][type]++;
                                                missionTeams[team][personality]++;
                                                missionTeams[team].members.push(vm.mperson[key]);
                                                missionTeams[team].praise = vm.mperson[key].name;
                                                counter++;
                                            }else if(missionTeams[team].video == null && vm.mperson[key].skill == 'Video'){
                                                missionTeams[team][type]++;
                                                missionTeams[team][personality]++;
                                                missionTeams[team].members.push(vm.mperson[key]);
                                                missionTeams[team].video = vm.mperson[key].name;
                                                counter++;
                                            }
                                        }
                                    }

                                    if(counter == 0){
                                        var lowestNum = null;
                                        var lowteam = '';
                                        for(var team in missionTeams){
                                            if(lowestNum == null){
                                                lowteam = team;
                                                lowestNum = missionTeams[team][type];
                                            }else{
                                                if(lowestNum > missionTeams[team][type]){
                                                    lowteam = team;
                                                    lowestNum = missionTeams[team][type];
                                                }
                                            }
                                        }
                                        missionTeams[lowteam][personality]++;
                                        missionTeams[lowteam][type]++;
                                        missionTeams[lowteam].members.push(vm.mperson[key]);
                                    }
                                    counter = 0;
                                }else{
                                    var lowestNum = null;
                                    var lowteam = '';
                                    for(var team in missionTeams){
                                        if(lowestNum == null){
                                            lowteam = team;
                                            lowestNum = missionTeams[team][type];
                                        }else{
                                            if(lowestNum > missionTeams[team][type]){
                                                lowteam = team;
                                                lowestNum = missionTeams[team][type];
                                            }
                                        }
                                    }
                                    missionTeams[lowteam][personality]++;
                                    missionTeams[lowteam][type]++;
                                    missionTeams[lowteam].members.push(vm.mperson[key]);
                                }
                            }


                            console.log(missionTeams, scheduleConflict);
                            perferenceSort(missionTeams);
                            console.log("next");
                            perferenceSort2(missionTeams);

                            Mission.postScheConflict({ members: scheduleConflict })
                                .then(function(data){
                                    Mission.sort({ teams: missionTeams })
                                        .then(function(data){
                                            alert("finished sorted!");
                                        });
                                });

                        });
                });

        };


        function perferenceSort(array1){

            for(var key1 in array1){
                var members1 = array1[key1].members;
                for(var key2 in array1){
                    if( key1 !== key2 ){
                        var members2 = array1[key2].members;
                        switchByPreference(members1, key1, members2, key2);
                    }
                }
            }
        }

        function switchByPreference(team1, team1Name ,team2, team2Name){


            for(var i = 0; i < team1.length; i++){

                for(var j = 0; j < team2.length; j++){

                    if(team2[j].preference1 == team1Name && team1[i].type == team2[j].type && team1[i].preference1 != team1Name){
                        // console.log("switchpreference1");
                        // console.log("team1name: ", team1Name);
                        // console.log("team2name: ", team2Name);
                        // console.log("team1:", team1, "i: ", i);
                        // console.log("team2:", team2, "j: ", j);
                        // console.log("team1: ", team1[i].name, ":", team1[i].preference1, ":", team1[i].type);
                        // console.log("team2: ", team2[j].name, ":", team2[j].preference1,  ":", team2[j].type);
                        // console.log("true");
                        var temp = 0;
                        temp = team2[j];
                        team2[j] = team1[i];
                        team1[i] = temp;
                    }
                }
            }
        }

        function perferenceSort2(array1){

            for(var key1 in array1){
                var members1 = array1[key1].members;
                for(var key2 in array1){
                    if( key1 !== key2 ){
                        var members2 = array1[key2].members;
                        switchByPreference2(members1, key1, members2, key2);
                    }
                }
            }
        }

        function switchByPreference2(team1, team1Name ,team2, team2Name){


            for(var i = 0; i < team1.length; i++){

                for(var j = 0; j < team2.length; j++){

                    if(team2[j].preference2 == team1Name && team1[i].type == team2[j].type && team1[i].preference1 != team1Name && team2[j].preference1 != team2Name){
                        // console.log("switchpreference2");
                        // console.log("team1name: ", team1Name);
                        // console.log("team2name: ", team2Name);
                        // console.log("team1:", team1, "i: ", i);
                        // console.log("team2:", team2, "j: ", j);
                        // console.log("team1: ", team1[i].name, ":", team1[i].preference1, ":", team1[i].type);
                        // console.log("team2: ", team2[j].name, " p1: ", team2[j].preference1, " p2: ", team2[j].preference2,  ":", team2[j].type);
                        // console.log("true");
                        var temp = 0;
                        temp = team2[j];
                        team2[j] = team1[i];
                        team1[i] = temp;
                    }
                }
            }
        }

        vm.createteam = function(data){
            if(data == undefined || data.name.length == 0 || data.datebeg == undefined || data.dateend == undefined){
                //alert('empty');
            }else{
                Mission.createmissionteam({missionteam:data})
                    .then(function(data){
                        if(data.data.success == true){
                            angular.element('.create-team .md-datepicker-input').val('');
                            angular.element('.create-team .name').val('');
                        }
                    }).then(updatePage());
            }
        };

        var deleteTeamList = [];
        vm.deleteTeam = function(teamname){
            for( var team in deleteTeamList){
                if(deleteTeamList[team] == teamname){
                    deleteTeamList.splice(team, 1);
                    return false;
                }
            }
            deleteTeamList.push(teamname);
        };

        vm.deleteTeamExec = function(){
            Mission.deletemissionteam({teams: deleteTeamList})
                .then(function(data){
                    deleteTeamList = [];
                }).then(updatePage());
        };

        vm.createnewperson = function(data){
            console.log(data);
            Mission.createnewperson(data)
                .then(function(data){

                });
        };

        vm.createExec = function(){
            console.log(vm.newperson);
            Mission.createnewperson({newperson: vm.newperson})
                .then(function(data){
                    if(data.data.success == true){
                        angular.element('#newperson input').val('');
                        angular.element('#newperson select').val('');
                    }
                }).then(updatePage())
        };

        var deletePersonList = [];
        vm.deletePerson = function(name, id){

            for( var person in deletePersonList){
                if(deletePersonList[person] == id){
                    deletePersonList.splice(person, 1);
                    return false;
                }
            }
            deletePersonList.push(id);
        };

        vm.deletePersonExec = function(){
            if(confirm("Are you sure you want to delete this person?")){
                Mission.deleteperson({people: deletePersonList})
                    .then(function(data){
                        updatePage();
                        alert("Deleted!");
                    });

            }
        };

        // vm.deleteAllTeam = function(){
        //     Mission.getDeleteAllTeam()
        //         .then(function( data ){
        //             console.log( data );
        //         });
        // }

        vm.teamOne;
        vm.teamTwo;
        var team1;
        var team2;
        var groupOne = [];
        var groupTwo = [];
        vm.groupOneName = [];
        vm.groupTwoName = [];


        function switched (team1, team2){
            Mission.missionteam({teamname: team1})
                .then(function(data){
                    vm.team1 = data.data.mteam[0].members;
                    vm.groupOneName = [];
                    groupOne = [];
                });

            Mission.missionteam({teamname: team2})
                .then(function(data){
                    vm.team2 = data.data.mteam[0].members;
                    vm.groupTwoName = [];
                    groupTwo = [];
                });
        }

        vm.selectedIndex;
        vm.selectedIndex2;

        vm.getTeam1 = function( data, i ){

            vm.selectedIndex = i;
            team1 = data;
            vm.teamOne = data;
            Mission.missionteam({teamname: data})
                .then(function(data){
                    vm.team1 = data.data.mteam[0].members;
                    vm.groupOneName = [];
                    groupOne = [];
                });
        };

        vm.getTeam2 = function( data, i ){
            vm.selectedIndex2 = i;
            team2 = data;
            vm.teamTwo = data;
            Mission.missionteam({teamname: data})
                .then(function(data){
                    vm.team2 = data.data.mteam[0].members;
                    vm.groupTwoName = [];
                    groupTwo = [];
                });
        };

        vm.switch1 = function(id, name, team){
            var i = vm.groupOneName.indexOf(name);
            if(i != -1) {
                vm.groupOneName.splice(i, 1);
            }else{
                groupOne.push(id);
                vm.groupOneName.push(name);
            }
        };

        vm.switch2 = function(id, name, team){
            var i = vm.groupTwoName.indexOf(name);
            if(i != -1) {
                vm.groupTwoName.splice(i, 1);
            }else{
                groupTwo.push(id);
                vm.groupTwoName.push(name);
            }
        };

        vm.switch = function(){
            if(team1 ==  team2){
                alert("can't switch with same team!");
            }else{
                Mission.switch({team1: team1, team2: team2, group1: groupOne, group2: groupTwo })
                    .then( function( data ){
                        console.log(team1, team2);
                        switched(team1, team2);
                    });
            }
        }
    })
    .controller('missionteamController', function($rootScope, $location, Auth, $scope, Mission, $routeParams){

        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser()
            .then(function(data){
                vm.user = data.data;
            });

        vm.doLogout = function(){
            Auth.logout();
        };

        vm.teamname = $routeParams.teamname;

        function refresh(){
            Mission.missionteam({teamname: vm.teamname})
                .then(function(data){
                    vm.team = data.data.mteam[0].members;
                });
        }

        Mission.missionteam({teamname: vm.teamname})
            .then(function(data){
                vm.team = data.data.mteam[0].members;
            });

        vm.delete = function(id, name, team){
            console.log( id, name, team );
            Mission.postDeletePersonTeam({personId: id, mteam: team})
                .then( function( data ){
                    // vm.team = data.data.members;
                    refresh();
                });
        }
    })
    .controller('allteamsController', function($rootScope, $location, Auth, $scope, Mission, $routeParams){

        var vm = this;

        Mission.getallteams()
            .then(function(data){
                vm.missionteams = data.data.mteams;
                console.log(vm.missionteams);
            });
    });


