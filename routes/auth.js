const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET || 'esatic_secret_key_2025';
const JWT_EXPIRES_IN = '24h';

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, nom, prenom, role } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: 'username, password et email sont requis.' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username ou email déjà utilisé.' });
        }

        const user = new User({
            username,
            password,
            email,
            nom: nom || '',
            prenom: prenom || '',
            role: role === 'admin' ? 'admin' : 'user'
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                nom: user.nom,
                prenom: user.prenom
            }
        });
    } catch (err) {
        console.error('Erreur register:', err);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username et password requis.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Connexion réussie.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                nom: user.nom,
                prenom: user.prenom
            }
        });
    } catch (err) {
        console.error('Erreur login:', err);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
});

// GET /api/auth/me - obtenir le profil de l'utilisateur connecté
router.get('/me', require('../middleware/auth').verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;
