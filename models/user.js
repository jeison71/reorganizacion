'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    email: String,
    password: String,
},{
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema);
//articles --> guarda docuemntos de este tipo y con esta estructura dentro de la coleccion
