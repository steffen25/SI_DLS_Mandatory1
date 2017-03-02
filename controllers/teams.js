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
        var teams = JSON.parse(data).teams;
        if (teams[teamId-1] != null) {
            callback(null, teams[teamId-1])
        } else {
            callback("Team not found", null)
        }
    });

}