var fs = require('fs');
var nJwt = require('njwt');

const mongoose = require('mongoose');
const Team = mongoose.model('Team');


// ------- CREATE -----------------//

exports.create = function (token, teamData, callback) {

    // Verify token
    nJwt.verify(token,"Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$",function(err, verifiedJwt){
        if (err){

            console.log(err); // Token has expired, has been tampered with, etc
            callback(err, null)

        } else{

            console.log(verifiedJwt.body._doc); // Get a hold of the user from the decoded token
            var isAdmin = verifiedJwt.body._doc.isAdmin

            if (isAdmin) {

                var team = new Team({
                    teamName: teamData.teamName,

                    teamId: teamData.teamId,

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

module.exports.findTeams = function (callback) {

    fs.readFile('./resources/data.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var teams = JSON.parse(data).teams;
        callback(null, teams)
    });
}

// Find one specific user by id.
module.exports.findTeam = function (teamId, callback) {

    fs.readFile('./resources/data.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now

        var teams       = JSON.parse(data).teams;
        var users       = JSON.parse(data).users;
        var schedules   = JSON.parse(data).schedules;

        if (teams[teamId-1] != null && users[teamId-1] != null) {

            var userWithInTeam = users[teamId-1]
            var teamWithId = teams[teamId-1]
            var scheduleForTeam = schedules[teamId-1]

            teamWithId.users    = userWithInTeam
            teamWithId.schedule =  scheduleForTeam

            callback(null, teamWithId)


        } else {
            callback("Team not found", null)
        }
    });

}