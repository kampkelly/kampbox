var mongoose = require('mongoose');
mongoose.connect('mongodb://kamp:sweetie@ds253468.mlab.com:53468/kampbox_mychat');
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