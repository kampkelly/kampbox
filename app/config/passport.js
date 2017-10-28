// config/passport.js
//to return an error in this page, the first option of return callback == err or the second option == false
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');
//var configAuth = require('./auth');  //delete if not needed

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    ///////local login strategy
     passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            console.log('am here');
          //  if (!user.validPassword(password))
            //    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            // all is well, return successful user
            return done(null, user);  //this indicates "yes this user can be logged in and do log him now"
        });

    }));


     //////local signup strategy
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var username = email.substr(0, email.indexOf('@'));
                var newUser = new User();
                newUser.email    = email;
                newUser.password = newUser.generateHash(password);
                newUser.username    = username;
            //    newUser.avatar    = '';
                newUser.country    = '';
                newUser.mobile    = '';
                newUser.age    = '';
                newUser.admin    = 0;
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });
        //whatever is puth here runs before user.findone above

    }));



};
