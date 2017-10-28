var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kampbox');
var Schema = mongoose.Schema;

// define the schema for our user model
var chatroomSchema = new Schema({

    name            : String,
    description     : String,
    image           : String,
    created_at      : Date,
    updated_at      : Date


});

var Chatroom = mongoose.model('Chatroom', chatroomSchema);

module.exports = Chatroom;