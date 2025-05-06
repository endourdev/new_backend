// /controllers/passwordController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const errorMessage = require('../utils/messages.json');

// Fonction pour envoyer un email avec un token de réinitialisation
exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: errorMessage[404] });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1h
      user.save()
        .then(() => {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          });

          const resetLink = `http://192.168.183.6:3000/${resetToken}/reset-password`;
          const htmlContent = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <title>Réinitialisation de votre mot de passe</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  background-color: #ffffff;
                  margin: 50px auto;
                  padding: 20px;
                  max-width: 600px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin-top: 20px;
                  background-color: #007BFF;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #777777;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Réinitialisation de votre mot de passe</h2>
                <p>Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder :</p>
                <a href="${resetLink}" class="button">Réinitialiser le mot de passe</a>
                <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
                <div class="footer">
                  <p>Vous recevez cet email car vous êtes inscrit sur <a href="https://erisium-pvp.fr">erisium-pvp.fr</a>.</p>
                  <p><a href="https://erisium-pvp.fr/unsubscribe">Se désabonner</a></p>
                </div>
              </div>
            </body>
            </html>
          `;

          const mailOptions = {
            from: `"Erisium Support" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            html: htmlContent
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
  const resetToken = req.params.token || req.body.resetToken;
  const { password } = req.body;

  User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Le token est invalide ou a expiré.' });
      }

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