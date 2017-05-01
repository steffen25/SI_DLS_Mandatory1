const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * Schema
 */

const HolidaySchema = new Schema({
    date: {
        type : Date,
    },
    dayOfWeek: {
        type : Number
    },
    localName: {
        type : String
    },
    englishName: {
        type: String
    }
});

mongoose.model('Holiday', HolidaySchema);