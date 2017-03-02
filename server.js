var express = require('express');
app = express();

var routes = require('./routes');

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(4000);
