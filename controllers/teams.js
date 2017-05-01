var fs = require('fs');
var nJwt = require('njwt');

const mongoose = require('mongoose');
const Team = mongoose.model('Team');


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
