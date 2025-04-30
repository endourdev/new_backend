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
          .then(() => res.status(201).json({ message: errorMessage[201] }))
          .catch(error => res.status(400).json({ error: errorMessage[400] }));
      })
      .catch(error => res.status(500).json({ error: errorMessage[500] }));
  };