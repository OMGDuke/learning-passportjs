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

  // SIGN UP
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

  // PROFILE
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // FACEBOOK
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // TWITTER
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

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
