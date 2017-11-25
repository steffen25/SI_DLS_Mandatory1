var fs = require('fs');
var nJwt = require('njwt');

const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const User = mongoose.model('User');

const schedules = require('./schedules');
const users = require('./users');


// ------- CREATE -----------------//

exports.create = function (token, teamData, callback) {

    // Verify token
    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
        if (err) {

            console.log(err); // Token has expired, has been tampered with, etc
            callback(err, null)

        } else {

            console.log(verifiedJwt.body._doc); // Get a hold of the user from the decoded token
            var isAdmin = verifiedJwt.body._doc.isAdmin

            if (isAdmin) {

                var team = new Team({
                    teamName: teamData.teamName,

                    scheduleId: teamData.scheduleId,

                    classRoom: teamData.classRoom
                });

                team.save(function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, team)
                    }
                });

            } else {
                callback(null, true) // TODO: Fix fejl ved ikke admin kald.
            }
        }
    });

};

exports.updateTeam = function (teamId, scheduleId, callback) {

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
            callback(err, null);
        }

        // Found team!
        if (team != null) {
            callback(null, team)
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
                            Team.remove({_id: teamId}, function (err) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    callback(null, {deletedTeam: true})
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
