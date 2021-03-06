var fs = require('fs');
var nJwt = require('njwt');

const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const Cancellation = mongoose.model('Cancellation');

const teams = require('./teams');

// ------- CREATE -----------------//

exports.create = function (token, cancellationData, callback) {

    // Verify token
    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
        if (err) {

            console.log(err); // Token has expired, has been tampered with, etc
            callback(err, null)

        } else {

            console.log(verifiedJwt.body._doc); // Get a hold of the user from the decoded token
            var isAdmin = verifiedJwt.body._doc.isAdmin

            if (isAdmin) {

                Team.findById(cancellationData.teamId, function (err, team) {

                    // If no team was found
                    if (err) {
                        callback(err, null);
                    }

                    // Found team!
                    if (team != null) {

                        var cancellation = new Cancellation({

                            date: cancellationData.date,

                            teamId: cancellationData.teamId,

                            author: verifiedJwt.body._doc.firstName + " " + verifiedJwt.body._doc.lastName + " (" + verifiedJwt.body._doc._id + ")"
                        });

                        cancellation.save(function (err) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, cancellation)
                            }
                        });
                    }
                });

            } else {
                callback(null, true) // TODO: Fix fejl ved ikke admin kald.
            }
        }
    });
};

// ---------- FIND CANCELLATIONs BY SPECIFIC TEAM ID AND DATES  -----------//

exports.findCancellations = function (teamId, dates, callback) {
    Cancellation.find( { teamId: { $eq: teamId }, date: {$in: dates} }, function (err, cancellations) {

        // If no cancellation was found
        if (err) {
            return callback(err, null);
        }

        // Found user!
        if (cancellations != null) {
            return callback(null, cancellations)
        }
    }).sort({date: 1});
};

// ---------- FIND ALL CANCELLATIONS  -----------//

exports.findAllCancellations = function (callback) {

    Cancellation.find({}, function (err, cancellations) {

        if (err) {
            callback(err, null)
        } else {
            var cancellationsMap = {};

            cancellations.forEach(function (cancellation) {
                cancellationsMap[cancellation._id] = cancellation;
            });

            callback(err, cancellationsMap)
        }
    });
};
