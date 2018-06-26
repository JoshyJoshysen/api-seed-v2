const Team = require('../../models/team');
const User = require('../../models/user');

/**
 * @swagger
 * definitions:
 *   NewTeam:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       name:
 *         type: string
 *       country:
 *         type: string
 *       league:
 *         type: integer
 *   Team:
 *     allOf:
 *       - $ref: '#/definitions/NewTeam'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           createdAt:
 *             type: string
 *             format: date
 *           updatedAt:
 *             type: string
 *             format: date
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     tags:
 *       - Teams
 *     description: Returns all teams
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of teams
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Team'
 */
module.exports.getAllTeams = function(req, res, next) {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const sort = {};
  
  if (req.query.sort){
    sort[req.query.sort] = 'asc';
  }
  console.log("limit", limit);
  
  if (!isNaN(limit) && !isNaN(skip)){
    Team.find({})
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec((err, teams) => {
        if (err) throw err;
        res.status(200).json({
          status: 'Search successful!',
          success: true,
          result: teams,
          maxCount: 0
        });
      });
  } else {
    Team.find().then((teams) => {
      res.json(teams);
    }).catch(next);
  }
  
  
  /*Team.find().then((teams) => {
    res.json(teams);
  }).catch(next);*/
};

/**
 * @swagger
 * /teams:
 *   post:
 *     tags:
 *       - Teams
 *     description: Create a new Team
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: team
 *         description: Team object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewTeam'
 *     responses:
 *       200:
 *         description: Returns the team
 *         schema:
 *           $ref: '#/definitions/Team'
 */
module.exports.createNewTeam = function(req, res, next) {
  const userID = req.decoded._id;
  User.findById(userID).then((user) => {
    if (user.team){
      res.status(405).json({
        status: 405,
        success: false,
        message: 'Only one team allowed per user'
      });
    } else {
      Team.create(req.body).then((team) => {
        user.team = team._id;
        user.save().then(
          res.status(201).json({
            status: 201,
            success: true,
            message: 'team saved!',
            savedTeam: team
          })
        ).catch(next);
      }).catch(next);
    }
  }).catch(next);
};

/**
 * @swagger
 * /teams/{teamId}:
 *   get:
 *     tags:
 *       - Teams
 *     description: Returns a specific team
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: The ID of a team
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the team
 *         schema:
 *           $ref: '#/definitions/Team'
 */
module.exports.getTeamById = function(req, res, next) {
  Team.findById(req.params.teamId).then((team) => {
    res.json(team);
  }).catch(next);
};

/**
 * @swagger
 * /teams/{teamId}:
 *   put:
 *     tags:
 *       - Teams
 *     description: Updates a specific project
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: The ID of a team
 *         required: true
 *         type: string
 *       - name: team
 *         description: Team object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewTeam'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the dataset
 *         schema:
 *           $ref: '#/definitions/Team'
 */
module.exports.updateTeam = function(req, res, next) {
  Team.findByIdAndUpdate(req.params.teamId, {
    $set: req.body
  }, {
    new: true
  }).then((team) => {
    res.status(200).json({
      status: 200,
      success: true,
      message: 'team successfully updated!',
      team: team
    });
  }).catch(next);
};

/**
 * @swagger
 * /teams/{teamId}:
 *   delete:
 *     tags:
 *       - Teams
 *     description: Deletes a specific team
 *     parameters:
 *       - name: teamId
 *         in: path
 *         description: The ID of a team
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Team'
 */
module.exports.removeTeam = function(req, res, next) {
  Team.findById(req.params.teamId).then((team) => {
    team.remove().then((t) => {
      res.status(200).json({
        status: 200,
        success: true,
        message: 'team successfully deleted!',
        team: t
      });
    }).catch(next);
    /* if (user == city.createdBy) {
      city.remove(function (err, c) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json({
            status: 'city successfully deleted!',
            success: true,
            city: c
          });
        }
      })
    } else {
      res.status(500).json({
        status: 'User does not match the createdBy field',
        success: false
      });
    } */
  }).catch(next);
};