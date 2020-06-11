# API REST con NodeJS y MongoDB

1.	Lo primero es crear una carpeta para el proyecto.
2.	Estando dentro de la carpeta ejecutamos: `npm init` para generar el package.json
3.	Para trabajar con el framework Express, ejecutamos el comando: `npm install express -s` para que instale la dependencia y la agregue dentro del package.json
4.	En la raíz, creamos un archivo llamado app.js
5.	Para relacionar el framework con el archivo app.js, agregamos lo siguiente:

`const express = require("express");
const app = express();`

6.	Ponemos a escuchar el servidor en el puerto 3000:

`app.listen(3000, () => {
    console.log("Ingreso al servidor que estamos desarrollando");
});`

7.	Ejecutamos el servidor de la siguiente forma: `node .\app.js`
8.	Verificamos la ejecución con la salida del mensaje por consola.
9.	Ahora instalamos lo necesario para poder trabajar con el input y procesar los recuest que lleguen: `npm install -s body-parser`
10.	Ahora agregamos el body-parser a nuestra app.js

`const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());`

11.	De esta forma, nuestro servidor de aplicaciones va estar procesando request que reciba con json.
12.	Ahora indicamos el tamaño máximo de los archivos json que se soliciten:

`app.use(express.json( { limit: "50mb"}));`

13.	Y nuestro Código va quedando así:

'const express = require("express");
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());
app.use(express.json( { limit: "50mb"}));

app.listen(3000, () => {
    console.log("Ingreso al servidor que estamos desarrollando");
});'

14.	Vamos a instalar ahora NodeMon, que es un monitor de la ejecución del servidor que reinicia el mismo cada vez que hacemos un cambio. De esta forma, no tenemos que estar deteniendo y volviendo a ejecutar el servidor con cada cambio que hagamos. Para instalar el NodeMon en nuestro proyecto, de forma global, ejecutamos lo siguiente: `npm install -g nodemon`
15.	Ahora podemos ejecutar el nodemon, simplemente escribiendo a la terminal: `nodemon`
16.	Para ejecutar el nodemon de manera automática en nuestro proyecto, agregamos lo siguiente al package.json de nuestra aplicación:

`“start”: “nodemon app.js”`

Así agregamos un comando a nuestro proyecto, y podemos ejecutar: npm start para iniciar el servidor con nodemon.

17.	A continuación, vamos a agregar el method-override para poder soportar las operaciones Put o Delete: `npm install -s method-override`
18.	Ahora lo agregamos a nuestra app.js:

`const methodoverride = require("method-override");
app.use(methodoverride());`

19.	Trabajemos ahora con Router, que forma parte de express. En el app.js agregamos una constante que nos sirva de referencia al manejador de rutas:

`const router = express.Router();`

20.	Definimos el enrutamiento, para que nuestro servidor pueda escuchar las diferentes solicitudes que llegan a través de los URI, agregamos por ejemplo lo siguiente:

`router.get("/usuario", (req, res) => {
    console.log("Operación GET exitosa");
    res.send( { mensaje: "Operación GET exitosa"});
    //Enviamos un json como respuesta
});

router.get("/usuario/:id", (req, res) => {
    console.log("Operación GET con parámetro exitosa");
    res.send( { mensaje: "Operación GET con parámetro exitosa"});
});

router.post("/usuario", (req, res) => {
    console.log("Operación POST exitosa");
    res.send( { mensaje: "Operación POST exitosa"});
});

router.put("/usuario/:id", (req, res) => {
    console.log("Operación PUT exitosa");
    res.send( { mensaje: "Operación PUT exitosa"});
});

router.delete("/usuario/:id", (req, res) => {
    console.log("Operación DELETE exitosa");
    res.send( { mensaje: "Operación DELETE exitosa"});
});

app.use(router);`

21.	Y le decimos que vamos a utilizar la el enrutamiento:

`app.use(router);`

22.	Para probar las peticiones POST, PUT y DELETE, utilizamos la aplicación Postman.
23.	La información que se envía a través de las peticiones puede ir de dos formas, en la URI (parámetros) o en el Body (los campos del del formulario, en forma de JSON). Si queremos obtener los valores de los parámetros, los mismos se encuentran en el request, y se obtendrían de la siguiente forma: req.params.id por ejemplo. Si se quiere obtener los datos del Body, podemos hacer por ejemplo: JSON.stringify(req.body) y mostrar el JSON completo en forma de string o también podemos hacer referencia a uno de los campos, por ejemplo: req.body.Nombre  

`router.get("/usuario/:id", (req, res) => {
    console.log("Operación GET con parámetro exitosa");
    res.send( { mensaje: "Operación GET con parámetro exitosa" + req.params.id });
    //Devolvemos un mensaje de exito y el valor del parámetro recibido
});

router.post("/usuario", (req, res) => {
    console.log("Operación POST exitosa");
    res.send( { mensaje: "Operación POST exitosa " + JSON.stringify(req.body) });
    //Devolvemos un mensaje de exito y el BODY recibido en forma de string
});`

