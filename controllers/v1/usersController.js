const passport = require('passport');
const User = require('../../models/user');
const Verify = require('./verify');

/**
 * @swagger
 * definitions:
 *   LoginUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - email
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       email:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
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
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
module.exports.getAllUsers = function (req, res, next) {
  User.find().then((users) => {
    res.json(users);
  }).catch(next);
};

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     description: Register a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: Returns the user
 *         schema:
 *           $ref: '#/definitions/User'
 */
module.exports.register = function (req, res, next) {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) => {
      if (err) {
        console.log("err", err);
        if (user){
          user.remove();
        }
        return next(err);
      }
      if (req.body.firstName) {
        user.firstName = req.body.firstName;
      }
      if (req.body.lastName) {
        user.lastName = req.body.lastName;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      user.save().then((u) => {
        passport.authenticate('local')(req, res, function () {
          return res.status(201).json({
            status: 'Registration successful!',
            success: true,
            userId: u._id
          });
        });
      }).catch((e) => {
        user.remove().then().catch(next);
        next(e);
      });
    });
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: Login a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LoginUser'
 *     responses:
 *       200:
 *         description: Returns the user
 *         schema:
 *           $ref: '#/definitions/User'
 */
module.exports.login = function (req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    
    req.login(user, {session: false}, (error) => {
      if (error) {
        next(error)
      }
      
      const token = Verify.getToken(user);
      //return res.json({user, token});
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        //user: user
      });
    });
  })(req, res);
};

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of a user
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the user
 *         schema:
 *           $ref: '#/definitions/User'
 */
module.exports.getUserById = function (req, res, next) {
  User.findById(req.params.userId).then((user) => {
    res.json(user);
  }).catch(next);
};

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     description: Updates a specific project
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of a user
 *         required: true
 *         type: string
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the dataset
 *         schema:
 *           $ref: '#/definitions/User'
 */
module.exports.updateUser = function (req, res, next) {
  User.findByIdAndUpdate(req.params.userId, {
    $set: req.body
  }, {
    new: true
  }).then((user) => {
    res.status(200).json({
      status: 200,
      success: true,
      message: 'user successfully updated!',
      user: user
    });
  }).catch(next);
};

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of a user
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 */
module.exports.removeUser = function (req, res, next) {
  Team.findById(req.params.teamId).then((user) => {
    user.remove().then((u) => {
      res.status(200).json({
        status: 200,
        success: true,
        message: 'user successfully deleted!',
        user: u
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
