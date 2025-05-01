// /controllers/passwordController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const errorMessage = require('../utils/messages.json');

// Fonction pour envoyer un email avec un token de réinitialisation
exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  // Vérifier si l'utilisateur existe
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: errorMessage[404] });
      }

      // Créer un token de réinitialisation de mot de passe
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token valide pendant 1 heure
      user.save()
        .then(() => {
          // Envoyer l'email de réinitialisation avec le token
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Réinitialisation de mot de passe',
            text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : \nhttp://${req.headers.host}/reset-password/${resetToken}`
          };

          transporter.sendMail(mailOptions)
            .then(() => {
              res.status(200).json({ message: 'Un email a été envoyé pour réinitialiser votre mot de passe.' });
            })
            .catch(err => {
              res.status(500).json({ message: 'Erreur d\'envoi de l\'email', error: err });
            });
        })
        .catch(err => {
          res.status(500).json({ message: 'Erreur lors de la mise à jour du token', error: err });
        });
    })
    .catch(err => {
      res.status(500).json({ message: 'Erreur lors de la recherche de l\'utilisateur', error: err });
    });
};

// Fonction pour réinitialiser le mot de passe avec le token
exports.resetPassword = (req, res, next) => {
  const { resetToken, password } = req.body;

  // Vérifier si le token est valide
  User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Le token est invalide ou a expiré.' });
      }

      // Hacher le nouveau mot de passe
      bcrypt.hash(password, 10)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save()
            .then(() => {
              res.status(200).json({ message: 'Votre mot de passe a été réinitialisé avec succès.' });
            })
            .catch(err => {
              res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe', error: err });
            });
        })
        .catch(err => {
          res.status(500).json({ message: 'Erreur lors du hachage du mot de passe', error: err });
        });
    })
    .catch(err => {
      res.status(500).json({ message: 'Erreur lors de la vérification du token', error: err });
    });
};
