// /routes/passwordRoutes.js
const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

// Route pour envoyer l'email de réinitialisation
router.post('/forgot-password', forgotPassword);

// Route pour réinitialiser le mot de passe avec un token
router.post('/reset-password', resetPassword);

module.exports = router;