require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port =   process.env.PORT;


const userRoutes = require('./routes/user')

mongoose.connect(`mongodb+srv://endour:${process.env.MONGODB_PASSWORD}@cluster0.y6uux.mongodb.net/backend?retryWrites=true&w=majority&appName=Cluster0`,
    { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/auth', userRoutes);

app.listen(port, () => {
  console.log(`Static server served on port ${port}`);
});