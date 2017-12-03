var fs = require('fs');
var nJwt = require('njwt');

const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const User = mongoose.model('User');

const schedules = require('./schedules');
const users = require('./users');


// ------- CREATE -----------------//

exports.create = function (req, callback) {
    const userObj = req.user._doc
    var isAdmin = userObj.isAdmin
    // check if the scheduleId exists
    if (isAdmin) {
        // check for required fields
        var team = new Team({
            teamName: req.body.teamName,
            scheduleId: req.body.scheduleId,
            classRoom: req.body.classRoom
        });

        team.save(function (err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, team)
            }
        });

    } else {
        var err = {
            msg: "Not admin",
            code: 10001111
        }

        callback(null, err)
    }
};

exports.updateTeamSchedule = function (teamId, scheduleId, callback) {

    Team.findById(teamId, function (err, team) {

        // If no team was found
        if (err) {
            callback(err, null);
        }

        // Found team!
        if (team != null) {

            schedules.findSchedule(scheduleId, function (err, schedule) {

                if (schedule != null) {

                    team.scheduleId = scheduleId

                    team.save(function (err, updatedTeam) {

                        if (err) {
                            callback(err, null)
                        } else {
                            callback(null, updatedTeam)
                        }
                    })
                }
            })
        }
    });
};


// ---------- GET ONE SPECIFIC TEAM BY ID -----------//

exports.findTeam = function (id, callback) {

    Team.findById(id, function (err, team) {

        // If no team was found
        if (err) {
            return callback(err, null);
        }

        if (!team) {
            return callback({error: "Could not find team"}, null)
        }

        callback(null, team)
    });
};



exports.updateTeam = function (userId, teamId, callback) {

    User.findById(userId, function (err, user) {

        // If no user was found
        if (err) {
            callback(err, null);
        }

        // Found user!
        if (user != null) {

            teams.findTeam(teamId, function (err, team) {

                if (team != null) {

                    user.teamId = teamId;

                    user.save(function (err, updatedUser) {

                        if (err) {
                            callback(err, null)
                        } else {
                            callback(null, updatedUser)
                        }
                    })
                }
            });
        }
    });
};



// ---------- GET ALL TEAMS -----------//

exports.findTeams = function (callback) {

    Team.find({}, function (err, teams) {

        if (err) {
            return callback(err, null)
        }

        callback(err, teams)
    });
};

// ---------- DELETE TEAM AND REMOVED IT FROM USERS WHO ARE IN IT  -----------//

exports.deleteTeam = function (teamId, callback) {

    User.find({}, function (err, users) {

        if (err) {
            callback(err, null)
        }
        else {
            var usersMap = {};

            users.forEach(function (user) {
                if (user.teamId == teamId) {
                    // Set users team to null
                    user.teamId = null

                    // Save user with no team associated
                    user.save(function (err, updatedUser) {

                        if (err) {
                            callback(err, null)
                        } else {

                            // Successfully deleted users teamId and saved user
                            Team.remove({ _id: teamId }, function (err) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    callback(null, { deletedTeam: true })
                                    // removed!
                                }
                            });
                        }
                    })
                }
            });
        }
    });
};
