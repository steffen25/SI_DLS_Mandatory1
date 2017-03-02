const express = require('express');
app = express();
const BodyParser = require('body-parser');

const users         = require('./controllers/users');
const teams         = require('./controllers/teams');
const schedules     =  require('./controllers/schedules');

app.use(BodyParser.urlencoded({
    extended: true
}));

app.use(BodyParser.json());

// _____________________________________________________________________________________________________________________


///////////////////////////////////////
//            Users
///////////////////////////////////////

app.get('/users', function (req, res) {
    //res.send('I return a list of users!')

    users.findUsers(function (err, usersArray) {

        if(err) return res.status(500).send({'msg':'No users found - internal error.'})

        res.send(usersArray)

    })
})

app.get('/users/:id', function (req, res) {

    var id = req.params.id;

    users.findUser(id, function (err, user) {
        if (err) {
            res.json({error: 'User not found'});
        }

        res.json(user)
    })
})

// _____________________________________________________________________________________________________________________

///////////////////////////////////////
//            Schedule
///////////////////////////////////////
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
    teams.findTeams(function (err, teamsArray) {

        if(err) return res.status(500).send({'msg':'No teams found - internal error.'})

        res.send(teamsArray)

    })
})

app.get('/teams/:id', function (req, res) {

    var id = req.params.id;

    teams.findTeam(id, function (err, team) {

        if (team != null) {
            res.status(200).send(team);
        }
        else console.log('No team');

    })
})

// _____________________________________________________________________________________________________________________
