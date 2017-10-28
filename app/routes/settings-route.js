var express = require('express');
var User = require('../controllers/UserController');
var Chatroom = require('../controllers/ChatroomController');
var Chat = require('../controllers/ChatController');
var Setting = require('../controllers/SettingController');
var passport = require('passport');
var router = express.Router();

var User = new User();
var Chatroom = new Chatroom();
var Chat = new Chat();
var Setting = new Setting();

router.post('/changetheme', isLoggedIn, function(req, res) {
    Setting.changetheme(req, req.user, res);
});

router.post('/get_this_user', isLoggedIn, function(req, res) {
    User.showthisuser(req.user, res);
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/signin');
}



module.exports = router;