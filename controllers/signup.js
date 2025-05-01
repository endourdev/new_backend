const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const errorMessage = require("../utils/messages.json");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash
      });
      user.save()
        .then(() => {
          res.status(201).json({ message: errorMessage["201"] });
        })
        .catch(error => {
          // Créer une erreur explicite avec un code 400
          const err = new Error(errorMessage["400"]);
          err.status = 400;
          next(err);  // Passe l'erreur à next pour qu'elle soit capturée et loggée
        });
    })
    .catch(error => {
      // Créer une erreur explicite avec un code 500
      const err = new Error(errorMessage["500"]);
      err.status = 500;
      next(err);  // Passe l'erreur à next pour qu'elle soit capturée et loggée
    });
};