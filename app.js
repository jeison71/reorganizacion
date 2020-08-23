'use strict';

//Cargar modulos de node para crea el servidor
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const { restart } = require('nodemon');

//Ejecutar express para http
var app = express();

//Cargar ficheros rutas
var article_routes = require('./routes/article');

//Middlewares  se ejucata nates de cargar un aruta o un url.  
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Activar el CORS, permitir peticiones ajax, http desde cualquier  forntEnd, acceso cruzado ente dominio.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//Añadir prfijos a rutas / cargar rutas
app.use('/', express.static('reorganizacion', {redirect: false}));
app.use('/api',article_routes);

app.get('*',function(req, res, next){
    res.sendFile(path.resolve('reorganizacion/index.html'));
});
//Exportar modulos (fichero actual)
module.exports = app;