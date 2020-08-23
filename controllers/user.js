'use strict'

var validator = require('validator');
var User = require('../models/user');
var fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');

//app.use(express.json())

var userController = {

    test:  (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de Usuarios'
        });
    },

    signup:  async (req, res) => {
        const { email, password} = req.body;
        const newUser = new User({email, password});
        await newUser.save();

        const token = jwt.sign({_id: newUser._id}, 'secretkey');
        res.status(200).send({token});
    },

    signin: async (req, res) => {
        const { email, password} = req.body;
        const user =  await User.findOne({email});
        if(!user) return res.status(401).send('Datos no Validos');
        if(user.password !== password) return res.status(401).send('Datos no Validos');
        
        const token = jwt.sign({_id: user._id}, 'secretkey');
        return res.status(200).json(({token}));

    },
}
module.exports = userController;

function verifyToken(req, res, next){
    console.log(req.headers.authorization)
}