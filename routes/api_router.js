const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const conf = require('../config/db_conf');

const bcrypt = require('bcrypt-nodejs')
//Load Model
const User = require('../models/user')

router
    .get('/users', (req, res) => {
        User.find({}, (err, user) =>{
            if (err) throw err;
            res.send(user)
        });
    })
    .post('/update_user', (req, res) => {
        let user = req.body.user
        console.log('Actualizar::', user)
        // generate the hash

        bcrypt.hash(user.password, null, null, function (err, hash) {
            if (err) return next(err);
            // change the password to the hashed version
            user.password = hash;
            User.update({
                _id: user.id
            }, user, err => {
                if (err) throw err
                console.log('Usuario Actualizado')
                res.send({
                    success: true
                })
            })
        });
    })
    // delete
    .post('/delete_user', (req, res) => {
        const id = req.body.id
        console.log('Eliminar usuario con id ',id)
        User.deleteOne({
            _id: id
        }, err => {
            if (err) throw err
            console.log('Usuario Eliminado')
            res.send({
                success: true
            })
        })
        console.log('eliminar::', id)
    })
module.exports = router;