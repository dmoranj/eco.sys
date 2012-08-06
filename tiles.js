var utils = require('./utils')


var shapes = {
    l:[
        {guid:0, dx:0, dy:0, right:1, bottom:2},
        {guid:1, dx:1, dy:0, left:0},
        {guid:2, dx:0, dy:1, top:0}
    ],
    line:[
        {guid:0, dx:0, dy:0, right:1},
        {guid:1, dx:1, dy:0, left:0, right:2},
        {guid:2, dx:2, dy:0, left:1}
    ],
    square:[
        {guid:0, dx:0, dy:0, right:1, bottom:2},
        {guid:1, dx:1, dy:0, left:0, bottom:3},
        {guid:2, dx:0, dy:1, top:0, right:3},
        {guid:3, dx:1, dy:1, left:2, top:1}
    ]
};

var cardTemplates = {
    1:function () {
        return {
            consumes:[],
            produces:[1],
            tiles:shapes.l
        }
    },
    2:function () {
        return {
            consumes:[1],
            produces:[2, 3],
            tiles:shapes.line
        }
    },
    3:function () {
        return {
            consumes:[1, 2],
            produces:[3],
            tiles:shapes.square
        }
    },
    4:function () {
        return {
            consumes:[3],
            produces:[1, 2, 3],
            tiles:shapes.l
        }
    },
    5:function () {
        return {
            consumes:[],
            produces:[2],
            tiles:shapes.line
        }
    },
    6:function () {
        return {
            consumes: [1, 3],
            produces: [2],
            tiles: shapes.square
        }
    }
};

var deckComposition = {
    1:3,
    2:3,
    3:3,
    4:5,
    5:5,
    6:5
};

function createDeck() {
    var deck = [];
    for (var type in deckComposition) {
        var i;
        for (i = 0; i < deckComposition[type]; i++) {
            var newCard = cardTemplates[type]();
            newCard.id = utils.getUUID();
            newCard.type= type;
            deck.push(newCard);
        }
    }

    deck.sort(function(a, b) {
        return Math.random() -0.5;
    });

    return deck;
}

function drawCard(game, player) {
    var playerIndex;

    for (var i in player) {
        if (game.players[i].name==player) {
            playerIndex = i;
            break;
        }
    }
    var card = game.deck.pop();
    card.owner = player;
    game.players[i].hand.push(card);
}

function drawHands(game, player) {
    for (var i=0; i < 7; i++) {
        drawCard(game, player);
    }
}

exports.generateDeck = createDeck;
exports.draw = drawCard;
exports.drawInitialHand = drawHands;
exports.getDeckComposition= function() {return deckComposition;}