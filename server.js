const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 8010;
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI manquant. Créez un fichier .env avec votre URI MongoDB Atlas.');
    process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connecté à MongoDB Atlas !");
        console.log(`API disponible sur http://localhost:${port}/api/assignments`);
        // Créer le compte admin par défaut au démarrage
        createDefaultAdmin();
    })
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

async function createDefaultAdmin() {
    const User = require('./model/user');
    try {
        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            const newAdmin = new User({
                username: 'admin',
                password: 'Admin1234!',
                email: 'admin@esatic.ci',
                role: 'admin',
                nom: 'Admin',
                prenom: 'ESATIC'
            });
            await newAdmin.save();
            console.log('Compte admin créé : admin / Admin1234!');
        }
    } catch (e) {
        // Silencieux si déjà créé
    }
}

// CORS — autorise le frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const authRouter = require('./routes/auth');
const assignmentRoute = require('./routes/assignments');
const { verifyToken, verifyAdmin } = require('./middleware/auth');

// Auth routes (publiques)
app.use('/api/auth', authRouter);

// Assignments routes
app.get('/api/assignments', assignmentRoute.getAssignments);
app.get('/api/assignments/:id', assignmentRoute.getAssignment);

// Routes protégées (login requis)
app.post('/api/assignments', verifyToken, assignmentRoute.postAssignment);
app.put('/api/assignments', verifyToken, assignmentRoute.updateAssignment);

// Route protégée admin
app.delete('/api/assignments/:id', verifyToken, verifyAdmin, assignmentRoute.deleteAssignment);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = app;
