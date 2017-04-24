/**
 * Dependencies
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * Schema
 */

const UserSchema = new Schema({
    password: {
        type : String,
        trim : true,
        select: false
    },
    email: {
        type : String,
        trim : true,
        unique: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    teamId: {
        type: Number,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt  : {
        type : Date,
        default : Date.now
    }
});

mongoose.model('User', UserSchema);

console.log("Loaded class")