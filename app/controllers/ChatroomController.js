var User = require('../models/User');
var Chatroom = require('../models/Chatroom');
var Chat = require('../models/Chat');
var fileuploads = require('./fileuploads');
var ChatController = require('./ChatController');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
//var async = require('asyncawait/async');
var await = require('asyncawait/await');
var db = mongoose.connect('mongodb://localhost:27017/kampbox', {
  useMongoClient: true
});
var async = require("async");
var assert = require('assert'); 
var multer	=	require('multer');
var mime    =   require('mime');

var fileuploadmethods = new fileuploads();
var ChatControl = new ChatController();


var _this;
class ChatroomController extends fileuploads {
	constructor(chatrooms) {
		super();
		var self = this;
		_this = self;
		//retrieve all chatrooms
		Chatroom.find({}, function(err, chatrooms) {
		  if (err) throw err;
		//  console.log(chatrooms);
		  self.allchatrooms = chatrooms; //save the result of all chatrooms
		});
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
		//  console.log("Mongoose Chatroom User controller initiated now!");
		});
	}

	index(user, res) {
		  User.findById(user.id, function(err, user) {
			  if (err) throw err;
			//  res.send(users);
			console.log(_this.allchatrooms);
			var rooms = _this.allchatrooms;
			//  res.render('chatrooms', {user,rooms});
			var response = [rooms, user];
			  res.send(response);
			});
	}

	create(req, res) {
		this.name = req.body.name;
		this.description = req.body.description;
		this.image = 'image here';

		//save image
		var self = this;
		var Storage = multer.diskStorage({
		      destination: function (req, file, callback) {
		        callback(null, '/Users/Runor/nodejs_sites/kampbox/app/public/images/chatrooms');
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
		console.log('gotten here!!!!!!!!!!!!!');
      var upload = multer({ storage : Storage }).single('image');
        upload(req, res, function(err) {
	        if (err) throw err;

	        if (!req.file) {
	            res.send('no files');  return;  
	        } else {
	        	// create a new user
				var date = new Date();
				console.log(self.name);
				console.log('check here too  !!!!!!!!!!!!');
				console.log(req.body.name);
				var newChatroom = Chatroom({
				  name: req.body.name,
				  description: req.body.description,
				  image: self.filename,
				  created_at: date,
				  updated_at: ''
				});

				newChatroom.save(function(err) { //save the user
				  if (err) throw err;
				  var error = newChatroom.validateSync();
				  console.log('Chatroom created!');
				  res.redirect('/allchatrooms');
				});  
				//end create new user
	          }
	    });
		//save image

		
	}

	show(id, auth, res) {
			async.waterfall([ //process functions synchronously
		      function (next) {
		      //	var chats = Chat.showallchats(id);
				  Chat.find({ chatroom_id: id }).exec(function(err, chats) {
				  	if (err) throw err;
				  	console.log('the chats shown below');
				  	next(null, chats);
				  });
				   
		      },
		      	function next (chats, callback){
			      Chatroom.findById(id, function(err, chatroom) {
					  if (err) throw err;
					   callback(null, chatroom, chats);
				});
		      }
			], function callback (err, chatroom, chats) {
				  	console.log('i am about to show now');
				//   	res.render('chatrooms/show', {chatroom, chats, auth});
				   	var response = [chatroom, chats, auth];
			  		res.send(response);
			});
	}

	edit(id, auth, res) {
		Chatroom.findById(id, function(err, chatroom) {
		  if (err) throw err;
		  res.render('chatrooms/edit', {chatroom, auth});
		});
	} 

	update(id, req, auth, res) {
		console.log('update action');
		var self = this;
		var Storage = multer.diskStorage({
		      destination: function (req, file, callback) {
		        callback(null, '/Users/Runor/nodejs_sites/kampbox/app/public/images/chatrooms');
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
      var upload = multer({ storage : Storage }).single('image');
      	upload(req, res, function(err) {
	        if (err) throw err;
	        	console.log('next to async');
	          	async.waterfall([ //process functions synchronously
				      function (next) {
				      	Chatroom.findOne( { _id: { $eq: id } } ) // ------> find chatroom with id of chatroom from request
				          .exec(function (err, chatroom) { 
				          	console.log('am trying to save');
				          	chatroom.name = req.body.name;
				          	chatroom.description = req.body.description;
				          	 if (req.file) {
				          		chatroom.image = self.filename;
				          	}
				          	chatroom.save((err, user) => {
				              next(err, chatroom);  
				               });
				          });  
				      },
				      function next (chatroom, callback){
				      	console.log('am trying to retrieve');
				      	 Chatroom.findById(id)
				          .exec(function (err, chatroom) {
				              callback(null, chatroom);
				          });
				      }
				  ], function callback (err, chatroom) {
				  	console.log('i have received');
				   	res.redirect('/allchatrooms#/chatroom/'+ id);
				});
	    });

	}

	upda(id, details, auth, res) {
		//copy image to path //
	//	var src = path.join(__dirname, details.image);
	/*	var src = path.join(__dirname, 'linux.txt');
		var destDir = path.join(__dirname, 'game.txt');
		 console.log('copying');
		fs.copyFileSync(src, destDir, (err) => {
	//	fs.copyFileSync('../models/linux.txt', 'line.txt', (err) => {
	//	fs.copyFileSync(`${details.image}`, `../public/${details.image}`, (err) => {
	//	fs.copyFileSync(details.image, `../public/${details.image}`, (err) => {
	//	fs.rename(details.image, `../public/${details.image}`, (err) => {
	//	fs.createReadStream(details.image).pipe(fs.createWriteStream(`../public/${details.image}`));
	//	  if (err) throw err;
		  console.log('image was copied to destination');
		}); */
		//create chatroom
		async.waterfall([ //process functions synchronously
		      function (next) {
		      	Chatroom.findOne( { _id: { $eq: id } } ) // ------> find chatroom with id of chatroom from request
		          .exec(function (err, chatroom) { 
		          	console.log('am trying to save');
		          	chatroom.name = details.name;
		          	chatroom.description = details.description;
		         // 	chatroom.image = details.image;
		          	chatroom.image = 'hola';
		          	chatroom.save((err, user) => {
		              next(err, chatroom);  
		               });
		          });  
		      },
		      function next (chatroom, callback){
		      	console.log('am trying to retrieve');
		      	 Chatroom.findById(id)
		          .exec(function (err, chatroom) {
		              callback(null, chatroom);
		          });
		      }
		  ], function callback (err, chatroom) {
		  	console.log('i have received');
		   	res.redirect('/chatroom/'+ id);
		});
	}

	des(id, req, res) {
		Chatroom.findByIdAndRemove(id, function(err) {
		  if (err) throw err;
		  console.log('Chatroom deleted!');
		  res.redirect('/chatrooms');
		});
	}

	destroy(id, req, res) {
		//async await
		var dele = async (function dele() {
		    var k = await ( Chatroom.findByIdAndRemove(id) );
		    console.log('Chatroom deleted!');
		  	var d = await ( res.redirect('/chatrooms') );
		});
		dele();
	}

}


module.exports = ChatroomController;