module.exports.findTeams = function (callback) {

    // Instead of this, run through json document and return all teams
    var teams = {
        teamId: "1",
        numberOFStudent: 30
    }

    callback(null, teams)
}

// Find one specific user by id.
module.exports.findTeam = function (teamId, callback) {

    // Instead of this, run through json document and return team with specific id

    var team = {
        id: 1,
        name: "SI - System integration"
    }

    callback(null, team)

}