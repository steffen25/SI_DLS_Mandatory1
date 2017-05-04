var request = require('request');

exports.getCurrentWeather = function (callback) {
    
    request.get('http://api.openweathermap.org/data/2.5/weather?q=copenhagen,dk&units=metric&APPID=391e3dce20743c32d69695a24426c252', function (error, response, body) {

        if (error) {
            console.log('error:', error); // Print the error if one occurred
            callback({Error:"Error getting current weather"}, null)
        } else {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            if (response.statusCode == 200) {

                var obj = JSON.parse(body);

                var weatherData = {
                    currentTemp: obj.main.temp,
                    description: obj.weather[0].description
                }

                callback(null, weatherData)

            }
        }
    });
};