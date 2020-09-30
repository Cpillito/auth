const express = require('express'),
    apiRouter = express.Router(),
    jwt = require('jsonwebtoken')
    
// Load configuration
const conf = require('../config/db_conf');

//Load Model
const User = require('../models/user')


apiRouter

.post('/authenticate', function (req, res) {
    // find the user
    User.findOne({
        username: req.body.username
    }).select('name username password rango avatar').exec(function (err, user) {

        if (err) throw err;

        // no user with that username was found
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, conf.stJwt.secret, {
                    expiresIn: 86400//s //24 hours
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    u:JSON.stringify({username:user.username,rango:user.rango,img:user.avatar,id:user._id}),
                    token: token
                });
            }
        }
    });
})
.post('/sigIn', (req, res, next) => {
    let data = req.body.username
    console.log('pa registrar' ,data)
    var user = User({
        username: data.name,
        nnodo: data.nnodo,
        rango:data.rango,
        password: data.pass
    });
    user.save(err => {
        if (err) throw err;
        console.log('User save successful!!');
        res.status(201).json({
            success: true
        });
    });
})


module.exports = apiRouter