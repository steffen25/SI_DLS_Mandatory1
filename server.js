var express = require('express');
app = express();
const fs       = require('fs');

const mongoose = require('mongoose');
require('./models/user');


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


app.listen(4000);
