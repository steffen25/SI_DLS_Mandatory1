const mongoose = require('mongoose');
var fs = require('fs');
var nJwt = require('njwt');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const User = mongoose.model('User');
var jwt = require('jsonwebtoken');
const teams = require('./teams');
var request = require('request');

/**
 * Create a user
 */
exports.create = function (body, callback) {

    if (!body.email) {
        return callback({ msg: "You must provide a email address" }, null)
    } else {
        // validate email
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        validEmail = re.test(body.email);
        if (!validEmail) {
            return callback({ msg: "You must provide a valid email address" }, null)
        }
    }
   
    if (!body.password) {
        return callback({ msg: "You must provide a password" }, null)
    } else {
        if (body.password.length < 6) {
            return callback({ msg: "You must provide a password with a minimum of 6 characters" }, null)
        }
    }

    var user = new User({
        password: body.password,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phone: body.phone,
        isAdmin: body.isAdmin,
        teamId: body.teamId
    });

    if (body.teamId !== null) {
        console.log("hej")
        // see if the team exists
        teams.findTeam(body.teamId, function (err, team) {
            if (err) {
                return callback({ msg: "Could not fetch team." }, null)
            }
            if (!team) {
                return callback({ msg: "The team does not exists" }, null)
            }

            user.teamId = team._id
            user.save(function (err) {
                if (err) {
                    if (err.code == 11000) {
                        return callback({ msg: "email taken", code: 11000 }, null)
                    }
                    return callback(err, null);
                } else {
                    user.password = undefined;
                    return callback(null, user)
                }
            });
        });
    } else {
        user.save(function (err) {
            if (err) {
                if (err.code == 11000) {
                    return callback({ msg: "email taken", code: 11000 }, null)
                }
                return callback(err, null);
            } else {
                user.password = undefined;
                return callback(null, user)
            }
        });
    }
};

exports.authenticate = function (email, password, callback) {
    User.findOne({ email: email }).select("+password").exec(function (err, user) {
        if (err) {
            return callback(err, null);
        }

        // Email not found - for security reason response is same as when password is not right
        if (!user) {
            return callback({ message: "User not found" }, null);
        }

        if (!password) {
            return callback({ message: "Missing password" }, null);
        }

        bcrypt.compare(password, user.password, function (err, matches) {
            if (!err && matches) {
                // if user is found and password is right create a token
                user.password = undefined;
                var token = jwt.sign(user, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$");

                // return the information including token as JSON
                var data = {
                    token: token,
                    user: user
                }
                return callback(null, data);
            }
            else
                return callback({ message: "The email or password does not match" }, null)
        });
    });
};

// ---------- GET USER BY SPECIFIC ID  -----------//

exports.findUser = function (id, callback) {

    User.findById(id, function (err, user) {

        // If no user was found
        if (err) {
            callback(err, null);
        }

        // Found user!
        if (user != null) {
            callback(null, user)
        }
    });

};

// ---------- GET ALL USERS -----------//

exports.findUsers = function (callback) {

    User.find({}, function (err, users) {

        if (err) {
            return callback(err, null)
        }

        callback(err, users)
    });
};


exports.dashboard = function (token, callback) {

    nJwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function (err, verifiedJwt) {
        if (err) {
            return callback(err, null)
        }

        // we got a valid JWT
        return callback(null, verifiedJwt.body._doc);
    });
};

exports.migrate = function (req, callback) {
    var url = req.header("url");

    var firstName = req.header("firstName");
    var lastName = req.header("lastName");

    var email = req.header("email");

    if (url == undefined) {
        return callback({ error: "undefined URL" }, null)
    } else {
        request.get(url, function (error, response, body) {

            if (error) {
                return callback({ error: error }, null)
            } else {

                const users = JSON.parse(body).data
                var useFirstName = false;
                var useEmail = false;

                if (firstName !== undefined) {
                    useFirstName = true;
                }

                if (email !== undefined) {
                    useEmail = true;
                }



                var usersArr = [];
                var promises = users.map(function (user) {
                    return new Promise(function (resolve, reject) {

                        var userObj = new User();

                        if (user[firstName] !== undefined && useFirstName) {
                            userObj.firstName = user[firstName];
                        }

                        if (user[email] !== undefined && useEmail) {
                            userObj.email = user[email];
                        }

                        userObj.lastName = '';
                        userObj.address = '';
                        userObj.phone = '';
                        userObj.teamId = null;
                        userObj.isAdmin = false;
                        userObj.password = "123456";

                        userObj.save(function (err) {
                            if (err) {
                                reject(err)
                            } else {
                                userObj.password = undefined;
                                usersArr.push(userObj)
                                resolve();
                            }
                        });


                    });
                });

                Promise.all(promises)
                    .then(function () {
                        return callback(null, usersArr)
                    })
                    .catch(function (e) {
                        console.log(e);
                    });

            }

        })
    }
}