
const express = require('express');
// const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
// const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer dans 15 minutes!'
});

app.use(limiter); // contre attaque brute force + ddos

// app.use(mongoSanitize()); // Contre NOSQL query injection

app.use(helmet()); // contre attaque xss

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require('./config/config-sequelize');

// app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use('/api/posts', postRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;