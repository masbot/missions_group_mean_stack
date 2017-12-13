var User = require('../model/user');
var Person = require('../model/person');
var Group = require('../model/group');
var MPerson = require('../model/mperson');
var MTeam = require('../model/mteam');
var Sorted = require('../model/sorted');
var secretKey = "123ABC";

var jsonwebtoken = require('jsonwebtoken');

function createToken(user){

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expirtesInMinute: 1440
	});

	return token;
}

module.exports = function(app, express) {

	var api = express.Router();
    
	api.post('/signup', function(req, res){
    
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
    
		var token = createToken(user);
    
		user.save(function(err){
			if(err){
				res.send(err);
				return;
			}
    
			res.json({
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});
    
	api.post('/signin', function(req, res){
    
		var check = User.comparePassword(req.body.password);
    
		User.findOne({
			name: req.body.name
		}).exec(function(err, user){
    
			var check = user.comparePassword(req.body.password);

			if(!user){
				res.send({message: "User doesn't Exist"});
			}else{
				var token = createToken(user);
				var check = user.comparePassword(req.body.password);
				if(check){
					res.json({
						success:true,
						token: token
					});
				}else{
					res.json({
						success:false,
						message:"wrong password."
					});
				}
			}
		});
	});
    
	api.use(function(req, res, next){
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    
		if(token){
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err){
					res.status(403).send({success:false, message:"Failed to authenticate user"});
				}else{
					req.decoded = decoded;
					next();
				}
			});
		}else{
			res.status(403).send({success:false, message: "No token Provided"});
		}
	});
    
	api.get('/', function(req, res){
    
		res.json("Hello World!");
    
	});

	api.get('/me', function(req, res){
		res.json(req.decoded);
	});


	// ----------------------------- Missions Start ----------------------------- //

	//create mission people list
	api.post('/missions', function(req, res){

		var missions = req.body;
		for(var i = 0; i < missions.length; i++){
            (function(missions){
                var mperson = new MPerson({
                    name: missions[i].Name,
                    gender: missions[i].Gender,
                    type: missions[i].Type,
                    campus: missions[i].Campus,
                    personality: missions[i].Personality,
                    experience: missions[i].Experience,
                    skill: missions[i].Skill,
                    citizenship: missions[i].Citizenship,
                    vacationbeg: missions[i].Vacationbeg,
                    vacationend: missions[i].Vacationend,
					preference1: missions[i].Preference1,
					preference2: missions[i].Preference2
                });

                mperson.save(function(err){
                    if(err){
                        res.send(err);
                        return;
                    }
                });
            })(missions);
		}

        res.json({
            success:true
        });
	});

	//get list of missions people
	api.get('/getmperson', function(req,res){
		MPerson.find({
			select: false
		}).exec(function(err, persons){
			res.json({
				success:true,
				persons: persons
			});
		});
	});

	//update people vacation dates
	api.post('/updatemperson', function(req, res){
		var vacationbeg = req.body.vacationbeg;
		var vacationend = req.body.vacationend;
		var missionperson = req.body.missionperson;
		for (var key in vacationbeg) {
            (function(missionperson, vacationend, vacationbeg, key){
                MPerson.findOneAndUpdate({_id: missionperson[key]._id}, {$set:{vacationbeg:vacationbeg[key], vacationend: vacationend[key] }}).exec(function(err, mperson){
                    if(err){
                        res.json({
                            success:false,
                            mperson: "update on mperson has failed."
                        });
                    }
                });
            })(missionperson, vacationend, vacationbeg, key);
		}
        res.json({
            success:true
        });
	});

	//create mission team
	api.post('/createmissionteam', function(req, res){
		var missionteam = req.body.missionteam;
		var mteam = new MTeam({
			name: missionteam.name,
			datebeg: missionteam.datebeg,
			dateend: missionteam.dateend
		});

		mteam.save(function(err){
			if(err){
				res.send(err);
				return;
			}

			res.json({
				success: true,
				message: "New Team Created"
			});
		});
	});

	api.get('/getmissionteams', function(req,res){
		MTeam.find({}).exec(function(err, mteams){
			if(err){
				res.send(err);
				return;
			}
			res.json({
				success:true,
				mteams: mteams
			});
		});
	});

	api.get('/getallteams', function(req,res){
		MTeam.find({}).populate('members').exec(function(err, mteams){
			if(err){
				res.send(err);
				return;
			}
			res.json({
				success:true,
				mteams: mteams
			});
		});
	});

	api.post('/missionteam', function(req, res){
		var teamname = req.body.teamname;

		MTeam.find({
			name: teamname
		}).populate('members').exec(function(err, mteam){
			if(err){
				res.send(err);
				return;
			}

			res.json({
				success:true,
				mteam: mteam
			});
		});
	});

	api.post('/deletemissionteam', function(req, res){
		var teams = req.body.teams;
		var length = teams.length;
		for(var team in teams){
			MTeam.findOneAndRemove({name: new RegExp('^'+teams[team]+'$', "i") }, function(err, team){
				if(err){
					res.send(err);
					return;
				}
			});
			if(team == (length-1)){
				res.json({
					success: true,
					team: team
				});
			}
		}
	});

	api.post('/createnewperson', function(req, res){

		var newperson = req.body.newperson;

		var mperson = new MPerson({
			name: newperson.Name,
			gender: newperson.Gender,
			type: newperson.Type,
			campus: newperson.Campus,
			personality: newperson.Personality,
			experience: newperson.Experience,
			skill: newperson.Skill,
			citizenship: newperson.Citizenship,
			vacationbeg: newperson.Vacationbeg,
			vacationend: newperson.Vacationend,
			preference1: newperson.Preference1.name,
			preference2: newperson.Preference2.name
		});

		mperson.save(function(err){
			if(err){
				res.send(err);
				return;
			}

			res.json({
				success: true,
				message: "New person has been created!"
			});
		});

	});

	api.post('/deleteperson', function(req, res){
		var people = req.body.people;
		var length = people.length;
		for(var person in people){
            (function( people, person, length ){
                MPerson.findOneAndRemove({_id: people[person]}, function(err, person){
                    if(err){
                        res.send(err);
                        return;
                    }
                });

                if(person == (length-1)){
                    res.json({
                        success:true,
                        message: "Selected people have been deleted!"
                    });
                }
            })( people, person, length );
		}
        res.json({
            success:true
        });

	});

	api.post('/postclearteams', function( req, res ){
		var teams = req.body.teams;

		for(var t in teams){

			(function(teamname){
				if(teamname != "Schedule Conflict"){
					MTeam.findOne({name: teamname}, function( err, team ){
						if( err ){
							res.send(err);
							return;
						}

						team.members = [];

						team.save(function( err ){
							console.log( err );
						});
					});
				}
			})(teams[t].name);
		}

		MTeam.remove({name: "Schedule Conflict"}, function(err, data){

			if(err){
				res.send(err);
				return;
			}

			res.json({
				success:true
			});

		});
	});

	api.post('/sort', function(req, res){

        var teams = req.body.teams;
        var members;

		for(var t in teams){
			members = teams[t].members;
			(function(members){
				MTeam.findOne({name: t}, function(err, team){

					for(var i = 0; i < members.length; i++){
						team.members.push(members[i]._id);
					}

					team.save(function(err){
						console.log(err);
					});
				});
			})(members);
		}

        res.json({
            success:true
        });
	});


	api.post('/switch', function( req, res ){

		var team1 = req.body.team1;
		var team2 = req.body.team2;
		var group1 = req.body.group1;
		var group2 = req.body.group2;

		MTeam.findOneAndUpdate({ name: team1 }, { $pull: { members: { $in: group1 } }}, { multi: true }, function( err, group ){

			for(var j = 0; j < group2.length; j++){
				group.members.push( group2[j] );
			}

			group.save(function(err){
				if(err){
					res.send(err);
					return;
				}
			});
		});

		MTeam.findOneAndUpdate({ name: team2 }, { $pull: { members: { $in: group2 } }}, { multi: true }, function( err, group ){

			for(var j = 0; j < group1.length; j++){
				group.members.push( group1[j] );
			}

			group.save(function(err){
				if(err){
					console.log("group error");
				}
			});
		});

        res.json({
            success: true,
            message: "members switched"
        });
	});

	api.get('/getSorted', function( req, res ){

        Sorted.findOne({ sort: true }).exec(function(err, sort){

            if(sort == null){
                var sorted = new Sorted({
                    sort: true
                });

                sorted.save(function(err){
                    if(err){
                        res.send(err);
                        return;
                    }

                    res.json({
                        success: true,
                        message: 'Sorted!'
                    });
                });
            }else{
                res.json({
                    success: false,
                    message: 'Already Sorted!'
                });
            }
        });
	});

    api.post('/postScheConflict', function( req, res){

        var members = req.body.members;

        var mteam = new MTeam({
            name: 'Schedule Conflict',
            datebeg: '',
            dateend: '',
            members: members
        });

        mteam.save(function(err){
            if(err){
				res.send(err);
				return;
            }

            res.json({
                success: true,
                message: "Schedule Conflict Group Created"
            });
        });

    });

	api.post('/postDeletePersonTeam', function( req, res ){

		var personId = req.body.personId;
		var mteam = req.body.mteam;

		MTeam.findOneAndUpdate({ name: mteam }, { $pull: {members: personId}}).populate('members').exec( function( err, team ){

			if(err){
				return res.json({
					success: false,
					message: "Did not delete person"
				});
			}

			res.json({
				success: true,
				members: team.members,
				message: "delete success"
			});

		});

	});
	// ----------------------------- Missions End ----------------------------- //




	// ----------------------------- Retreat Start ----------------------------- //

	//create list of retreat people
	api.post('/csv', function(req, res){
		var csv = req.body;

		for(var i = 0; i < csv.length; i++){
			var person = new Person({
				name: csv[i].Name,
				gender: csv[i].Gender,
				type: csv[i].Type,
				campus: csv[i].Campus
			});

			person.save(function(err){
				if(err){
					console.log(err);
					//res.send(err);
					//return;
				}
			});
		}

		res.json({
			success: true,
			message: 'Each Person has been uploaded!'
		});
	});

	//gets whole list of people
	api.get('/csv', function(req, res){
		Person.find({
			select: false
		}).exec(function(err, persons){
			res.json({
				success:true,
				persons: persons
			});
		});
	});

	//create group from selected people
	// ** MAKE FUNCTION ** //
	api.post('/makegroup', function(req, res){

		var people = req.body;
		Group.find({}).exec(function(err, groups){
			var num = groups.length;
			num = num +1;

			var group = new Group({
				number: num,
				people : people
			});

			group.save(function(err, data){
				for(var i = 0; i<people.length;i++){
					Person.findOneAndUpdate({_id: people[i]}, {$set:{select:true}}, {new:true}, function(err, user){
						if(err){
							console.log("something went wrong");
						};
					});
				}

				res.json({
					success: true,
					message: "group has been made!"
				});
			});
		});


	});

	//get all groups
	api.get('/getgroups', function(req, res){

		Group.find({})
			.populate('people')
			.exec(function(err, group){
				res.json({
					success:true,
					groups: group
				});
		});
	});

	//get specific group
	api.post('/getgroup', function(req, res){

		Group.find({
			number: req.body.groupnum
		}).populate('people').exec(function(err, group){
			if(err){
				//error message
			}

			res.json({
				success:true,
				groups: group
			});
		});
	});

	//add person to a group
	// ** ADD FUNCTION ** //
	api.post('/addtogroup', function(req, res){
		var newGroup = req.body.group;
		Group.findOne({
			number: req.body.groupnum
		},function(err, group){
			for(var i = 0; i< newGroup.length; i++){
				group.people.push(newGroup[i]);
				Person.findOneAndUpdate({_id: newGroup[i]}, {$set:{select:true}}, {new:true}, function(err, user){
					if(err){
						console.log("something went wrong");
					}
				});
			}
			group.save(function(err){
				if(err){
					console.log("group error");
				}

				res.json({
					success: true
				});
			});
		});

	});

	//delete a person from a group
	// ** DELETE FUNCTION ** //
	api.post('/deletefromgroup', function(req, res){

		Group.update({number: req.body.groupnum}, { $pull: { people: { $in: req.body.deleteList } }}, {multi: true}, function(err, group){

			if(err){
				res.json({
					success:false
				});
			}

			Person.update( { _id: { $in: req.body.deleteList } }, {$set:{select:false}},{multi: true}, function(err, person){
				if(err){
					res.json({
						success:false
					});
				}

				res.json({
					success:true,
					message:"deleted from group"
				});
			});

		});

	});

	//switch selected person or people to another group
	// ** SWITCH FUNCTION ** //
	api.post('/switchgroup', function(req, res){

		var data = req.body;
		var newGroup1 = data[0].people;
		var groupNum1 = data[0].groupnum;
		var newGroup2 = data[1].people;
		var groupNum2 = data[1].groupnum;

		Group.findOneAndUpdate({number: groupNum1}, { $pull: { people: { $in: newGroup1 } }}, {multi: true}, function(err, group){
			if(err){
				res.json({
					success:false,
					message: "group1 fail"
				});
			}

			for(var j = 0; j < newGroup2.length; j++){
				group.people.push(newGroup2[j]);
			}

			group.save(function(err){
				if(err){
					console.log("group error");
				}

				Group.findOneAndUpdate({number: groupNum2}, { $pull: { people: { $in: newGroup2 } }}, {multi: true}, function(err, group){
					if(err){
						res.json({
							success:false,
							message: "group1 fail"
						});
					}

					for(var j = 0; j < newGroup1.length; j++){
						group.people.push(newGroup1[j]);
					}

					group.save(function(err){
						if(err){
							console.log("group error");
						}

						res.json({
							success: true
						});
					});
				});
			});
		});
	});

	api.post('/sortgroup', function(req, res){

		var groups = req.body.groups;

		for(var i in groups){
			var members = groups[i].members;

			(function(members){
				Group.findOne({number: i}, function(err, group){

					for(var i = 0; i<members.length; i++){
						group.people.push(members[i]);
					}

					group.save(function( err ) {

						if( err ){
							res.json({
								success: false
							});
						}
                        //
						//res.json({
						//	success: true
						//})
					});
				});
			})(members);
		}


		res.json({
			success: true
		})
	});


	// ----------------------------- Retreat End ----------------------------- //


	return api;

};














