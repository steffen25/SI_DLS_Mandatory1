const express = require('express');
app = express();
const BodyParser = require('body-parser');

const users = require('./controllers/users');

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

        if (user != null) {
            res.status(200).send(user);
        }
        else console.log('No user');

    })
})

// _____________________________________________________________________________________________________________________

///////////////////////////////////////
//            Schedule
///////////////////////////////////////
app.get('/schedules', function (req, res) {
    res.send('I return a list of schedules!')
})

app.get('/schedules/:id', function (req, res) {

    var id = req.params.id;

    res.send({
        id: id
    })
})

// _____________________________________________________________________________________________________________________

///////////////////////////////////////
//            Teams
///////////////////////////////////////

app.get('/teams', function (req, res) {
    res.send('I return a list of teams')
})

app.get('/teams/:id', function (req, res) {

    var id = req.params.id;

    res.send(id)
})

// _____________________________________________________________________________________________________________________
