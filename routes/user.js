const express = require('express');
const router = express.Router();
const userLogin = require('../controllers/login');
const userRegister = require('../controllers/signup');
const checkAdminRole = require('../middleware/checkAdminRole');
const auth = require('../middleware/auth');
const User = require('../models/user');

// Route de login
router.post('/login', userLogin.login);

// Route d'inscription
router.post('/signup', userRegister.signup);

// Route de suppression d'utilisateur (protégée par l'authentification et la vérification du rôle admin)
router.delete('/:id', auth, checkAdminRole, (req, res, next) => {
  const userIdToDelete = req.params.id;

  // Vérifier si l'ID de l'utilisateur à supprimer existe dans la base de données
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

module.exports = router;