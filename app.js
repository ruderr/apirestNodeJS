const express = require("express");
const bodyparser = require("body-parser");
const methodoverride = require("method-override");
const mongoose = require("mongoose");
const personaModel = require("./PersonaModel");
const publicacionModel = require("./PublicacionModel");
const configuracion = require("./config");

const app = express();
const router = express.Router();

//app.use(bodyparser.urlencoded({ extended: false}));
//app.use(bodyparser.json());

app.use(methodoverride());

app.use(express.json( { limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb"}));

app.use(configuracion.path, express.static(__dirname + "/public/upload"));

/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(configuracion.db, {useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log("Conexión con el servidor exitosa");
});

app.listen(configuracion.puerto, () => {
    console.log("Ingreso al servidor que estamos desarrollando");
});

// PERSONAS - Operaciones

//Obtener todas las personas
router.get("/persona", (req, res) => {
    console.log("Operación GET exitosa");
    // De esta forma, enviamos el status. En esta caso (200) significa OK 
    // res.status(200).send( { mensaje: "Operación GET exitosa"});
    // pero si no lo colocamos, NodeJS lo gestiona por nosotros

    personaModel.find({}, (error, respuesta) => {
        if (error) res.send({ estado: {codigo: 0, respuesta: err.message} });
        res.send({ estado: { codico: 0, respuesta: 'Operación buscar exitosa'}, personas: respuesta });
    });

    //res.send( { mensaje: "Operación GET exitosa"});
    //Enviamos un json como respuesta
});

//Obtener una persona con el id en uri
router.get("/persona/:id", (req, res) => {
    console.log("Operación GET con parametro exitosa");

    personaModel.findById(req.params.id, (err, retorno) => {
        if (err) res.send({ estado: {codigo: 0, respuesta: err.message }});
        res.send({ estado: {codigo: 0, respuesta: 'Operación de busqueda exitosa'}, persona: retorno});
    });

    //res.send( { mensaje: "Operación GET con parámetro exitosa" + req.params.id });
    //Devolvemos un mensaje de exito y el valor del parámetro recibido
});

//Guardar una persona
router.post("/persona", (req, res) => {
    console.log("Operación POST exitosa");

    var miObjetoAdd = personaModel();
    miObjetoAdd.Nombre = req.body.Nombre;
    miObjetoAdd.Apellido = req.body.Apellido;
    miObjetoAdd.Edad = req.body.Edad;
    miObjetoAdd.isProfesional = true;

    miObjetoAdd.save( (err, respuesta) => {
        if (err) res.send({ estado: {codigo: 0, respuesta: err.message }});
        res.send({ estado: {codigo: 0, respuesta: 'Operación exitosa'}, persona: respuesta});
    });

    //res.send( { mensaje: "Operación POST exitosa " + JSON.stringify(req.body) });
    //Devolvemos un mensaje de exito y el BODY recibido en forma de string
});

//Actualizar una persona con id en uri
router.put("/persona/:id", (req, res) => {
    console.log("Operación PUT exitosa");

    personaModel.findById(req.params.id, (err, retorno) => {
        
        retorno.Nombre = req.body.Nombre;
        retorno.Apellido = req.body.Apellido;
        retorno.Edad = req.body.Edad;
        retorno.isProfesional = true;

        retorno.save( (err, respuesta) => {
            if (err) res.send({ estado: {codigo: 0, respuesta: err.message }});
            res.send({ estado: {codigo: 0, respuesta: 'Operación de actualización exitosa'}, persona: respuesta});
        });

    });

    //res.send( { mensaje: "Operación PUT exitosa"});
});

// Eliminar una persona con ide en uri
router.delete("/persona/:id", (req, res) => {
    console.log("Operación DELETE exitosa");

    personaModel.findById(req.params.id, (err, retorno) => {

        retorno.remove( (err, respuesta) => {
            if (err) res.send({ estado: {codigo: 0, respuesta: err.message }});
            res.send({ estado: {codigo: 0, respuesta: 'Operación eliminar exitosa'}, persona: respuesta});
        });

    });

    //res.send( { mensaje: "Operación DELETE exitosa"});
});


// PUBLICACIONES - Operaciones

//Obtener todas las publicaciones
router.get("/publicacion", (req, res) => {
    console.log("Operación GET exitosa");

    publicacionModel.find({}).populate('IdPersona').exec((error, respuesta) => {
        if (error) res.send({ estado: {codigo: 0, respuesta: err.message} });
        res.send({ estado: { codico: 0, respuesta: 'Operación buscar exitosa'}, publicacion: respuesta });
    });

    //res.send( { mensaje: "Operación GET exitosa"});
});

//Agregar una publicacion
router.post("/publicacion", (req, res) => {
    console.log("Operación POST exitosa");

    var modeloObjeto = new publicacionModel();
    modeloObjeto.Titulo = req.body.Titulo;
    modeloObjeto.Texto = req.body.Texto;
    modeloObjeto.IdPersona = req.body.IdPersona;

    if (req.body.Imagen!="") {
        var imagen = req.body.Imagen;
        var fs = require("fs");
        var nombrearchivo = Math.random().toString() + ".jpg";
        
        fs.writeFile("public/upload/" + nombrearchivo, imagen, 'base64', (error) => {
            modeloObjeto.Imagen = "public/upload/" + nombrearchivo;
            modeloObjeto.save((error, respuesta) => {
                if (error) res.send({ estado: { codigo: 0, respuesta: error.message}});
                res.send({ estado: { codigo: 0, respuesta: 'Operación POST exitosa'}, publicacion: respuesta});
            });
        });
    }
    //res.send( { mensaje: "Operación POST exitosa"});
});

app.use(router);

