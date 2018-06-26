const express = require('express');
const playersRouter = express.Router({mergeParams: true});
const playersController = require('../../controllers/v1/playersController');
const Verify = require('../../controllers/v1/verify');

playersRouter.route('/')
  .get(playersController.getAllPlayers)
  .post(Verify.verifyOrdinaryUser, playersController.createNewPlayer);

playersRouter.route('/:playerId')
  .get(playersController.getPlayerById)
  .put(Verify.verifyOrdinaryUser, playersController.updatePlayer)
  .delete(Verify.verifyOrdinaryUser, playersController.removePlayer);

module.exports = playersRouter;
