var User = require('../models/User');
var Chatroom = require('../models/Chatroom');
var Chat = require('../models/Chat');
var PrivateChat = require('../models/PrivateChat');
var fileuploads = require('./fileuploads');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var db = mongoose.connect('mongodb://localhost:27017/kampbox', {
  useMongoClient: true
});
//var async = require("async");

var _this;
class ChatController {

	constructor(message, chatroomid, userid) {
		var self = this;
		_this = self;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
		//  console.log("Mongoose Chat controller initiated now!");
		});
	}

	showallchats(chatroomid) {
		// find all chats that have the incoming chatroom id and return it
		Chat.find({ chatroom_id: chatroomid }).exec(function(err, chats) {
			  if (err) throw err;
		//	console.log(chats);
			var all_chats = chats;
			var k = 'second';
			return k;
			});
	}

	savechat(req, auth, res) {
		//save incoming chat as message, chatroom_ud, user_id, group_id = null
		//then broadcast the message with socket.io
		// create a new chat
		var date = new Date();
		var newChat = Chat({
		  message: req.body.message,
		  chatroom_id: req.body.chatroom_id,
		  user_id: req.body.user_id,
		  username: auth.username,
		  group_id: req.body.group_id,
		  created_at: date,
		  updated_at: ''
		});
		newChat.save(function(err) { //save chat
		  if (err) throw err;
		  var error = newChat.validateSync();
		  console.log('Chat created!');
		  res.send('got it');
		});  
	}

	saveprivatechat(req, auth, res) {
		//save incoming chat as message, chatroom_ud, user_id, group_id = null
		//then broadcast the message with socket.io
		// create a new chat
		var date = new Date();
		var newPrivateChat = PrivateChat({
		  message: req.body.message,
		  sender_username: req.body.sender_username,
		  receiver_username: req.body.receiver_username,
		  created_at: date,
		  updated_at: ''
		});
		newPrivateChat.save(function(err) { //save chat
		  if (err) throw err;
		  var error = newPrivateChat.validateSync();
		  console.log('PrivateChat created!');
		  res.send('got it');
		});  
	}

}


module.exports = ChatController;