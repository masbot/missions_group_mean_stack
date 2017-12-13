angular.module('groupCtrl', ['groupService'])

    .controller('groupController', function($rootScope, $location, Auth, $scope, Group){

        var vm = this;
        vm.loggedIn = Auth.isLoggedIn();
        if(vm.loggedIn){
            update();
        }
        function update(){
            Group.getcsv()
                .then(function(data){
                    vm.persons = data.data.persons;

                    var num = numOf(vm.persons);
                    vm.male = num.male;
                    vm.female = num.female;
                    vm.hongdae = num.hongdae;
                    vm.busan = num.busan;
                    vm.itaewon = num.itaewon;
                    vm.sillim = num.sillim;
                    vm.active = num.active;
                    vm.reserve = num.reserve;
                    vm.member = num.member;
                    vm.nonmember = num.nonmember;
                });

            Group.getgroups()
                .then(function(data){
                    vm.groups = data.data.groups;
                });
        }

        function numOf(person){
            var male = 0;
            var female = 0;
            var busan = 0;
            var hongdae = 0;
            var itaewon = 0;
            var sillim = 0;
            var active = 0;
            var reserve = 0;
            var member = 0;
            var nonmember = 0;

            for(var i = 0; i<person.length; i++){
                if(person[i].gender == "Male"){
                    male++;
                }else{
                    female++;
                }

                if(person[i].campus == "Busan"){
                    busan++;
                }else if(person[i].campus == "Hongdae"){
                    hongdae++;
                }else if(person[i].campus == "Itaewon"){
                    itaewon++;
                }else if(person[i].campus == "Sillim"){
                    sillim++;
                }

                if(person[i].type == "Active"){
                    active++;
                }else if(person[i].type == "Reserve"){
                    reserve++;
                }else if(person[i].type == "Member"){
                    member++;
                }else if(person[i].type == "Non-member"){
                    nonmember++;
                }
            }
            var data = {
                male: male,
                female: female,
                hongdae: hongdae,
                busan: busan,
                itaewon: itaewon,
                sillim: sillim,
                active: active,
                reserve: reserve,
                member: member,
                nonmember: nonmember
            };
            return data;
        }

        vm.showGender = function(x){
            if(vm.Male == undefined && vm.Female == undefined){
                return x.gender;
            }else if(vm.Male == x.gender){
                return x.gender;
            }else if(vm.Female == x.gender) {
                return x.gender;
            }
        }

        vm.showCampus = function(x){
            if(vm.Hongdae == undefined && vm.Busan == undefined && vm.Itaewon == undefined && vm.Sillim == undefined){
                return x.campus;
            }else if(vm.Hongdae == x.campus){
                return x.campus;
            }else if(vm.Busan == x.campus){
                return x.campus;
            }else if(vm.Itaewon == x.campus){
                return x.campus;
            }else if(vm.Sillim == x.campus){
                return x.campus;
            }
        };

        vm.showType = function(x){
            if(vm.Active == undefined && vm.Reserve == undefined && vm.Member == undefined && vm.Nonmember == undefined){
                return x.type;
            }else if(vm.Active == x.type){
                return x.type;
            }else if(vm.Reserve == x.type){
                return x.type;
            }else if(vm.Member == x.type){
                return x.type;
            }else if(vm.Nonmember == x.type){
                return x.type;
            }
        };



        //every req check logged in user.
        //if the route is changing,then we want to
        $rootScope.$on('$routeChangeStart', function(){
            vm.loggedIn = Auth.isLoggedIn();
            //if the user is logged in then you get to get user's info
            Auth.getUser()
                .then(function(data){
                    vm.user = data.data;
                });
        });

        var group = [];
        vm.selectedlist = [];

        vm.select = function(person, name, campus, type){

            //when you unselect then delete that person from list
            for(var i = 0; i < vm.selectedlist.length; i++){
                if(vm.selectedlist[i].name == name){
                    vm.selectedlist.splice(i, 1);
                    group.splice(i, 1);
                    return false;
                }
            }
            group.push(person);
            vm.selectedlist.push({name:name, campus: campus, type:type});
        }

        vm.makegroup = function(){
            console.log(group);
            Group.makegroup(group)
                .then(function(data){
                    group = [];
                    update();
                });

            vm.selectedlist = [];
        }

        vm.addtogroup = function(){
            if(vm.selectedGroupNum && group.length > 0){
                if(vm.selectedGroupNum.number > 0){
                    var data = {
                        groupnum: vm.selectedGroupNum.number,
                        group: group
                    };

                    Group.addtogroup(data)
                        .then(function(data){
                            update();
                        });
                }
            }else{
                alert("select a group or member");
            }
            vm.selectedlist = [];
        }

        vm.switchlist = [];

        vm.switch = function(group){
            for(var i = 0; i < vm.switchlist.length; i++){
                if(vm.switchlist[i] == group){
                    vm.switchlist.splice(i, 1);
                    return false;
                }
            }

            if(vm.switchlist.length < 2){
                vm.switchlist.push(group);
                vm.one = vm.switchlist[0];
                console.log(group);
                console.log(vm.switchlist);
            }else{
                console.log("false ", vm.switchlist);
                return false;
            }
        }


        vm.sortperson = function(){

            var numofgroup = vm.groups.length;
            var groups = {};

            for( var group in vm.groups){
                groups[vm.groups[group].number] = {
                    active: 0,
                    reserve: 0,
                    member: 0,
                    nonmember: 0,
                    Hongdae: 0,
                    Busan: 0,
                    Sillim: 0,
                    Itaewon: 0,
                    Guest: 0,
                    members: []
                }
            }

            var type = {
                active: [],
                reserve: [],
                member: [],
                nonmember: []
            };

            for( var person in vm.persons){
                if(vm.persons[person].type == "Active"){
                    type.active.push(vm.persons[person]);
                }else if(vm.persons[person].type == "Reserve"){
                    type.reserve.push(vm.persons[person]);
                }else if(vm.persons[person].type == "Member"){
                    type.member.push(vm.persons[person]);
                }else if(vm.persons[person].type == "Non-member"){
                    type.nonmember.push(vm.persons[person]);
                }
            }

            var counter = 1;
            for(var typeofgroup in type){

                var group = type[typeofgroup];

                for( var person in group ){

                    groups[counter].members.push(group[person]._id);
                    var t = group[person].type.toLowerCase();
                    var c = group[person].campus;

                    if(t == "non-member"){
                        groups[counter]['nonmember']++;
                    }else{
                        groups[counter][t]++;
                    }

                    groups[counter][c]++;
                    counter++;
                    if(counter == (numofgroup + 1) ){
                        counter = 1;
                    }
                }
            }

            console.log(groups);
            Group.sortgroup({groups: groups})
                .then(function(data){
                    console.log(data);
                });
        }
    })
    .controller('eachgroupController', function($rootScope, $location, Auth, $scope, Group, $routeParams){

        var vm = this;
        //every req check logged in user.
        //if the route is changing,then we want to
        $rootScope.$on('$routeChangeStart', function(){
            vm.loggedIn = Auth.isLoggedIn();
            //if the user is logged in then you get to get user's info
            Auth.getUser()
                .then(function(data){
                    vm.user = data.data;
                });
        });

        var groupnum = {
            groupnum : $routeParams.groupnum
        };


        vm.group;
        vm.people;

        Group.getgroup(groupnum)
            .then(function(data){
                vm.group = data.data.groups[0];
                vm.people = data.data.groups[0].people;
            });

        var deleteList = [];

        vm.delete = function(person){
            deleteList.push(person);
        }

        vm.deleteExec = function(data){
            Group.deletefromgroup({deleteList: deleteList, groupnum: data})
                .then(function(data){
                    console.log(data);
                });
        }
    })

    .controller('switchController', function($rootScope, $location, Auth, $scope, Group, $routeParams){

        var vm = this;
        //every req check logged in user.
        //if the route is changing,then we want to
        $rootScope.$on('$routeChangeStart', function(){
            vm.loggedIn = Auth.isLoggedIn();
            //if the user is logged in then you get to get user's info
            Auth.getUser()
                .then(function(data){
                    vm.user = data.data;
                });
        });

        var group1 = $routeParams.group1;
        var group2 = $routeParams.group2;

        function update($routeParams){

            var group1 = $routeParams.group1;
            var group2 = $routeParams.group2;
            var switchlist = [group1, group2];

            vm.grouplist = [];

            for(var i = 0; i<switchlist.length;i++){
                Group.getgroup({groupnum:switchlist[i]})
                    .then(function(data){
                        vm.grouplist.push(data.data.groups[0]);
                    });
            }
        }

        update($routeParams);


        var groupOne = [];
        var groupTwo = [];
        var groupOneName = [];
        var groupTwoName = [];

        vm.switch = function(id, name, groupnum){
            if(group1 == groupnum){
                groupOne.push(id);
                groupOneName.push(name);
            }else if(group2 == groupnum){
                groupTwo.push(id);
                groupTwoName.push(name);
            }
            console.log("groupOneName: ", groupOneName);
            console.log("groupTwoName: ", groupTwoName);


            switchgroupData[0].people = groupOne;
            switchgroupData[1].people = groupTwo;

            console.log(groupOne,groupTwo,switchgroupData);

        };

        var switchgroupData = [
            {
                groupnum: group1,
                people: null,
                newgroupnum:group2
            },
            {
                groupnum: group2,
                people: null,
                newgroupnum:group1
            }
        ];

        vm.switchExec = function(){
            Group.switchgroup(switchgroupData)
                .then(function(data){
                    groupOneName = [];
                    groupTwoName = [];
                    groupOne = [];
                    groupTwo = [];
                    update($routeParams);
                });
        }




    });