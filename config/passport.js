const mongoose  = require('mongoose');
var _           = require("lodash");
var jwt         = require('jsonwebtoken');

var passport    = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt  = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
require('../models/user');
const User      = mongoose.model('User');

module.exports = function (passport) {
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$";

    passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        console.log('payload received', jwt_payload);
        // usually this would be a database call:
        User.findOne({_id: jwt_payload._id}, function(err, user) {
            if (err) {
                return next(err, false);
            }

            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    }));
}