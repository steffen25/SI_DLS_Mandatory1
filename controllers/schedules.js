var nJwt = require('njwt');
var Cookies = require('cookies')
const moment = require('moment')
require('../models/schedule');
require('../models/team');
const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');
const Team = mongoose.model('Team');
var weatherController = require('./weather')
var holidayController = require('./holidays')
var cancellationController = require('./cancellations')

module.exports.createSchedule = function (req, callback) {

    var token = req.headers['authorization'].replace(/^JWT\s/, '');

    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
        if (err) {

            console.log(err); // Token has expired, has been tampered with, etc
            return callback(err, null)

        }

        var isAdmin = verifiedJwt.body._doc.isAdmin

        if (!isAdmin) {
            return callback({msg: "Unauthorized", code: 401})

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
                return callback(err, null);
            } else {
                return callback(null, schedule)
            }
        });


    });
}

exports.findSchedule = function (id, callback) {

    Schedule.findById(id, function (err, schedule) {

        // If no schedule was found
        if (err) {
            callback(err, null);
        }

        // Found schedule!
        if (schedule != null) {
            callback(null, schedule)
        }
    });

};

exports.getSchedulesByWeekNumber = function (req, callback) {

    const weekNumber = req.params.weekNumber;
    const weeksInCurrentYear = weeksInYear((new Date()).getFullYear())
    if (weekNumber <= 0 || weekNumber > weeksInCurrentYear) {
        return callback({msg: "Invalid week number. Must be between 1 and "+weeksInCurrentYear+""}, null);
    }

    // Passed onto the req obj by the verifytoken middleware
    const userObj = req.user._doc;

    if (!userObj.hasOwnProperty('teamId')) {
        return callback({msg: "The user does not have a team."}, null);
    }

    var teamId = userObj.teamId

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

                // Found schedule!
                if (schedule != null) {
                    var week = weekNumber;

                    var weekObj = moment().startOf('isoWeek').week(week);
                    var weekStartDate = weekObj.isoWeekday(1).format();
                    var weekEndDate = weekObj.isoWeekday(5).format()
                    var scheduleDays = schedule.days;
                    var weekDates = enumerateDaysBetweenDates(weekStartDate, weekEndDate)


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
                            cancellationController.findCancellations(teamId, weekDates, function (err, cancellations) {
                                if (err) {
                                    console.log("Error could not fetch cancellations", err)
                                    return;
                                }
                                if (cancellations.length > 0) {
                                    for (i = 0; i < scheduleDays.length; i++) {
                                        var partsOfStr = scheduleDays[i].date.split(',')[0];
                                        var myDate = moment(partsOfStr, 'DD-MM-YYYY').add(1, 'hours').toDate();
                                        for (j = 0; j < cancellations.length; j++) {
                                            var cancellationDate = moment(cancellations[j].date)
                                            if (moment(cancellationDate, 'DD-MM-YYYY').isSame(moment(myDate, 'DD-MM-YYYY'))) {
                                                scheduleDays[i].cancellation = cancellations[j]
                                            }
                                        }
                                    }
                                }
                                callback(null, scheduleDays);
                            });
                        })
                        .catch(console.error);
                }
            });
        }
    });
};

exports.getScheduleByWeekday = function (req, callback) {

    token = null;

    if (req.headers['authorization'] !== undefined) {
        token = req.headers['authorization'].replace(/^JWT\s/, '');
    } else {
        token = new Cookies(req).get('access_token').replace(/^JWT\s/, '');
    }

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

                    // Found schedule!
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


                            cancellationController.findCancellations(teamId, [day.add(1, 'hours').toISOString()], function (err, cancellations) {
                                if (err) {
                                    console.log("Error could not fetch cancellations", err)
                                    return;
                                }

                                if (cancellations.length > 0) {
                                    scheduleDays[requestedDay - 1].cancellation = cancellations[0]
                                }

                            });



                            var getWeather = new Promise((resolve, reject) => {
                                weatherController.getCurrentWeather(function (err, weatherData) {
                                    if (err) {
                                        console.log("Error getting weather: " + err)
                                        reject(err);
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
                                })
                                .catch(console.error);
                        } else {

                            cancellationController.findCancellations(teamId, [day.add(1, 'hours').toISOString()], function (err, cancellations) {
                                if (err) {
                                    console.log("Error could not fetch cancellations", err)
                                    return;
                                }

                                if (cancellations.length > 0) {
                                    scheduleDays[requestedDay - 1].cancellation = cancellations[0]
                                }

                            });

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

function enumerateDaysBetweenDates(startDate, endDate) {
    startDate = moment(startDate);
    endDate = moment(endDate);

    var now = startDate, dates = [];

    while (now.isBefore(endDate) || now.isSame(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
    }
    return dates;
};

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}

function weeksInYear(year) {
    var d = new Date(year, 11, 31);
    var week = getWeekNumber(d)[1];
    return week == 1 ? getWeekNumber(d.setDate(24))[1] : week;
}