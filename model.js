var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ecosys');

var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var User = new Schema({
    _id    : ObjectId
    , name     : String
    , email      : String
    , surname      : String
    , password      : String
    , nickname      : String
});

var Player = new Schema ({
    _id    : ObjectId
    , name     : String
    , score      : String
});

var Game = new Schema({
    _id    : ObjectId
    , title     : String
    , players      : [Player]
});

mongoose.model('User', User);
mongoose.model('Player', Player);
mongoose.model('Game', Game);

exports.mongoose = mongoose;