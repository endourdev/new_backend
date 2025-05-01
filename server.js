require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorMessage = require('./utils/messages.json');
const requestLogger = require('./middleware/requestLogger');
const errorLogger = require('./middleware/errorLogger');
const userRoutes = require('./routes/user');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
const port = process.env.PORT;

app.use(helmet());

const allowedOrigins = ['http://localhost:3000', 'https://erisium-pvp.fr'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: `${errorMessage["429"]}`,
});
app.use(limiter);

app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.y6uux.mongodb.net/backend?retryWrites=true&w=majority&appName=Cluster0`, {})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Connexion à MongoDB échouée :', err.message));

app.use(requestLogger);

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', userRoutes);
app.use('/api/password', passwordRoutes);

app.use(errorLogger);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});