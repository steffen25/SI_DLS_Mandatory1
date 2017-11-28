var tcpPortUsed = require('tcp-port-used');

var portInUse = function (port, callback) {

    tcpPortUsed.check(port, '127.0.0.1')
        .then(function (inUse) {
            callback(inUse)
        }, function (err) {
            console.error('Error on check:', err.message);
        });

};

module.exports = portInUse