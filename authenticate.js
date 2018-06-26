const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const config = require('./config');
const FacebookStrategy = require('passport-facebook').Strategy;

/*passport.use(new LocalStrategy(
  {session: false},
  function(username, password, done) {
    return User.findOne({username: username})
      .then(user => {
        if (!user) {
          return done(null, false, {message: 'Incorrect email or password.'});
        }
        return done(null, user, {message: 'Logged In Successfully'});
      })
      .catch(err => done(err));
  }
));*/

passport.use(User.createStrategy());

exports.facebook = passport.use(new FacebookStrategy({
    clientID: config.passport.facebook.clientID,
    clientSecret: config.passport.facebook.clientSecret,
    callbackURL: config.passport.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ OauthId: profile.id }, function(err, user) {
      if(err) {
        console.log(err); // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          username: profile.displayName
        });
        user.OauthId = profile.id;
        user.OauthToken = accessToken;
        user.save(function(err) {
          if(err) {
            console.error(err); // handle errors!
          } else {
            console.log("saving user "+user.username);
            done(null, user);
          }
        });
      }
    });
  }
));
