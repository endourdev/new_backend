require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const errorMessage = require("../utils/messages.json");

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: errorMessage[401] });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: errorMessage[401] });
                    }
                    res.status(200).json({
                        errorMessage: errorMessage[200],
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '30d' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: errorMessage[500] }));
        })
        .catch(error => res.status(500).json({ error: errorMessage[500] }));
}