var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitchStrategy = require('passport-twitch').Strategy;

var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Local Sign up
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({
        'local.email': email
      }, function(err, user) {
        if(err) {
          return done(err);
        }
        if(user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
        } else {
          var newUser = new User();

          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      }
    )
    })
  }));

  //Local Login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({
      'local.email' : email
    }, function(err, user) {
      if(err) {
        return done(err);
      } else if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found '));
      } else if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
      return done(null, user);
    });
  }));

  //Facebook signup
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'emails', 'name'],
    passReqToCallback: true
  }, function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if(!req.user) {
        User.findOne({
          'facebook.id': profile.id
        }, function(err, user) {
          if(err) {
            return done(err);
          } else if (user) {
            return done(null, user);
          } else {
            var newUser = new User();

            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function(err) {
              if(err) {
                throw err;
              }
              return done(null, newUser)
            });
          }
        })
      } else {
        var user = req.user;

        user.facebook.id = profile.id;
        user.facebook.token = token;
        user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;

        user.save(function(err) {
          if(err) {
            throw err;
          }
          return done(null, user);
        }) ;
      }
    });
  }));

  // Twitter signup
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackUURL: configAuth.twitterAuth.callbackURL
  }, function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({
        'twitter.id': profile.id
      }, function(err, user) {
        if(err) {
          return done(err);
        } else if (user) {
          return done(null, user);
        } else {
          var newUser = new User();

          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.displayName = profile.displayName;

          newUser.save(function(err) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if(err) {
          return done(err);
        } else if (user) {
          return done(null, user);
        } else {
          var newUser = new User;
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;

          newUser.save(function(err) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // TWITCH
  passport.use(new TwitchStrategy({
    clientID: configAuth.twitchAuth.clientID,
    clientSecret: configAuth.twitchAuth.clientSecret,
    callbackURL: configAuth.twitchAuth.callbackURL,
    scope: "user_read"
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({
        'twitch.id': profile.id
      }, function(err, user) {
        if(err) {
          return done(err);
        } else if (user) {
          return done(null, user);
        } else {
          var newUser = new User;
          newUser.twitch.id = profile.id;
          newUser.twitch.accessToken = accessToken;
          newUser.twitch.refreshToken = refreshToken;
          newUser.twitch.username = profile.username;
          newUser.twitch.email = profile.email;

          newUser.save(function(err) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));
};
