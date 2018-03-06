var mongoose = require('mongoose');
mongoose.connect('mongodb://kamp:sweetie@ds253468.mlab.com:53468/kampbox_mychat');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = new Schema({

    email        : String,
    password     : String,
    username     : String,
    avatar       : { type: String, default: 'placeholder.jpg' },
    country      : String, 
    mobile       : Number,
    age          : Number,
    admin        : Boolean,
    style        : { type: Number, default: 1 },
    created_at   : { type: Date, default: Date.now },
    updated_at   : Date

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;