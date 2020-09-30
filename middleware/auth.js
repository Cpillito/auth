'use strict'
const jwt = require('jsonwebtoken'),
    // Load configuration
    conf = require('../config/db_conf');



// route middleware to verify a token
module.exports = (req, res, next) => {
    console.log('-----------------------------------------------------------------------')
    console.log('|-------------------COMPROBACION DE LOGEO CON EL MIDDLEWARE-----------|')
    console.log('-----------------------------------------------------------------------')
    // check url parameters or var for token
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'];
    // decode token
    if (token) {
        console.log('|-------------------TOKEN ENCONTRADO-----------|')

        // verifies secret and checks exp
        jwt.verify(token, conf.stJwt.secret, function (err, decoded) {
            if (err) {
                console.log('|-------------------ERROR EN EL TOKEN-----------|',err)
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                console.log('|-------------------TOKEN VALIDO-----------|')
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next(); // make sure we go to the next routes and don't stop here
            }
        });

    } else {

        // if there is no token
        // return an HTTP response of 403 (access forbidden) and an error message
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}