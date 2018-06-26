const express = require('express');
const teamsRouter = express.Router({mergeParams: true});
const teamsController = require('../../controllers/v1/teamsController');
const playersRouter = require('./playersRouter');
const Verify = require('../../controllers/v1/verify');

teamsRouter.route('/')
  .get(teamsController.getAllTeams)
  .post(Verify.verifyOrdinaryUser ,teamsController.createNewTeam);

teamsRouter.route('/:teamId')
  .get(teamsController.getTeamById)
  .put(teamsController.updateTeam)
  .delete(teamsController.removeTeam);

teamsRouter.use('/:teamId/players', playersRouter);

module.exports = teamsRouter;
