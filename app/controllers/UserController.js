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
var multer	=	require('multer');
var mime    =   require('mime');

var _this;
class UserController {
	constructor(name, email, password) {
		var self = this;
		_this = self;
		this.name = name;
		this.email = email;
		this.password = password;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
		//  console.log("Mongoose User controller initiated now!");
		});
	}

	index(res) {
		  User.find({}, function(err, users) {
			  if (err) throw err;
			//  res.send(users);
			  res.render('users/index', {users});
			  console.log(users);
			});
	}

	show(username, auth, res) {
		if(username == auth.username){
			return false;
		}
		//find the user
		//find the user chats
		async.waterfall([ //process functions synchronously
		      function (next) {
				  User.find({ username: username }).exec(function(err, user) {
				  	if (err) throw err;
				  	console.log('found user');
				  	next(null, user);
				  });   
		      },
		      	function next (user, callback){
			      PrivateChat.find({ $or : [{sender_username: auth.username, receiver_username: username},
			       {receiver_username: auth.username, sender_username: username}]
			      },function(err, chats) {
					  if (err) throw err;
					  console.log('found chats');
					  console.log(username);
					  console.log(auth.username);
				//	  console.log(user);
					  console.log(chats);
					   callback(null, user, chats);
				});
		      }
			], function callback (err, user, chats) {
				  	console.log('i am about to show private chats now');
				  	console.log(user[0].username);
				  	 console.log(chats);
				//   	res.render('chatrooms/show', {chatroom, chats, auth});
				   	var response = [chats, user, auth];
			  		res.send(response);
			});
	}

	profile(username, auth, res) {
		User.find({ username: username }).exec(function(err, user) {
		  	if (err) throw err;
		  	console.log('found this user');
		  	console.log(user);
		  	var response = [user, auth];
		  	res.send(response);
		  });   
	}

	saveprofile(req, auth, res) {
		var self = this;
			async.waterfall([ //process functions synchronously
				      function (next) {
				      	User.findOne( { username: { $eq: auth.username } } ).exec(function(err, user) {
				          	console.log('am trying to save');
				          	user.age = req.body.age;
				          	user.country = req.body.country;
				          	user.mobile = req.body.mobile;
				          	 if (req.file) {
				          		user.image = 'image';
				          	}
				          	console.log('am saving');
				          	user.save((err, user) => {
				          		console.log('sending save');
				              next(err, user);  
				               });
				          });  
				      },
				      function next (user, callback){
				      	 User.findById(auth._id)
				          .exec(function (err, user) {
				              callback(null, user);
				          });
				      }
				  ], function callback (err, user) {
				  	console.log('i have finished updating the user');
				  	res.send('saved');
				 //m  	res.redirect('/user/'+ user.username +'/profile');
				});
	}

	saveprofile_pic(req, auth, res) {
		var self = this;
		var Storage = multer.diskStorage({
		      destination: function (req, file, callback) {
		        callback(null, '/Users/Runor/nodejs_sites/kampbox/app/public/images/profile_pics');
		      },
		      filename: function (req, file, callback) {
		      	console.log(file.originalname);
		      	var originalname = file.originalname;
		      	originalname = originalname.substr(0, originalname.indexOf('.')); ///get filename before .extension
		      	var the_filename = originalname + '-' + Date.now() + '.' + mime.extension(file.mimetype);
		      	self.filename = the_filename;
		        callback(null, the_filename);
		      }
	      });
      var upload = multer({ storage : Storage }).single('my_profilepic');
      upload(req, res, function(err) {
	        if (err) throw err;
	        console.log('next to async');
	          	async.waterfall([ //process functions synchronously
				      function (next) {
				      	User.findOne( { username: { $eq: auth.username } } ) // ------> find chatroom with id of chatroom from request
				          .exec(function (err, user) { 
				          	console.log('am trying to save');
				          	 if (req.file) {
				          		user.avatar = self.filename;
				          	}
				          	user.save((err, user) => {
				              next(err, user);  
				               });
				          });  
				      },
				      function next (user, callback){
				      	console.log('am trying to retrieve');
				      	 User.findById(auth._id)
				          .exec(function (err, user) {
				              callback(null, user);
				          });
				      }
				  ], function callback (err, user) {
				  	console.log('i have received');
				   	res.redirect('/allchatrooms#/user/'+ user.username +'/profile');
				});
	    });
	}

	search(req, auth, res) {
	//	User.find({'username' : new RegExp(req.query, 'i')}, function(err, users){
		console.log(req.body.query);
	//	User.find({'username' : '/'+req.body.query+'/i'}, function(err, users){
		User.find({'username' : new RegExp(req.body.query, 'i')}, function(err, users){
		    console.log(users);
			var response = users;
			res.send(response);
		});
		
		//res.send(auth.username);
	}

	showthisuser(auth, res) {
		console.log('aaalamlalk');
		User.findOne( { username: { $eq: auth.username } } ).exec(function(err, user) {
			console.log(user);
			console.log('aaalamlalk');
			var response = user;
		  	res.send(response);
		});
	}

	destroy(id, req, res) {
		User.findByIdAndRemove(id, function(err) {
		  if (err) throw err;
		  console.log('User deleted!');
		  res.redirect('/show_users');
		});
	}

}


module.exports = UserController;