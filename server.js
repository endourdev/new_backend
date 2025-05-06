require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
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

app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.183.6:3000', // Ton IP locale
  'https://erisium-pvp.fr',
  'https://r9c5gz06-3000.uks1.devtunnels.ms'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Vérifie si l'origine est autorisée
  if (
    allowedOrigins.includes(origin) ||
    origin?.startsWith('http://192.168.') // Autorise toutes les IP locales si besoin
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Headers standards CORS
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  // Répond aux requêtes préflight directement
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

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

app.get('/ip', (request, response) => response.send(request.ip))

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', userRoutes);
app.use('/api/password', passwordRoutes);

app.use(errorLogger);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});