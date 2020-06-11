var mongoose = require("mongoose");
var schema = mongoose.Schema;

var personaschema = new schema({
    Nombre: String,
    Apellido: String,
    Edad: Number,
    Create_at: { type: Date, require: true, default: Date.now },
    isProfesional: Boolean
});

module.exports = mongoose.model('Persona', personaschema);