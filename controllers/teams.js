var fs = require('fs');

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