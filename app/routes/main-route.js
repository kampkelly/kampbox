var express = require('express');
var User = require('../controllers/UserController');
var Chatroom = require('../controllers/ChatroomController');
var passport = require('passport');
var router = express.Router();

var User = new User();
var Chatroom = new Chatroom();

//////////////////////////////////////////////vue routes
router.get('/allchatrooms', isLoggedIn, function(req, res) {
  res.render('SPA_Homepage', {auther: req.user});
});
//////////////////////////////////////////////vue routes

router.get('/notmobile', function(req, res) {
  res.render('notmobile', {user: 'game'});
});

router.get('/', function(req, res) {
  res.render('Homepage', {user: 'game'});
});

//////////////chatrooms
router.post('/chatrooms', isLoggedIn, function(req, res) {
	Chatroom.index(req.user, res);
  //res.render('chatrooms', {user: 'game'});
});

router.post('/chatroom/:id', isLoggedIn, function(req, res) {
    Chatroom.show(req.params.id, req.user, res);
});

router.get('/chatroom/new', isLoggedIn, function(req, res) {
  res.render('chatrooms/create', {user: 'game'});
});

router.get('/chatroom/:id/edit', isLoggedIn, function(req, res) {
    Chatroom.edit(req.params.id, req.user, res);
});

/*router.get('/chatroom/:id/edit', isLoggedIn, function(req, res) {
	Chatroom.index(req.user, res);
  //res.render('chatrooms', {user: 'game'});
}); */

router.post('/chatroom/:id', isLoggedIn, function(req, res) {
    Chatroom.update(req.params.id, req, req.user, res);
});

router.post('/new_chatroom', function(req, res) {
  Chatroom.create(req, res);
});

router.get('/chatroom/delete/:id', function(req, res) {
 	Chatroom.destroy(req.params.id, req.user, res);
});

//authetication routes below
//signup
router.get('/signup', isnotLoggedIn, function(req, res) {
  res.render('auth/signup', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/allchatrooms', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
 
//signin
router.post('/signin', passport.authenticate('local-login', {
    successRedirect : '/allchatrooms', // redirect to the secure profile section
    failureRedirect : '/signin', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/signin', isnotLoggedIn, function(req, res) {
  res.render('auth/signin', { message: req.flash('signinMessage') });
});

router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/offline', function(req, res) {
  res.render('offline', {user: 'game'});
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/signin');
  //  res.render('auth/signin', { message: req.flash('signupMessage') });
}

function isnotLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
   // if (req.isAuthenticated()) {
    if (!req.user) {
      return next();
    }
   //   return next();
 //   return next();
    // if they aren't redirect them to the home page
     res.redirect('/');
   // res.redirect('/');
  //  res.render('auth/signin', { message: req.flash('signupMessage') });
}



module.exports = router;
