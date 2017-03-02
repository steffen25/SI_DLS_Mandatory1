var fs = require('fs');

module.exports.findSchedules = function (callback) {
    
    fs.readFile('./resources/data.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var schedule = JSON.parse(data).schedules;
        callback(null, schedule)
    });
}

// Find one specific user by id.
module.exports.findSchedule = function (scheduleId, callback) {

    fs.readFile('./resources/data.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var schedules = JSON.parse(data).schedules;
        if (schedules[scheduleId-1] != null) {
            callback(null, schedules[scheduleId-1])
        } else {
            callback("Schedule not found", null)
        }
    });

}