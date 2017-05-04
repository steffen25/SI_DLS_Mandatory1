var fs = require('fs');
var nJwt = require('njwt');

const mongoose = require('mongoose');
const Team = mongoose.model('Team');

const schedules         = require('./schedules');



// ------- CREATE -----------------//

exports.create = function (token, teamData, callback) {

    // Verify token
    nJwt.verify(token,"Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$",function(err, verifiedJwt) {
        if (err){

            console.log(err); // Token has expired, has been tampered with, etc
            callback(err, null)

        } else{

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

exports.updateTeam = function(teamId, scheduleId, callback) {

    Team.findById(teamId, function (err, team) {
        
        // If no user was found
        if (err) {
            callback(err, null);
        }

        // Found user!
        if (team != null) {

            schedules.findSchedule(scheduleId, function (err, schedule) {

                if (schedule != null) {

                    team.scheduleId = scheduleId

                    team.save(function (err, updatedTeam) {

                        if(err) {
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