var express = require('express');
var User = require('../controllers/UserController');
var Chatroom = require('../controllers/ChatroomController');
var Chat = require('../controllers/ChatController');
var passport = require('passport');
var router = express.Router();

var User = new User();
var Chatroom = new Chatroom();
var Chat = new Chat();

router.post('/sendchatroom_message', isLoggedIn, function(req, res) {
    Chat.savechat(req, req.user, res);
});

router.post('/sendprivate_message', isLoggedIn, function(req, res) {
    Chat.saveprivatechat(req, req.user, res);
});

router.post('/user/:username', isLoggedIn, function(req, res) {
    User.show(req.params.username, req.user, res);
});

router.post('/user/:username/profile', isLoggedIn, function(req, res) {
    User.profile(req.params.username, req.user, res);
});

router.post('/saveprofile', isLoggedIn, function(req, res) {
    User.saveprofile(req, req.user, res);
});

router.post('/upload_profile_pic', isLoggedIn, function(req, res) {
    User.saveprofile_pic(req, req.user, res);
});

router.post('/search', isLoggedIn, function(req, res) {
    User.search(req, req.user, res);
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/signin');
}



module.exports = router;