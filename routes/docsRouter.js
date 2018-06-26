const express = require('express');
const docsRouter = express.Router();
const config = require('../config');

docsRouter.use('/api-docs', (req, res, next) => {
  res.render('index.html', { host: config.url });
});

module.exports = docsRouter;
