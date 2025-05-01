const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/log.txt');

const requestLogger = (req, res, next) => {
  const logData = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  };

  const logLine = `${JSON.stringify(logData)}\n`;

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error('Erreur lors de l’écriture dans le fichier log :', err);
    }
  });

  next();
};

module.exports = requestLogger;