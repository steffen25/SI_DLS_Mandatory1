module.exports.findSchedules = function (callback) {

    // Instead of this, run through json document and return all schedules
    var schedules = {
        monday: "SI",
        tuesday: "DLS",
        wednesday: "Android",
        thursday: "Android",
        friday: "Fridag"
    }

    callback(null, schedules)
}

// Find one specific user by id.
module.exports.findSchedule = function (scheduleId, callback) {

    // Instead of this, run through json document and return schedule with specific id

    var schedule = {
        id: 1,
        name: "Dette er et skema"
    }

    callback(null, schedule)

}