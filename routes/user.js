const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/login');
const userRegister = require('../controllers/signup');
const checkAdminRole = require('../middleware/checkAdminRole');
const auth = require('../middleware/auth');
const User = require('../models/user');

// Route de login
router.post('/login', userLogin.login); // Tu peux ajouter checkBannedStatus ici si besoin

// Route d'inscription
router.post('/signup', userRegister.signup);

// Route de suppression d'utilisateur (protégée par auth + admin)
router.delete('/:id', auth, checkAdminRole, (req, res) => {
  const userIdToDelete = req.params.id;

  User.findByIdAndDelete(userIdToDelete)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    })
    .catch(err => {
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: err });
    });
});

// ✅ Route pour bannir un utilisateur (admin uniquement)
router.patch('/ban/:id', auth, checkAdminRole, (req, res) => {
  const userIdToBan = req.params.id;

  User.findByIdAndUpdate(userIdToBan, { banned: true }, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      res.status(200).json({ message: `Utilisateur ${user.username} a été banni.` });
    })
    .catch(err => {
      res.status(500).json({ message: "Erreur lors du bannissement de l'utilisateur", error: err });
    });
});

module.exports = router;