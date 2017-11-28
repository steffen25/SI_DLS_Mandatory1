const fs = require('fs');
var jwt = require('jsonwebtoken');
const Cookies = require('cookies')

function verifyToken(req, res, next) {
    // verify a token asymmetric
    if (req.headers['authorization'] === undefined || !req.headers['authorization'].length) {
        return res.status(401).json({success: false, error: "Missing token"})
    }


    if (req.headers['authorization'] !== undefined) {
        token = req.headers['authorization'];
    } else {
        token = new Cookies(req).get('access_token');
    }
    jwt.verify(token, "Qm/S&U.&Tku'`QQ(BQn8ERmS32na.ad&N7,nBX&[p@vX3XF>B@d>/EQ3a2.Ty.X$", function(err, payload) {
        if (err) {
            return res.status(401).json({error: "Invalid token"})
        }
        req.user = payload;
        next();
      });
}

module.exports = verifyToken