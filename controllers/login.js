require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const errorMessage = require("../utils/messages.json");

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          const err = new Error(errorMessage["401"]);
          err.status = 401;
          return next(err);  // Passe l'erreur au middleware de gestion d'erreurs
        }
  
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              const err = new Error(errorMessage["401"]);
              err.status = 401;
              return next(err);  // Passe l'erreur au middleware de gestion d'erreurs
            }
  
            // Inclure les rôles dans le token
            const token = jwt.sign(
              {
                userId: user._id,
                roles: user.roles || []  // Assure-toi que `roles` existe sur l'utilisateur
              },
              process.env.JWT_SECRET,
              { expiresIn: '30d' }
            );
  
            res.status(200).json({
              message: errorMessage["200"],
              roles: user.role || [],
              userId: user._id,
              token: token,
            });
          })
          .catch(error => {
            const err = new Error(errorMessage["500"]);
            err.status = 500;
            next(err);  // Passe l'erreur au middleware de gestion d'erreurs
          });
      })
      .catch(error => {
        const err = new Error(errorMessage["500"]);
        err.status = 500;
        next(err);  // Passe l'erreur au middleware de gestion d'erreurs
      });
};  