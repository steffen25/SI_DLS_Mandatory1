var fs = require('fs');

const mongoose = require('mongoose');
const User = mongoose.model('User');


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

/**
 * Create a user
 */
exports.create = function(req, res) {

    var user = new User({
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phone: req.body.phone,
        teamId: req.body.teamId,
        isAdmin: req.body.isAdmin,
    });

    console.log(user);
    user.save(function (err) {
        if (err) {
            console.log(err);
        }

        // TODO : Fix ordentlig måde at håndtere fx fejl ved oprettelse
        // saved!
        // res.json({
        //     success: true,
        //     data: user
        // });
    });
};