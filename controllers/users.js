const mongoose = require('mongoose');
var fs = require('fs');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const User = mongoose.model('User');
var jwt = require('jsonwebtoken');


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
exports.create = function(body, callback) {

    var user = new User({
        password: body.password,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phone: body.phone,
        teamId: body.teamId,
        isAdmin: body.isAdmin,
    });

    user.save(function (err) {
        if (err) {
            if(err.code == 11000) {
                console.log("110000")
                callback({error: "bla"}, null)
            }
            callback(err, null);
        } else {
            user.password = undefined;
            callback(null, user)
        }

        // TODO : Fix ordentlig måde at håndtere fx fejl ved oprettelse
        // saved!
        // res.json({
        //     success: true,
        //     data: user
        // });
    });
};

exports.authenticate = function (email, password, callback) {
    User.findOne({ email: email } ).select("+password").exec(function(err, user) {
        if (err) {
            return callback(err, null);
        }

        // Email not found - for security reason response is same as when password is not right
        if (!user) {
            return callback({error: "User not found"}, null);
        }

        bcrypt.compare(password, user.password, function(err, matches) {
            if (!err && matches) {
                console.log('The password matches!');
                // if user is found and password is right create a token
                user.password = undefined;
                var token = jwt.sign(user, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$");

                // return the information including token as JSON
                var data = {
                    token: 'JWT ' + token,
                    user: user
                }
                return callback(null, data);
            }
            else
                return callback({error: "The email or password does not match"}, null)
        });
    });
};