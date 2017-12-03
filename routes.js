const Cookies = require('cookies')
const users = require('./controllers/users');
const teams = require('./controllers/teams');
const schedules = require('./controllers/schedules');
const holidays = require('./controllers/holidays');
const cancellations = require('./controllers/cancellations');
const verifyToken = require('./util/verifytoken');

module.exports = function (app) {

    app.get('/loaderio-fc5fada1a8168f47f1a27966c2635d90', function (req, res) {

        res.sendFile(__dirname + '/loader-io-verify.txt')

    })


    app.get('/users/migrate', function (req, res) {

        users.migrate(req, function (error, users) {
            if (error != null) {
                return res.status(400).json({ error: error })
            }

            return res.json({ success: true, users: users })
        })

    })

    ///////////////////////////////////////
    //            Users
    ///////////////////////////////////////

    // Create user
    app.post('/users', function (req, res) {

        var body = req.body;

        users.create(body, function (err, user) {
            if (err) {
                // If the email is already in use.
                if (err.code == 11000) {
                    return res.status(400).json({ success: false, error: { message: "This email address is already used", code: err.code } })
                }

                return res.status(400).json({ success: false, error: err })
            }

            return res.status(201).json({ success: true, data: { user: user } });
        })
    })

    app.get('/logout', function (req, res) {
        res.clearCookie("access_token");
        res.redirect('/login')
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/auth', function (req, res) {

        var email = req.body.email;
        var password = req.body.password;

        users.authenticate(email, password, function (err, user) {
            if (err) {
                res.status(401);
                res.send({
                    success: false,
                    error: err
                });
                return res;
            }

            new Cookies(req, res).set('access_token', user.token, {
                httpOnly: true
            });

            res.redirect('/dashboard')
        })
    })


    // Login
    app.post('/login', function (req, res) {

        var email = req.body.email;
        var password = req.body.password;

        users.authenticate(email, password, function (err, user) {
            if (err) {
                res.status(401);
                res.send({
                    success: false,
                    error: err
                });
                return res;
            }

            return res.status(200).json({ success: true, data: user });
        })
    })

    app.get('/dashboard', function (req, res) {
        var token = new Cookies(req, res).get('access_token')
        if (token === undefined) {
            res.status(401);
            res.send({
                success: false,
                error: "Unauthorized"
            });

            return res;
        }

        //token = token.replace(/^JWT\s/, '');

        users.dashboard(token, function (err, user) {
            if (err != null) {
                res.status(401);
                res.send({
                    success: false,
                    error: err
                });
            }
            res.render('dashboard', {
                user: user
            });
        })
    });

    // Edit user team
    app.put('/users/:id', function (req, res) {

        var userId = req.params.id;

        var teamId = req.body.teamId;

        teams.updateTeam(userId, teamId, function (err, updatedUser) {

            if (err) {
                res.status(500).json({ "Internal Server error updating user": err })
            } else {
                res.status(201).json({ "succes": true, data: updatedUser })
            }
        })

    })


    //  FIND ALL USERS

    app.get('/users', function (req, res) {
        users.findUsers(function (err, users) {

            if (err) {
                return res.status(404).json({ success: false, error: 'Error fetching users', message: err });
            }

            var data = {
                users: users
            };

            return res.status(200).json({ success: true, data: data })

        })
    })


    app.get('/users/:id', function (req, res) {
        users.findUser(req.params.id, function (err, user) {

            if (err) {
                return res.status(404).json({ success: false, error: err });
            }

            var data = {
                user: user
            };

            return res.status(200).json({ success: true, data: data })

        })
    })

    // _____________________________________________________________________________________________________________________

    ///////////////////////////////////////
    //            Schedule
    ///////////////////////////////////////
    app.post('/schedules', function (req, res) {

        schedules.createSchedule(req, function (err, schedule) {
            if (err != null) {
                return res.status(400).send({ errors: err })
            }
            return res.status(200).json(schedule)
        })

    })

    app.get('/schedules/week/:weekNumber?', verifyToken, function (req, res) {
        schedules.getSchedulesByWeekNumber(req, function (err, schedules) {
            if (err != null) {
                return res.status(400).send({success: false, error: err })
            }

            return res.status(200).json(schedules)
        })

    })

    app.get('/schedules/week/:weekNumber?/day/:day?', function (req, res) {


        schedules.getScheduleByWeekday(req, function (err, schedule) {
            if (err != null) {
                return res.status(400).send({ errors: err })
            }

            return res.status(200).json(schedule)
        })

    })

    app.get('/schedules/:id', function (req, res) {

        var id = req.params.id;

        schedules.findSchedule(id, function (err, schedule) {

            if (schedule != null) {
                res.status(200).send(schedule);
            }
        })
    })

    // _____________________________________________________________________________________________________________________

    ///////////////////////////////////////
    //            Teams
    ///////////////////////////////////////

    app.get('/teams', function (req, res) {
        teams.findTeams(function (err, teams) {

            if (err) {
                return res.status(404).json({success: false, error: 'Teams not found' });
            }

            res.status(200).json({success: true, data: {teams: teams} })

        })
    })

    app.get('/teams/:id', function (req, res) {

        var id = req.params.id;

        teams.findTeam(id, function (err, team) {

            if (err) {
                return res.status(404).json({ error: 'Team not found' });
            }

            res.status(200).json(team)

        })
    })

    // Create team
    app.post('/teams', verifyToken, function (req, res) {
        teams.create(req, function (err, team) {
            if (err) {
                // No admin
                if (err.code === 10001111) {
                    return res.status(401).json({ success: false, error: err });
                }

                return res.status(400).json({ success: false, error: err });
            } 
            
            return res.status(201).json({ success: true, data: team });
        })

    })

    // Edit team schedule
    app.put('/teams/:id', function (req, res) {

        var teamId = req.params.id;

        var scheduleId = req.body.scheduleId;

        teams.updateTeamSchedule(teamId, scheduleId, function (err, updatedTeam) {

            if (err) {
                res.status(500).json({ "Internal Server error updating team": err })
            } else {
                res.status(201).json({ "succes": true, data: updatedTeam })
            }
        })

    })

    // Delete team
    app.delete('/teams/:id', function (req, res) {

        var teamId = req.params.id;


        teams.deleteTeam(teamId, function (err, success) {

            if (err) {
                return res.status(500).json({ "Internal Server error deleting team": err })
            } else {
                return res.status(200).json(success)
            }
        })
    })
    // _____________________________________________________________________________________________________________________

    ///////////////////////////////////////
    //            Holidays
    ///////////////////////////////////////

    app.get('/holidays', function (req, res) {
        holidays.fetchHolidays(function (err, holidays) {

            if (err) {
                return res.status(404).json({ success: false, error: err });
            }

            res.status(200).json({ success: true, data: { holidays: holidays } })

        })
    })

    // _____________________________________________________________________________________________________________________



    ///////////////////////////////////////
    //            Cancellation
    ///////////////////////////////////////

    // Create cancellation
    app.post('/cancellations', function (req, res) {

        var token = req.headers['authorization'];
        var cancellationData = req.body


        cancellations.create(token, cancellationData, function (err, cancellation) {

            if (err) {
                // Not authorized / error creating cancellation
                return res.status(401).json({ "Authorized": false });
            } else {
                return res.status(201).json({ "Created cancellation": true, "Cancellation": cancellation });
            }

        })
    })

    //  FIND ALL CANCELLATIONS
    app.get('/cancellations', function (req, res) {
        cancellations.findAllCancellations(function (err, cancellations) {

            if (err) {
                return res.status(404).json({ error: 'No cancellations found' });
            }

            res.status(200).json(cancellations)

        })
    })
}