24.	Descargamos e instalamos MongoDB en nuestro equipo.
25.	Instalamos Robomongo Studio 3T para administrar mongoDB
26.	Y dentro de nuestro proyecto instalamos mongoose para trabajar con mongoDB. Ejecutamos el siguiente comando: npm install -s mongoose
27.	Ahora incluimos mongoose dentro de nuestra app.js e iniciamos una conexión con la db:

`const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/angular2020', {useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log("Conexión con el servidor exitosa");
});`

28.	Ahora vamos a trabajar sobre el modelo, creamos el archivo (modelo) PersonaModel.js y PublicacionModel.js:

PersonaModel.js
`var mongoose = require("mongoose");
var schema = mongoose.Schema;

var personaschema = new schema({
    Nombre: String,
    Apellido: String,
    Edad: Number,
    Create_at: { type: Date, require: true, default: Date.now },
    isProfesional: Boolean
});

module.exports = mongoose.model('Persona', personaschema);`

PublicacionModel.js
`var mongoose = require("mongoose");
var schema = mongoose.Schema;

var publicacionschema = new schema({
    Titulo: String,
    Texto: String,
    Imagen: String,
    Create_at: { type: Date, require: true, default: Date.now },
    IdPersona: { type: schema.ObjectId, ref: 'Persona'}
});

module.exports = mongoose.model('Publicacion', publicacionschema);`

29.	Ahora, en nuestra app.js agregamos los requiere para ambos modelos:

`const personaModel = require("./PersonaModel");
const publicacionModel = require("./PublicacionModel");`

30.	A continuación, definimos las operaciones (GET, POST, PUT y DELETE) para cada uno de los modelos:

`// PERSONAS - Operaciones

//Obtener todas las personas
router.get("/persona", (req, res) => {
    console.log("Operación GET exitosa");

    personaModel.find({}, (error, respuesta) => {
        if (error) res.send({ estado: {codigo: 0, respuesta: err.message} });
        res.send({ estado: { codico: 0, respuesta: 'Operación buscar exitosa'}, personas: respuesta });
    });
});

//Obtener una persona con el id en uri
router.get("/persona/:id", (req, res) => {
    console.log("Operación GET con parametro exitosa");

    personaModel.findById(req.params.id, (err, retorno) => {
        if (err) res.send({ estado: {codigo: 0, respuesta: err.message }});
        res.send({ estado: {codigo: 0, respuesta: 'Operación de busqueda exitosa'}, persona: retorno});
    });
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
});


// PUBLICACIONES - Operaciones

//Obtener todas las publicaciones
router.get("/publicacion", (req, res) => {
    console.log("Operación GET exitosa");

    publicacionModel.find({}).populate('IdPersona').exec((error, respuesta) => {
        if (error) res.send({ estado: {codigo: 0, respuesta: err.message} });
        res.send({ estado: { codico: 0, respuesta: 'Operación buscar exitosa'}, publicacion: respuesta });
    });
});

//Agregar una publicacion
router.post("/publicacion", (req, res) => {
    console.log("Operación POST exitosa");

    var modeloObjeto = new publicacionModel();
    modeloObjeto.Titulo = req.body.Titulo;
    modeloObjeto.Texto = req.body.Texto;
    modeloObjeto.Imagen = req.body.Imagen;
    modeloObjeto.IdPersona = req.body.IdPersona;

    modeloObjeto.save((error, respuesta) => {
        if (error) res.send({ estado: { codigo: 0, respuesta: error.message}});
        res.send({ estado: { codigo: 0, respuesta: 'Operación POST exitosa'}, publicacion: respuesta});
    });
});`

31.	Ahora vamos a incorporar la gestión de imágenes a nuestro proyecto.
a.	Lo primero es instalar la librería File System: `npm install -s fs`
b.	A continuación, modificamos el POST de publicaciones:

`//Agregar una publicacion
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
});`

c.	Creamos la ruta de directorios en nuestro proyecto: public/upload (creamos ambas carpetas)
d.	Agregamos la siguiente línea para poder convertir o mapear un directorio relativa a un directorio físico en disco:

`app.use("/public/upload", express.static(__dirname + "/public/upload"));`

e.	También es necesario hacer esta modificación: sustituir, las siguientes líneas:

`app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());`

Por estas dos:
`app.use(express.json( { limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb"}));`

32.	Creando y utilizando un archivo de configuración para almacenar algunas constantes:
a.	Creamos el archivo: config.js

`module.exports = {
    puerto: 3000,
    db: 'mongodb://localhost:27017/angular2020',
    path: ' /public/upload'
}`

b.	Lo incorporamos en nuestro app.js

`const configuracion = require("./config");

app.use(configuracion.path, express.static(__dirname + "/public/upload"));

mongoose.connect(configuracion.db…

app.listen(configuracion.puerto, …`

33.	Allow Origin, para poder recibir peticiones uri mediante scripts desde otros dominios (intercambio de recursos de origen cruzado CORS), es necesario agregar lo siguiente a nuestro proyecto (un encabezado CORS):

`app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});`
