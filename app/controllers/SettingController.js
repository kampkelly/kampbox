var User = require('../models/User');
var Chatroom = require('../models/Chatroom');
var Chat = require('../models/Chat');
var PrivateChat = require('../models/PrivateChat');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://kamp:sweetie@ds253468.mlab.com:53468/kampbox_mychat', {
  useMongoClient: true
});
var async = require("async");
var assert = require('assert'); 
var path = require('path');

var _this;
class SettingController {
	constructor(background) {
		var self = this;
		_this = self;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
		//  console.log("Mongoose User controller initiated now!");
		});
	}

	changetheme(req, auth, res) {
		var self = this;
		async.waterfall([ //process functions synchronously
		      function (next) {
		      	User.findOne( { username: { $eq: auth.username } } ).exec(function(err, user) {
		          	console.log('am trying to save');
		          	user.style = req.body.background;
		          	user.save((err, user) => {
		          		console.log('sending save');
		              next(err, user);  
		               });
		          });  
		      },
		      function next (user, callback){
		      	 User.findById(auth._id)
		          .exec(function (err, user) {
		          	console.log(user.username);
		              callback(null, user);
		          });
		      }
		  ], function callback (err, user) {
		  	console.log('i have finished updating the user');
		  	console.log(user);
		  	var response = user;
		  	res.send(response);
		  //	var response = [user];
			// res.send(response);
		});
	}

}


module.exports = SettingController;