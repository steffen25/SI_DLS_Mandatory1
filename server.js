var app = require('./app');
const port  = process.env.PORT || 4000;

app.listen(port, function() {
  console.log("API is running on port " + port);
});