

module.exports.findUsers = function (callback) {

    // Instead of this, run through json document and return all users
    var users = {
        id: "1",
        me: 1
    }

    callback(null, users)
}

// Find one specific user by id.
module.exports.findUser = function (userId, callback) {

    // Instead of this, run through json document and return user with specific id

    var user = {
        id: 1,
        name: "Thomas"
    }

    callback(null, user)

}