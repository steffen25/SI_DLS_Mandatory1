const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * Schema
 */

const ScheduleSchema = new Schema({
    days: {
        type : Array
    }
});

mongoose.model('Schedule', ScheduleSchema);