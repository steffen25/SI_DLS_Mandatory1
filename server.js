var express = require('express');
const fs       = require('fs');
const passport = require('passport');
const mongoose = require('mongoose');
app = express();
require('./config/passport')(passport)
require('./models/user');
require('./models/team');

app.get('/', function (req, res) {
    res.send('Hello World!')
})


//Set up default mongoose connection

var mongoDB = 'mongodb://localhost/scheduleapp';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var routes = require('./routes');

var weatherController = require('./controllers/weather')

// Delete this when it has been implemented 
weatherController.getCurrentWeather(function (err, weatherData) {

    if (err) {
        console.log("Error getting weather: " + err)
    } else {
        console.log("Current temp" + weatherData.currentTemp + "\nDescription: " + weatherData.description)
    }
})

app.listen(process.ent.PORT || 4000);
