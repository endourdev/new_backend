const User = require('../models/user');

module.exports = (req, res, next) => {
  User.find()
    .then(users => {
      if (!users) {
        return res.status(404).json({ message: "Aucun utilisateur trouvé" });
      }

      // Formatage du retour pour une meilleure lisibilité
      const formattedUsers = users.map(user => {
        // Formatage de la date et heure au format JJ/MM/YYYY HH:MM:SS
        const createdAtFormatted = user.createdAt
          ? new Date(user.createdAt).toLocaleString('fr-FR', {
              weekday: 'short', // Jour de la semaine court (optionnel)
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false, // Format 24h
            })
          : null;

        return {
          _id: user._id,
          username: user.username,
          role: user.role,
          banned: user.banned,
          __v: user.__v,
          createdAt: createdAtFormatted // Ajoute la date et l'heure formatées
        };
      });

      res.status(200).json({
        message: "Utilisateurs récupérés avec succès",
        users: formattedUsers
      });
    })
    .catch(err => {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    });
};