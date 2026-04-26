/**
 * Script de peuplement de la base de données avec 1000+ assignments
 * Usage : node scripts/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../model/assignment');

const MATIERES = [
    { nom: 'Base de données', image: 'https://img.icons8.com/color/96/database.png', prof: 'Dr. Kouassi', photoProf: 'https://i.pravatar.cc/150?img=11' },
    { nom: 'Technologies Web', image: 'https://img.icons8.com/color/96/html-5--v1.png', prof: 'Dr. Bamba', photoProf: 'https://i.pravatar.cc/150?img=12' },
    { nom: 'Réseaux', image: 'https://img.icons8.com/color/96/network.png', prof: 'Dr. Traoré', photoProf: 'https://i.pravatar.cc/150?img=13' },
    { nom: 'Intelligence Artificielle', image: 'https://img.icons8.com/color/96/artificial-intelligence.png', prof: 'Dr. Coulibaly', photoProf: 'https://i.pravatar.cc/150?img=14' },
    { nom: 'Systèmes d\'exploitation', image: 'https://img.icons8.com/color/96/linux.png', prof: 'Dr. Diallo', photoProf: 'https://i.pravatar.cc/150?img=15' },
    { nom: 'Algorithmique', image: 'https://img.icons8.com/color/96/algorithm.png', prof: 'Dr. Koné', photoProf: 'https://i.pravatar.cc/150?img=16' },
    { nom: 'Mathématiques', image: 'https://img.icons8.com/color/96/math.png', prof: 'Dr. Touré', photoProf: 'https://i.pravatar.cc/150?img=17' },
    { nom: 'Programmation Java', image: 'https://img.icons8.com/color/96/java-coffee-cup-logo.png', prof: 'Dr. Sangaré', photoProf: 'https://i.pravatar.cc/150?img=18' },
    { nom: 'Angular', image: 'https://img.icons8.com/color/96/angularjs.png', prof: 'Prof. Buffa', photoProf: 'https://i.pravatar.cc/150?img=19' },
    { nom: 'Microservices', image: 'https://img.icons8.com/color/96/spring-logo.png', prof: 'Prof. Buffa', photoProf: 'https://i.pravatar.cc/150?img=19' }
];

const PRENOMS = ['Ibrahim', 'Fatou', 'Moussa', 'Aminata', 'Kofi', 'Akosua', 'Kwame', 'Abena',
    'Yao', 'Adwoa', 'Seydou', 'Mariame', 'Lamine', 'Ndeye', 'Oumar', 'Rokhaya',
    'Boubacar', 'Kadiatou', 'Mamadou', 'Oumou', 'Pierre', 'Marie', 'Jean', 'Claire',
    'David', 'Sarah', 'Ali', 'Zainab', 'Hassan', 'Fatima'];

const NOMS = ['Diallo', 'Traoré', 'Coulibaly', 'Koné', 'Touré', 'Bamba', 'Ouédraogo',
    'Sawadogo', 'Compaoré', 'Dembélé', 'Sangaré', 'Konaté', 'Cissé', 'Keïta',
    'Sylla', 'Barry', 'Sow', 'Baldé', 'Camara', 'Fofana', 'N\'Diaye', 'Fall',
    'Seck', 'Mbaye', 'Sarr', 'Ndiaye', 'Thiam', 'Diouf', 'Gueye', 'Niang'];

function randomBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateAssignments(count) {
    const assignments = [];
    const startDate = new Date('2024-09-01');
    const endDate = new Date('2026-06-30');

    for (let i = 0; i < count; i++) {
        const matiere = randomElement(MATIERES);
        const prenom = randomElement(PRENOMS);
        const nom = randomElement(NOMS);
        const auteur = `${prenom} ${nom}`;
        const dateDeRendu = randomDate(startDate, endDate);
        const rendu = Math.random() < 0.6;
        const note = rendu ? randomBetween(0, 20) : null;

        assignments.push({
            nom: `Devoir ${i + 1} - ${matiere.nom}`,
            dateDeRendu,
            rendu,
            auteur,
            photoAuteur: `https://i.pravatar.cc/150?img=${randomBetween(1, 70)}`,
            matiere: matiere.nom,
            imageMatiere: matiere.image,
            professorName: matiere.prof,
            photoProf: matiere.photoProf,
            note,
            remarques: rendu
                ? `Travail ${['excellent', 'bien', 'passable', 'insuffisant', 'très bien'][randomBetween(0, 4)]}. ${['Bon effort.', 'À améliorer.', 'Félicitations !', 'Manque de détails.', 'Très complet.'][randomBetween(0, 4)]}`
                : ''
        });
    }
    return assignments;
}

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI manquant dans .env');
        process.exit(1);
    }

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connecté à MongoDB');

    const count = await Assignment.countDocuments();
    if (count >= 1000) {
        console.log(`Base déjà peuplée avec ${count} assignments. Suppression avant re-peuplement...`);
        await Assignment.deleteMany({});
    }

    const assignments = generateAssignments(1000);
    await Assignment.insertMany(assignments);
    console.log('✅ 1000 assignments insérés avec succès !');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('Erreur seed:', err);
    process.exit(1);
});
