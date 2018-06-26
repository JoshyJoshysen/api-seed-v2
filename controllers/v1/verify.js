//var User = require('../../models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../../config');

exports.getToken = function (user) {
  const userObj = JSON.parse(JSON.stringify(user));
  return jwt.sign(userObj, config.passport.secretKey, {
    expiresIn: 3600
  });
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.passport.secretKey, (err, decoded) => {
      if (err) {
        const err = new Error('Token is not valid, please log in again.');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    const err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = function (req, res, next) {
  if (req.decoded._doc.admin){
    next();
  } else {
    const err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
};