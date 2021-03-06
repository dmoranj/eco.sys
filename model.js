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


var Tile = new Schema ({
    _id    : ObjectId
    , guid : String
    , dx : Number
    , dy : Number
    , left : String
    , right : String
    , bottom : String
    , top : String
});

var Card = new Schema ({
    _id    : ObjectId
    , consumes : [Number]
    , produces : [Number]
    , tiles    : [Tile]
    , x        : Number
    , y        : Number
    , id       : String
    , type     : String
    , owner    : String
    , score    : Number
});

var Player = new Schema ({
    _id    : ObjectId
    , name     : String
    , score      : Number
    , hand      : [Card]
});

var Game = new Schema({
    _id    : ObjectId
    , guid : String
    , title     : String
    , players      : [Player]
    , deck         : [Card]
    , placedTiles  : [Card]
    , currentPlayer : String
    , state        : String
    , winner        : String
});

var Invitation = new Schema({
    _id             : ObjectId,
    email           : String,
    guid            : String,
    availability    : Date
});

mongoose.model('User', User);
mongoose.model('Player', Player);
mongoose.model('Game', Game);
mongoose.model('Card', User);
mongoose.model('Tile', User);
mongoose.model('Invitation', Invitation);

exports.mongoose = mongoose;
