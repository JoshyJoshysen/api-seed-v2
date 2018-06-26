const Player = require('../../models/player');
const Team = require('../../models/team');
const User = require('../../models/user');

/**
 * @swagger
 * definitions:
 *   NewPlayer:
 *     type: object
 *     required:
 *       - firstName
 *       - lastName
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *   Player:
 *     allOf:
 *       - $ref: '#/definitions/NewPlayer'
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
 * /players:
 *   get:
 *     tags:
 *       - Players
 *     description: Returns all players
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of players
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Player'
 */

/**
 * @swagger
 * /teams/{teamId}/players:
 *   get:
 *     tags:
 *       - Players
 *     description: Returns all players of team
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
 *         description: An array of players of a team
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Player'
 */
module.exports.getAllPlayers = function (req, res, next) {
  //if nested request
  if (req.params.teamId) {
    Team.findById(req.params.teamId).then((team) => {
      const players = team.players;
      res.json(players);
    }).catch(next);
  } else if (req.params.userId) {
    User.findById(req.params.userId).then((user) => {
    
    }).catch(next);
  } else {
    Player.find().then((players) => {
      res.json(players);
    }).catch(next);
  }
};

/**
 * @swagger
 * /players:
 *   post:
 *     tags:
 *       - Players
 *     description: Create a new player
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: player
 *         description: Player object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewPlayer'
 *     responses:
 *       200:
 *         description: Returns the player
 *         schema:
 *           $ref: '#/definitions/Player'
 */
module.exports.createNewPlayer = function (req, res, next) {
  const userID = req.decoded._id;
  User.findById(userID).then((user) => {
    if (user.team) {
      Team.findById(user.team).then((team) => {
        Player.create(req.body).then((player) => {
          team.players.push(player._id);
          team.save().then((t) => {
            res.status(201).json({
              status: 201,
              success: true,
              message: 'player saved!',
              savedPlayer: player
            });
          }).catch(next);
        }).catch(next);
      }).catch(next);
    } else {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'No teamId provided. Please create a team first!'
      });
    }
  }).catch(next);
};

/**
 * @swagger
 * /players/{playerId}:
 *   get:
 *     tags:
 *       - Players
 *     description: Returns a specific player
 *     parameters:
 *       - name: playerId
 *         in: path
 *         description: The ID of a player
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the player
 *         schema:
 *           $ref: '#/definitions/Player'
 */
module.exports.getPlayerById = function (req, res, next) {
  Player.findById(req.params.playerId).then((player) => {
    res.json(player);
  }).catch(next);
};

/**
 * @swagger
 * /players/{playerId}:
 *   put:
 *     tags:
 *       - Players
 *     description: Updates a specific player
 *     parameters:
 *       - name: playerId
 *         in: path
 *         description: The ID of a player
 *         required: true
 *         type: string
 *       - name: player
 *         description: Player object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewPlayer'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the dataset
 *         schema:
 *           $ref: '#/definitions/Player'
 */
module.exports.updatePlayer = function (req, res, next) {
  Player.findByIdAndUpdate(req.params.playerId, {
    $set: req.body
  }, {
    new: true
  }).then((player) => {
    res.status(200).json({
      status: 200,
      success: true,
      message: 'player successfully updated!',
      player: player
    });
  }).catch(next);
};

/**
 * @swagger
 * /players/{playerId}:
 *   delete:
 *     tags:
 *       - Players
 *     description: Deletes a specific player
 *     parameters:
 *       - name: playerId
 *         in: path
 *         description: The ID of a player
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Player'
 */
module.exports.removePlayer = function (req, res, next) {
  Player.findById(req.params.playerId).then((player) => {
    player.remove().then((p) => {
      res.status(200).json({
        status: 200,
        success: true,
        message: 'player successfully deleted!',
        player: p
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