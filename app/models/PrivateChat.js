var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kampbox');
var Schema = mongoose.Schema;

// define the schema for our user model
var privatechatsSchema = new Schema({

    message         : String,
    sender_username     : String,
    receiver_username         : String,
    created_at      : Date,
    updated_at      : Date


});

var PrivateChats = mongoose.model('PrivateChats', privatechatsSchema);

module.exports = PrivateChats;