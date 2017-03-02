const express = require('express');
app = express();
const BodyParser = require('body-parser');

app.use(BodyParser.urlencoded({
    extended: true
}));

app.use(BodyParser.json());

///////////////////////////////////////
//            Users
///////////////////////////////////////

app.get('/users', function (req, res) {
    res.send('I return a list of users!')
})

app.get('/users/:id', function (req, res) {

    var id = req.params.id;

    res.send(id)
})

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