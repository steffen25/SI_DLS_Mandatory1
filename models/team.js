/**
 * Dependencies
 */
var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * Schema
 */

const TeamSchema = new Schema({
    teamName: {
        type : String,
            trim : true,
            unique: true,
    },
    teamId: {
        type : Schema.ObjectId,
    },
    scheduleId: {
        type : Schema.ObjectId,
    },
    classRoom: {
        type : String,
            trim : true,
    }
});

mongoose.model('Team', TeamSchema);

console.log("Loaded team class")