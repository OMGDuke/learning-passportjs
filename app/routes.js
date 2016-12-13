module.exports = function(app, passport) {
  // HOME PAGE
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // LOGIN
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // LOCAL SIGNUP
  app.get('/signup', function(req,res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // LOCAL CONNECT
  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/connect/local', passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/connect/local',
    failureFlash: true
  }));

  // FACEBOOK SIGNUP
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // FACEBOOK CONNECT
  app.get('/connect/facebook', passport.authorize('facebook', {
    scope: 'email'
  }));

  app.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // TWITTER SIGNUP
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // TWITTER CONNECT
  app.get('/connect/twitter', passport.authorize('twitter', {
    scope: 'email'
  }));

  app.get('/connect/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // GOOGLE SIGNUP
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // GOOGLE CONNECT
  app.get('/connect/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // TWITCH SIGNUP
  app.get('/auth/twitch', passport.authenticate('twitch'));

  app.get('/auth/twitch/callback', passport.authenticate('twitch', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // PROFILE
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // LOG OUT
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/')
  });

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }
}
