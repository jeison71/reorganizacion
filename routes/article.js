'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');
var UserController = require('../controllers/user');

var router = express.Router()

var multipart = require('connect-multiparty');
const { JsonWebTokenError } = require('jsonwebtoken');
var md_upload = multipart({ uploadDir: './upload/articles'});

const jwt = require('jsonwebtoken');

//rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

//Rutas para articulos 
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

//Rutas para usuarios
router.get('/test', verifyToken, UserController.test);
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);

module.exports = router;

function verifyToken(req, res, next){
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        return res,status(401).send('No autorizado');
    }

    const token = req.headers.authorization.split(' ')[1];

    if(token === 'null'){
        return res,status(401).send('No autorizado');
    }

    const payload = jwt.verify(token, 'secretkey');

    console.log(payload);

    req.userId = payload._id;
    next();

}