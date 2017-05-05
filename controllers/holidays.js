var soap = require('soap');
require('../models/holiday');
const mongoose = require('mongoose');
const Holiday = mongoose.model('Holiday');
const moment = require('moment')


module.exports.fetchHolidays = function (callback) {

var url = "http://www.kayaposoft.com/enrico/ws/v1.0/index.php?wsdl";

var args = {
    "tns:year":"2017",
    "tns:country":"dnk",
    "tns:region":"Denmark"
};

soap.createClient(url, function(err, client) {

    client.getPublicHolidaysForYear(args, function(err, result) {
            if (err) throw err;

            // remove all holidays
            Holiday.remove({}, function(err) { 
                if (err) {
                    console.log('Could not remove holidays') 
                }
                console.log('Holidays removed') 
            });

            var holidays = result.return.publicHolidays;
            var holidaysArr = [];
            
            var promises = holidays.map(function(item) {
                    return new Promise(function(resolve, reject) {
                        var dateStr = ''+item.date.day + '-' + item.date.month + '-' + item.date.year+'';

                        var date = moment(dateStr, 'D-M-YYYY').format("YYYY-MM-DD");

                        var holiday = new Holiday({
                            date: date,
                            dayOfWeek: item.date.dayOfWeek,
                            localName: item.localName,
                            englishName: item.englishName
                        })

                        holiday.save(function (err) {
                            if (err) {
                                reject(err)
                            } else {
                                holidaysArr.push(holiday)
                                resolve();
                            }
                        });

                    });
                });

                Promise.all(promises)
                .then(function() {
                     callback(null, holidaysArr); 
                    })
                .catch(console.error);

        
    });
});
}

exports.findHoliday = function (date, callback) {

    Holiday.findOne({date: date}, function (err, holiday) {

        // If no team was found
        if (err) {
            callback(err, null);
        }

        // Found team!
        if (holiday !== null) {
            callback(null, holiday)
        } else {
            callback({msg: "No holiday found for " + date}, null)
        }
    });
};