let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentSchema = Schema({
    nom: { type: String, required: true },
    dateDeRendu: { type: Date, required: true },
    rendu: { type: Boolean, default: false },
    // Nouvelles propriétés
    auteur: { type: String, default: '' },
    photoAuteur: { type: String, default: '' },
    matiere: { type: String, default: '' },
    imageMatiere: { type: String, default: '' },
    professorName: { type: String, default: '' },
    photoProf: { type: String, default: '' },
    note: { type: Number, min: 0, max: 20, default: null },
    remarques: { type: String, default: '' }
}, { timestamps: true });

AssignmentSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Assignment', AssignmentSchema);
