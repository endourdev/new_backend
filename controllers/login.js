require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const errorMessage = require("../utils/messages.json");

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: errorMessage["401"] });
      }

      if (user.banned) {
        return res.status(403).json({ message: "Votre compte a été banni. Veuillez contacter le support." });
      }

      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: errorMessage["401"] });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              roles: user.role || []
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
        .catch(() => {
          return res.status(500).json({ message: errorMessage["500"] });
        });
    })
    .catch(() => {
      return res.status(500).json({ message: errorMessage["500"] });
    });
};