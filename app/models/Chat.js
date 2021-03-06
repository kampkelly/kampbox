var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/kampbox');
mongoose.connect('mongodb://kamp:sweetie@ds253468.mlab.com:53468/kampbox_mychat');
var Schema = mongoose.Schema;

// define the schema for our user model
var chatsSchema = new Schema({

    message         : String,
    chatroom_id     : String,
    user_id         : String,
    username        : String,
    group_id        : String,
    created_at      : Date,
    updated_at      : Date


});

var Chats = mongoose.model('Chats', chatsSchema);

module.exports = Chats;