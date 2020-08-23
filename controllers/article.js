'use strict'

var validator = require('validator');
var Article = require('../models/article');

var fs = require('fs');
var path = require('path');
const article = require('../models/article');

var controller = {

    datosCurso: (req, res) => {
    
        return res.status(200).send({
            curso: 'Mastes en Frameworks Js',
            autor: 'Victor Robles Web',
            url: 'victorroblesweb.es'
        })
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de Articulos'
        });
    },

    save: (req, res) => {
        //Recoger parametros por Post
        var params = req.body;
        console.log(params);

        //Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)

        } catch (error) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }
        
        if(validate_title && validate_content){

            //Crear el objeto a Guardar
            var article = new Article();
            
            //Asignar Valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            if(params.image){
                article.image = params.image;
            }

            //Guardar el Articulo
            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'Error',
                        message: 'El articulo no se ha guardado!!!'
                    });
                }

                //Devolver una Respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            })

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Datos No Validos !!!'
            });
        }
    },
    
    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(2);
        };

        //find
        query.sort('-date').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error devolviendo datos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    },

    getArticle: (req, res) =>{

        //Recoger el Id de la url
        var articleId = req.params.id;

        //Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'Parametro no Valido'
            });
        }

        //Buscar el articulo
        Article.findById(articleId, (err, article) =>{

            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No Existe el articulo'
                });
            }   

            //Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        })
    },

    update: (req, res) => {
        //Recoger el id del articulo que viene por la url
        var articleId = req.params.id;

        //Recoger los datos que llegan por put
        var params = req.body;

        //validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title)
            var validate_content = !validator.isEmpty(params.content)
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos'
            });
        }

        if(validate_title && validate_content){
            //find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {

                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No Existe el articulo'
                    });
                }

                //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });
        }else{

            return res.status(500).send({
                status: 'error',
                message: 'Error en los datos'
            });
        }
    },

    delete: (req, res) => {
        //Recoger el id de la url
        var articleId = req.params.id;

        //Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
            
        })
    },

    upload: (req, res) => {
        //configurar el modulo de connect multiparty router/article.js

        //recoger el fichero de la peticion
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //Conseguir el nombre y extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');
        console.log("file_path" + req.files);
        //ADVERTENCIA para linux o Mac  usar file_path.split('/')

        // nombre archivo
        var file_name = file_split[file_split.length -1];
        // extension archivo
        var file_ext = file_name.split(('/.'))[1];
        //Comprobar la extension solo imagenes, si no es valida borrar el fichero
        if(file_ext != 'pdf' && file_ext != 'jpg' && file_ext != 'png' && file_ext != 'jpeg' && file_ext != 'gif' && file_ext != 'svg'){
            //Borrar archivo subido
            
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida !!!'
                });
            })

        }else{
            //buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            var articleId = req.params.id;
            console.log(articleId);
            if(articleId){

                Article.findOneAndUpdate({_id: articleId}, {image:file_name}, {new:true}, (err, articleUpdated) => {
    
                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            article: 'Error al guardar la imagen de articulo'
                        });
                    }
    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'Sin Id de Articulo',
                    image: file_name
                });
            }
        }

        //si todo es valido

        //buscar el articulo, asignarle el nombre de la imagen y actualizarlo

    },  // end uploadfile


    getImage: (req, res) => {

        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    article: 'La imagen no exite'
                });
            }
        })
    },

    getArchivoPdf: (req, res) => {

        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    article: 'El archivo no exite'
                });
            }
        })
    },

    search: (req, res) => {
        //sacar el esting a buscar
        var searchString = req.params.search;

        //find or
        Article.find({ "$or":[
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}},
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion!!'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busquedad !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        })
    },
    
}; // end controller

module.exports = controller;