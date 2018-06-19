var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cover: {
    type: String,
    data: Buffer,
    required: true
  },
  age: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});
// authenticate input against database documents
userSchema.statics.authenticate = function(username, password, callback){
  User.findOne({ username: username})
  .exec(function (error, user){
    if (error) {
      return callback(error);
    } else if ( !user ) {
    var err = new Error ('gebruiker niet gevonden.');
    err.status = 401;
    return callback(err);
}
      bcrypt.compare(password, user.password , function(error, result){
        if (result === true){
          return callback(null, user);
        } else {
          return callback();
        }
      })
  });
}
// hass password before saving to database
userSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    }
    user.password = hash;
    next();
  })
});
var User = mongoose.model('User', userSchema);
module.exports = User;
