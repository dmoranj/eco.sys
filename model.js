var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var User = new Schema({
    _id    : ObjectId
    , name     : String
    , email      : String
    , surname      : String
    , password      : String
});

mongoose.model('User', User);

exports.mongoose = mongoose;