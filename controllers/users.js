var fs = require('fs');


module.exports.findUsers = function (callback) {
    fs.readFile('./resources/data.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var users = JSON.parse(data).users;
        callback(null, users)
    });
}

// Find one specific user by id.
module.exports.findUser = function (userId, callback) {

    fs.readFile('./resources/data.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var users = JSON.parse(data).users;
        if (users[userId-1] != null) {
            var user = users[userId-1];
            var userTeam = JSON.parse(data).teams[user.teamId-1];
            var userTeamScheduleId = userTeam.scheduleId;
            var userSchedule = JSON.parse(data).schedules[userTeamScheduleId-1];
            user.teams = userTeam;
            user.schedule = userSchedule;
            callback(null, user)
        } else {
            callback("User not found", null)
        }
    });
}