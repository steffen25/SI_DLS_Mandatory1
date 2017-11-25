if (process.env.NODE_ENV === "test") {
    require('dotenv').config({path: './config/.env.test'})
} else {
    if (!process.env.PORT) {
        // if not heroku
        require('dotenv').config({path: './config/.env.local'})
    }
}

var express = require('express');
const fs       = require('fs');
const BodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
require('./config/passport')(passport)
require('./models/user');
require('./models/team');
require('./models/cancellation');

app = express();

 // Twig setup
 app.set('view engine', 'twig');
 app.set('views', __dirname + '/views');
 // This section is optional and can be used to configure twig.
 app.set('twig options', {
     strict_variables: false
 });

 app.use(BodyParser.urlencoded({
     extended: true
 }));
 app.use(BodyParser.json());

//Set up default mongoose connection
var mongoDBURI = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME+'';
var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};

var db = mongoose.connect(mongoDBURI, options);


//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./routes')(app);

module.exports = app;