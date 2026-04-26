let Assignment = require("../model/assignment");
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// GET /api/assignments avec pagination
function getAssignments(req, res) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let rendu = req.query.rendu;
    let matiere = req.query.matiere;

    let matchStage = {};
    if (search) {
        matchStage.$or = [
            { nom: { $regex: search, $options: 'i' } },
            { auteur: { $regex: search, $options: 'i' } },
            { matiere: { $regex: search, $options: 'i' } }
        ];
    }
    if (rendu !== undefined && rendu !== '') {
        matchStage.rendu = rendu === 'true';
    }
    if (matiere && matiere !== '') {
        matchStage.matiere = matiere;
    }

    let options = {
        page: page,
        limit: limit,
        sort: { dateDeRendu: 1 }
    };

    Assignment.aggregatePaginate(Assignment.aggregate([{ $match: matchStage }]), options)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

// GET /api/assignments/:id
function getAssignment(req, res) {
    Assignment.findById(req.params.id)
        .then(assignment => {
            if (!assignment) return res.status(404).json({ message: 'Assignment non trouvé.' });
            res.json(assignment);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

// POST /api/assignments — protégé (login requis)
function postAssignment(req, res) {
    let assignment = new Assignment({
        nom: req.body.nom,
        dateDeRendu: req.body.dateDeRendu,
        rendu: req.body.rendu || false,
        auteur: req.body.auteur || '',
        photoAuteur: req.body.photoAuteur || '',
        matiere: req.body.matiere || '',
        imageMatiere: req.body.imageMatiere || '',
        professorName: req.body.professorName || '',
        photoProf: req.body.photoProf || '',
        note: req.body.note !== undefined ? req.body.note : null,
        remarques: req.body.remarques || ''
    });

    assignment.save()
        .then(() => res.json({ message: `${assignment.nom} saved!` }))
        .catch(err => res.status(500).json({ error: err.message }));
}

// PUT /api/assignments — protégé (login requis)
function updateAssignment(req, res) {
    // Si rendu = true, la note est obligatoire
    if (req.body.rendu === true && (req.body.note === null || req.body.note === undefined || req.body.note === '')) {
        return res.status(400).json({ message: 'Impossible de marquer "rendu" sans note.' });
    }

    Assignment.findByIdAndUpdate(
        req.body._id,
        req.body,
        { new: true }
    )
        .then(assignment => res.json({ message: 'Assignment mis à jour.', assignment }))
        .catch(err => res.status(500).json({ error: err.message }));
}

// DELETE /api/assignments/:id — protégé (admin requis)
function deleteAssignment(req, res) {
    Assignment.findByIdAndDelete(req.params.id)
        .then(assignment => {
            if (!assignment) return res.status(404).json({ message: 'Assignment non trouvé.' });
            res.json({ message: `${assignment.nom} supprimé.` });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

module.exports = {
    getAssignments,
    postAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    verifyToken,
    verifyAdmin
};
