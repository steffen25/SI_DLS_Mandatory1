var nJwt = require('njwt');
require('../models/schedule');
const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');

module.exports.createSchedule = function(req, callback) {

    var token = req.headers['authorization'].replace(/^JWT\s/, '');

    nJwt.verify(token,"Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$",function(err, verifiedJwt) {
        if (err) {

            console.log(err); // Token has expired, has been tampered with, etc
            return callback(err, null)

        }

        var isAdmin = verifiedJwt.body._doc.isAdmin

        if (!isAdmin) {
            var err = {
                error: {
                    msg: "Unauthorized"
                }
            }
            return callback(err)

        }

        // create schedule
        // validate days array contains
        var errors = [];
        var monday = req.body.monday;
        var tuesday = req.body.tuesday;
        var wednesday = req.body.wednesday;
        var thursday = req.body.thursday;
        var friday = req.body.friday;

        if (typeof monday === 'undefined' || monday == '') {
            errors.push({
                msg: "Monday is required"
            })
        }
        
        if (typeof tuesday === 'undefined' || tuesday == '') {
            errors.push({
                msg: "Tuesday is required"
            })
        }
        
        if (typeof wednesday === 'undefined' || wednesday == '') {
            errors.push({
                msg: "Wednesday is required"
            })
        }
        
        if (typeof thursday === 'undefined' || thursday == '') {
            errors.push({
                msg: "Thursday is required"
            })
        }
        
        if (typeof friday === 'undefined' || friday == '') {
            errors.push({
                msg: "Friday is required"
            })
        }

        if (errors.length !== 0) {
            return callback(errors, null)
        }

        // create and save schedule
        var schedule = new Schedule({days: [{monday}, {tuesday}, {wednesday}, {thursday}, {friday}]})

        schedule.save(function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, schedule)
                    }
                });


    });
}

exports.findSchedule = function (id, callback) {

    Schedule.findById(id, function (err, schedule) {

        // If no team was found
        if (err) {
            callback(err, null);
        }

        // Found team!
        if (schedule != null) {
            callback(null, schedule)
        }
    });

};