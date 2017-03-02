var fs = require('fs');


module.exports.findUsers = function (callback) {
    fs.readFile('./resources/users.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var users = JSON.parse(data);
        callback(null, users)
    });
}

// Find one specific user by id.
module.exports.findUser = function (userId, callback) {

    fs.readFile('./resources/users.json', 'utf8', function (err, data) {
        console.log(userId);
        if (err) throw err; // we'll not consider error handling for now
        var users = JSON.parse(data).users;
        if (users[userId-1] != null) {
            callback(null, users[userId-1])
        }
        callback("User not found", null)
    });
    // Instead of this, run through json document and return user with specific i
}