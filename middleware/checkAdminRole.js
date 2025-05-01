const User = require('../models/user');

const checkAdminRole = (req, res, next) => {
  const userId = req.auth.userId; // Utilise req.auth.userId pour récupérer l'ID de l'utilisateur

  // Recherche de l'utilisateur dans la base de données
  User.findById(userId)
    .then(user => {
      if (!user || user.role !== 'admin') { // Vérifie si le rôle de l'utilisateur est "admin"
        return res.status(403).json({ message: "Accès interdit : Vous devez être admin pour supprimer un utilisateur." });
      }
      next(); // Si l'utilisateur a le rôle admin, passe à la suite
    })
    .catch(err => {
      console.error("Erreur lors de la vérification du rôle:", err); // Log de l'erreur pour déboguer
      return res.status(500).json({ message: "Erreur lors de la vérification du rôle", error: err.message });
    });
};

module.exports = checkAdminRole;