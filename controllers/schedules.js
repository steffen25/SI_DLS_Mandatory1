var nJwt = require('njwt');
const moment = require('moment')
require('../models/schedule');
require('../models/team');
const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');
const Team = mongoose.model('Team');
var weatherController = require('./weather')
var holidayController = require('./holidays')

module.exports.createSchedule = function (req, callback) {

    var token = req.headers['authorization'].replace(/^JWT\s/, '');

    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
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
        var schedule = new Schedule({ days: [{ monday }, { tuesday }, { wednesday }, { thursday }, { friday }] })

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

exports.getSchedulesByWeekNumber = function (req, callback) {

    var token = req.headers['authorization'].replace(/^JWT\s/, '');

    console.log(req.params.weekNumber)

    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
        if (err) {

            console.log(err); // Token has expired, has been tampered with, etc
            return callback(err, null)

        }

        var teamId = verifiedJwt.body._doc.teamId
        console.log(teamId)
        Team.findById(teamId, function (err, team) {

            // If no team was found
            if (err != null) {
                return callback(err, null);
            }

            if (team == null) {
                return callback({ msg: "User doesnt have a team" }, null)
            }

            // Found team!
            if (team != null) {
                Schedule.findById(team.scheduleId, function (err, schedule) {
                    // If no schedule was found
                    if (err != null) {
                        return callback(err, null);
                    }

                    if (schedule == null) {
                        return callback({ msg: "Team doesnt have a schedule id" }, null)
                    }

                    // Found team!
                    if (schedule != null) {
                        var week = moment().format('W');
                        if (req.params.weekNumber) {
                            week = req.params.weekNumber;
                        }

                        var weekObj = moment().startOf('isoWeek').week(week);
                        var scheduleDays = schedule.days;

                        var promises = scheduleDays.map(function (item, index) {
                            return new Promise(function (resolve, reject) {
                                var day = weekObj.isoWeekday(index + 1)
                                const dayFormatted = day.format("DD-MM-YYYY, dddd")

                                item.date = dayFormatted;

                                // Check if a given day is a holiday
                                holidayController.findHoliday(day.format('YYYY-MM-DD'), function (err, holiday) {
                                    if (holiday !== null) {
                                        item.holiday = holiday
                                        resolve();
                                    }
                                    resolve();
                                })
                            });
                        });

                        Promise.all(promises)
                            .then(function () {
                                callback(null, scheduleDays);
                            })
                            .catch(console.error);

                    }
                });
            }
        });
    });
};

exports.getScheduleByWeekday = function (req, callback) {

    var token = req.headers['authorization'].replace(/^JWT\s/, '');


    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
        if (err) {

            console.log(err); // Token has expired, has been tampered with, etc
            return callback(err, null)

        }

        var teamId = verifiedJwt.body._doc.teamId
        console.log(teamId)
        Team.findById(teamId, function (err, team) {

            // If no team was found
            if (err != null) {
                return callback(err, null);
            }

            if (team == null) {
                return callback({ msg: "User doesnt have a team" }, null)
            }

            // Found team!
            if (team != null) {
                Schedule.findById(team.scheduleId, function (err, schedule) {
                    // If no schedule was found
                    if (err != null) {
                        return callback(err, null);
                    }

                    if (schedule == null) {
                        return callback({ msg: "Team doesnt have a schedule id" }, null)
                    }

                    // Found team!
                    if (schedule != null) {
                        var week = moment().format('W');
                        if (req.params.weekNumber) {
                            week = req.params.weekNumber;
                        }

                        var weekObj = moment().startOf('isoWeek').week(week);
                        var scheduleDays = schedule.days;
                        var requestedDay = 1;
                        if (req.params.day) {
                            requestedDay = req.params.day;
                        }

                        if (scheduleDays[requestedDay - 1] === undefined) {
                            return callback({ msg: requestedDay + " does not exist" })
                        }

                        const today = moment();
                        var day = weekObj.weekday(requestedDay)
                        const dayFormatted = day.format("DD-MM-YYYY, dddd")
                        scheduleDays[requestedDay - 1].date = dayFormatted;


                        if (today.isSame(weekObj.weekday(requestedDay), 'day')) {
                            var getWeather = new Promise((resolve, reject) => {
                                weatherController.getCurrentWeather(function (err, weatherData) {
                                    if (err) {
                                        console.log("Error getting weather: " + err)
                                    } else {
                                        const currentTemp = weatherData.currentTemp;
                                        const description = weatherData.description;

                                        scheduleDays[requestedDay - 1].weather = {
                                            currentTemp: currentTemp,
                                            description: description
                                        }

                                        resolve();

                                    }
                                })
                            })

                            getWeather
                                .then(function () {
                                    return callback(null, scheduleDays[requestedDay - 1])
                                })
                                .catch(console.error);
                        } else {

                            var checkForHoliday = new Promise((resolve, reject) => {
                                holidayController.findHoliday(day.format('YYYY-MM-DD'), function (err, holiday) {
                                    if (holiday != null) {
                                        scheduleDays[requestedDay - 1].holiday = holiday
                                        resolve();
                                    }
                                    resolve();
                                })
                            })

                            checkForHoliday
                                .then(function () {
                                    return callback(null, scheduleDays[requestedDay - 1])
                                })
                                .catch(console.error);
                        }
                    }
                });
            }
        });
    });
};