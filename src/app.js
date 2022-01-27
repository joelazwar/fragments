// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');

const authorization = require('./authorization');
const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use logging middleware
app.use(pino);

// Use security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Set up our passport authorization middleware
passport.use(authorization.strategy());
app.use(passport.initialize());

// Define our routes
app.use('/', require('./routes'));

// Export our `app` so we can access it in server.js
module.exports = app;
// src/app.js
