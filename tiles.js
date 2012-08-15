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
            tiles:shapes.l,
            score: 1
        }
    },
    2:function () {
        return {
            consumes:[1],
            produces:[2, 3],
            tiles:shapes.line,
            score: 3
        }
    },
    3:function () {
        return {
            consumes:[1, 2],
            produces:[2, 3],
            tiles:shapes.square,
            score: 10
        }
    },
    4:function () {
        return {
            consumes:[3],
            produces:[1, 2, 3],
            tiles:shapes.l,
            score: 5
        }
    },
    5:function () {
        return {
            consumes:[],
            produces:[2],
            tiles:shapes.line,
            score: 1
        }
    },
    6:function () {
        return {
            consumes: [1],
            produces: [2, 3],
            tiles: shapes.square,
            score: 3
        }
    }
};

var deckComposition = {
    1:5,
    2:3,
    3:3,
    4:5,
    5:10,
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

    console.log("Cards in the hand before : " + game.players[i].hand.length);
    var card = game.deck.pop();
    if (card) {
        card.owner = player;
        game.players[i].hand.push(card);
    }

    console.log("Drawing card for: " + player + " number of deck cards " + game.deck.length + " and hand cards " + game.players[i].hand.length);

    return card;
}

function drawHands(game, player) {
    for (var i=0; i < 7; i++) {
        drawCard(game, player);
    }
}

function removeCard(game, card) {
    players: for (var i in game.players) {
        if (game.players[i].name==card.owner) {
            for (var j in game.players[i].hand) {
                if (game.players[i].hand[j].id==card.id) {
                    game.players[i].hand.splice(j, 1);
                    return;
                }
            }

            break;
        }
    }
}

exports.generateDeck = createDeck;
exports.draw = drawCard;
exports.remove = removeCard;
exports.drawInitialHand = drawHands;
exports.getDeckComposition= function() {return deckComposition;}