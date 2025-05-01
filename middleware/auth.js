require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorMessage = require("../utils/messages.json");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: errorMessage[401] });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    if (user.banned) {
      return res.status(403).json({ message: "Vous êtes banni de la plateforme." });
    }

    req.auth = {
      userId: userId,
      roles: decodedToken.roles || [],
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: errorMessage[401] });
  }
};