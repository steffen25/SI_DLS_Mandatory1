/**
 * Dependencies
 */
var bcrypt = require('bcrypt');
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
        type: Schema.ObjectId,
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


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

mongoose.model('User', UserSchema);