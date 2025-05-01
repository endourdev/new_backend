const fs = require('fs');
const path = require('path');

// Charger le JSON de status messages
const statusMessages = require('../utils/messages.json');

const errorLogPath = path.join(__dirname, '../logs/error.txt');

const errorLogger = (err, req, res, next) => {
  // S'assurer qu'on renvoie un code d'erreur (par défaut 500)
  const status = res.statusCode >= 400 ? res.statusCode : 500;

  const logEntry = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status,
    statusMessage: statusMessages[status.toString()] || 'Erreur inconnue',
    error: {
      message: err.message,
      stack: err.stack
    }
  };

  const logLine = `${JSON.stringify(logEntry, null, 2)}\n`;

  fs.appendFile(errorLogPath, logLine, (fsErr) => {
    if (fsErr) {
      console.error('Erreur lors de l’écriture dans le fichier d’erreurs :', fsErr);
    }
  });

  res.status(status).json({
    message: statusMessages[status.toString()] || "Une erreur est survenue."
  });
};

module.exports = errorLogger;