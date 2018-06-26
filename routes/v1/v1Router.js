const express = require('express');
let v1Router = express.Router();
const teamsRouter = require('./teamsRouter');
const playersRouter = require('./playersRouter');
const usersRouter = require('./usersRouter');
const mediaRouter = require('./mediaRouter');

v1Router.use('/teams', teamsRouter);
v1Router.use('/players', playersRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/media', mediaRouter);

module.exports = v1Router;
