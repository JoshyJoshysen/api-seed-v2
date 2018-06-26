const express = require('express');
const usersRouter = express.Router();
const usersController = require('../../controllers/v1/usersController');
const playersRouter = require('./playersRouter');
const teamsRouter = require('./teamsRouter');
const Verify = require('../../controllers/v1/verify');

usersRouter.route('/')
  .get(Verify.verifyOrdinaryUser, usersController.getAllUsers);

usersRouter.route('/register')
  .post(usersController.register);

usersRouter.route('/login')
  .post(usersController.login);

usersRouter.route('/:userId')
  .get(usersController.getUserById)
  .put(Verify.verifyOrdinaryUser, usersController.updateUser)
  .delete(Verify.verifyOrdinaryUser, usersController.removeUser);

usersRouter.use('/:userId/players', playersRouter);
usersRouter.use('/:userId/teams', teamsRouter);

module.exports = usersRouter;
