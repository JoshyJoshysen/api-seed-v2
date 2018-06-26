const express = require('express');
let apiRouter = express.Router();
let v1Router = require('./v1/v1Router');

apiRouter.use('/v1', v1Router);

module.exports = apiRouter;
