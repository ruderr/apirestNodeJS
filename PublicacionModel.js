var mongoose = require("mongoose");
var schema = mongoose.Schema;

var publicacionschema = new schema({
    Titulo: String,
    Texto: String,
    Imagen: String,
    Create_at: { type: Date, require: true, default: Date.now },
    IdPersona: { type: schema.ObjectId, ref: 'Persona'}
});

module.exports = mongoose.model('Publicacion', publicacionschema);