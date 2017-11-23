require('dotenv').config();
var express = require('express');
const fs       = require('fs');
const passport = require('passport');
const mongoose = require('mongoose');
app = express();
require('./config/passport')(passport)
require('./models/user');
require('./models/team');
require('./models/cancellation');

app.get('/', function (req, res) {
    res.send('Hello World!')
})


//Set up default mongoose connection

var mongoDB = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME+'';
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var routes = require('./routes');

app.listen(process.env.PORT || 4000);

module.exports = app; // for testing
