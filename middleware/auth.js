const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'esatic_secret_key_2025';

// Middleware : vérifie le token JWT
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token manquant. Accès refusé.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
}

// Middleware : vérifie que l'utilisateur est admin
function verifyAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Accès refusé. Rôle admin requis.' });
    }
}

module.exports = { verifyToken, verifyAdmin };
