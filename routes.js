const express = require('express');
app = express();
const BodyParser = require('body-parser');

const users         = require('./controllers/users');
const teams         = require('./controllers/teams');
const schedules     =  require('./controllers/schedules');
const holidays     =  require('./controllers/holidays');

app.use(BodyParser.urlencoded({
    extended: true
}));

app.use(BodyParser.json());

// _____________________________________________________________________________________________________________________


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
                res.status(400).json({emailTaken: true})
            }

            res.status(500)

            // Successfull create.
        } else {
            res.status(201).json({user: user, success: true});
        }
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

        return res.status(201).json({success: true, data: user});
    })
})

// Edit user team
app.put('/users/:id', function (req, res) {

    var userId = req.params.id;

    var teamId = req.body.teamId;

    users.updateTeam(userId, teamId, function (err, updatedUser) {

        if (err) {
            res.status(500).json({"Internal Server error updating user": err})
        } else {
            res.status(201).json({"succes" : true, data: updatedUser})
        }
    })

})
// _____________________________________________________________________________________________________________________

///////////////////////////////////////
//            Schedule
///////////////////////////////////////
app.post('/schedules', function (req, res) {

    schedules.createSchedule(req, function (err, schedule) {
        if(err) return res.status(500).send({errors: err})
    })

})

app.get('/schedules', function (req, res) {

    schedules.findSchedules(function (err, schedulesArray) {

        if(err) return res.status(500).send({'msg':'No users found - internal error.'})

        res.send(schedulesArray)
    })

})

app.get('/schedules/:id', function (req, res) {

    var id = req.params.id;

    schedules.findSchedule(id, function (err, schedule) {

        if (schedule != null) {
            res.status(200).send(schedule);
        }
        else console.log('No schedule');
    })
})

// _____________________________________________________________________________________________________________________

///////////////////////////////////////
//            Teams
///////////////////////////////////////

app.get('/teams', function (req, res) {
    teams.findTeams(function (err, teams) {

        if (err) {
            return res.status(404).json({error: 'Teams not found'});
        }

        res.status(200).json(teams)

    })
})

app.get('/teams/:id', function (req, res) {

    var id = req.params.id;

    teams.findTeam(id, function (err, team) {

        if (err) {
            return res.status(404).json({error: 'Team not found'});
        }

        res.status(200).json(team)

    })
})

// Create team
app.post('/teams/', function (req, res) {

    var token = req.headers['authorization'].replace(/^JWT\s/, '');
    var teamData = req.body

    teams.create(token, teamData, function (err, team) {

        if (err) {
            console.log(err);

            // Not authorized / error creating team / Duplicate teamname // TODO: Send specific fejl alt afhængigt af hvad går galt.
            return res.status(401).json({"Authorized": false});
        } else {

            // Succesfully created team
            return res.status(201).json({"Created team" : true, "Team":team});
        }
    })

})

// Edit team schedule
app.put('/teams/:id', function (req, res) {

    var teamId = req.params.id;

    var scheduleId = req.body.scheduleId;

    teams.updateTeam(teamId, scheduleId, function (err, updatedTeam) {

        if (err) {
            res.status(500).json({"Internal Server error updating team": err})
        } else {
            res.status(201).json({"succes" : true, data: updatedTeam})
        }
    })

})



// _____________________________________________________________________________________________________________________





///////////////////////////////////////
//            Holidays
///////////////////////////////////////

app.get('/holidays', function (req, res) {
    holidays.getHolidays(function (err, holidays) {

        if (err) {
            return res.status(404).json({error: 'Error occured while fetching holidays'});
        }

        res.status(200).json(holidays)

    })
})

// _____________________________________________________________________________________________________________________
