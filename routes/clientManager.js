var async = require("async");
var model = require("../model");
var board = require("../board");

var clients={};

function sendMessage(gameId, player, event, data) {
    clients[player][gameId].emit(event, data);
}

function broadcastMessage(gameId, event, data) {
    var Game = model.mongoose.model('Game');

    Game.findOne({'guid' : gameId }, function (err, doc) {
        for (var i=0; i < doc.players.length; i++) {
            if (clients[doc.players[i].name] && clients[doc.players[i].name][doc.guid]) {
                clients[doc.players[i].name][doc.guid].emit(event, data);
            }
        };
    });
}

function manageConnection (socket) {
    function connectClient(socket, gameId, player) {

        if (clients[player]==undefined) {
            clients[player]={};
        }

        clients[player][gameId]= socket;
    }

    function disconnectClient(socket) {
        console.log("Client disconnected");
    }

    function placeTile(data) {
        board.placeTile(data.gameId, data.tile);

        broadcastMessage(data.gameId, 'updateBoard', data);
    }

    function initBoard(data) {
        var Game = model.mongoose.model('Game');

        connectClient(socket, data.guid, data.player);

        Game.findOne({'guid' : data.guid }, function (err, doc) {

            var result= {};
            result.opponents=[];

            for (var i=0; i < doc.players.length; i++) {
                if (doc.players[i].name==data.player) {
                    result.player = doc.players[i];
                } else {
                    result.opponents.push({
                        name: doc.players[i].name,
                        score: doc.players[i].score
                    });
                }
            }

            result.placedTiles = doc.placedTiles;
            result.currentPlayer = doc.currentPlayer;
            result.state = doc.state;
            result.winner = doc.winner;

            socket.emit('initialConfiguration', result);
        });
    }

    socket.on('init', initBoard);
    socket.on('place', placeTile);
    socket.on('disconnect', disconnectClient);
}

exports.newConnection = manageConnection;
exports.send = sendMessage;
exports.broadcast= broadcastMessage;