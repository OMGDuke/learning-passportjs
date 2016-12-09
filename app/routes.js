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

  // SIGN UP
  app.get('/signup', function(req,res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // PROFILE
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user
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
