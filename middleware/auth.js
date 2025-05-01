require('dotenv').config();
const jwt = require('jsonwebtoken');
const errorMessage = require("../utils/messages.json");

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       const userId = decodedToken.userId;
       const roles = decodedToken.roles || [];  // Extrait les rôles du token

       req.auth = {
           userId: userId,
           roles: roles,  // Ajoute les rôles à req.auth
       };
       next();
   } catch(error) {
       res.status(401).json({ error: errorMessage[401] });
   }
};