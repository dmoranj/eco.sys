var tiles= require("../tiles")
var assert = require("assert")


describe('tiles', function(){
    describe('#generateDeck()', function(){
        it('should create a deck with the right composition', function(done){
            // Given
            var expectedComposition= tiles.getDeckComposition();

            // When
            var deck= tiles.generateDeck();

            // Then
            var realComposition= {};
            for (var i in deck) {
                if (realComposition[deck[i].type]==undefined)
                    realComposition[deck[i].type]=1;
                else
                    realComposition[deck[i].type]++;
            }

            for (var type in expectedComposition)
                assert.equal(expectedComposition[type], realComposition[type]);

            done();
        })

        it('should generate enough cards', function(done){

            // Given
            var composition= tiles.getDeckComposition();
            var totalLength = 0;

            for (var type in composition) {
                totalLength+=composition[type];
            }

            // When
            var deck= tiles.generateDeck();

            // Then
            assert.equal(deck.length, totalLength);
            done();
        })


        it('should create cards with a unique ID', function(done){
            // When
            var deck= tiles.generateDeck();

            // Then
            var ids = [];
            for (var i in deck) {
                assert.equal(true, ids.indexOf(deck[i].id) < 0);
                ids.push(deck[i].id);
            }

            done();
        })
    })

    describe('#removeCard()', function(){
        it('should remove the selected card from the players hand', function(done){
            // Given
            var game = {
                players: [
                    {
                        name: "test1",
                        hand: [
                            { id: 'card_1_1' },
                            { id: 'card_1_2' }
                        ]
                    },
                    {
                        name: "test2",
                        hand: [
                            { id: 'card_2_1' },
                            { id: 'card_2_2' }
                        ]
                    }
                ]
            };

            // When
            tiles.remove(game, "test1", { id: 'card_1_2' });

            // Then
            assert.equal(game.players[0].hand.length, 1);
            assert.equal(game.players[0].hand[0].id, 'card_1_1');
            assert.equal(game.players[1].hand.length, 2);

            done();
        })
    })

    describe('#drawCard()', function(){
        var game;

        beforeEach(function(done){
            game = {
                deck: [
                    { consumes: [],
                        produces: [ 1 ],
                        tiles: [ [Object], [Object], [Object] ],
                        id: '792c5063b15246718a3eb7542534dc83',
                        type: '1' },
                    { consumes: [ 1 ],
                        produces: [ 2, 3 ],
                        tiles: [ [Object], [Object], [Object] ],
                        id: 'dc4d7077df674894969a57c67911b77f',
                        type: '2' },
                    { consumes: [],
                        produces: [ 1 ],
                        tiles: [ [Object], [Object], [Object] ],
                        id: '75b41e805ad140e3bfd22439f6d15494',
                        type: '1' },
                    { consumes: [ 3 ],
                        produces: [ 1, 2, 3 ],
                        tiles: [ [Object], [Object], [Object] ],
                        id: '070abdc6ebfb4a82ad1db9e450fb7550',
                        type: '4' },
                    { consumes: [],
                        produces: [ 2 ],
                        tiles: [ [Object], [Object], [Object] ],
                        id: 'f38f1b56150a4d618a4c78c6d45cebb7',
                        type: '5' },
                    { consumes: [ 3 ],
                        produces: [ 1, 2, 3 ],
                        tiles: [ [Object], [Object], [Object] ],
                        id: 'bac8d0dc819f4f93b00aa0a76481c8b5',
                        type: '4' }
                ],
                players: [
                    {
                        name: "test1",
                        score: 0,
                        hand: []
                    },
                    {
                        name: "test2",
                        score: 0,
                        hand: []
                    }
                ]
            };

            done();
        })

        it('should remove a card from the deck', function(done){
            // Given
            assert.equal(game.deck.length, 6);

            // When
            tiles.draw(game, "test2");

            // Then
            assert.equal(game.deck.length, 5);

            done();
        })

        it('should add the new card only to the selected players hand', function(done){
            // When
            tiles.draw(game, "test2");

            // Then
            assert.equal(game.players[0].hand.length, 0);
            assert.equal(game.players[1].hand.length, 1);

            done();
        })

        it('should add a owner property to the drawn card', function(done){
            // When
            tiles.draw(game, "test2");

            // Then
            assert.equal(game.players[1].hand[0].owner, "test2");

            done();
        })
    })
})

