var Hand = function() {

	var tiles= {};

    var selectedTileId;

    function removeCard(tile) {
        delete tiles[tile.id];

        $("#"+ tile.id).remove();
    }

    function addCard(tile) {
        tiles[tile.id]=(tile);

        var tileTag = tile.drawCard();

        $("#tiles").append(tileTag);
        tileTag.onmouseenter=Hand.enterTile;
        tileTag.onmouseleave=Hand.leaveTile;
    }

	return {
		enterTile: function () {
			$(this).stop().animate({
				"width": "70px",
				"height": "150px",
				"margin-top": "-50px"
			}, 200);
		},
		
		leaveTile: function() {
			$(this).stop().animate({
				"width": "50px",
				"height": "100px",
				"margin-top": "0px"
			}, 200);
		},
	
		drag: function (ev)
		{
            selectedTileId=ev.target.id;
            ev.dataTransfer.setData("Id", ev.target.id);
		},
		
		add: addCard,
		remove: removeCard,
		
		getTile: function(id) {
			return tiles[id];
		},

        getSelectedTileId: function() {
            return selectedTileId;
        },

        hide: function() {
            $("#tiles").css("display", "none");
        },

        show: function() {
            $("#tiles").css("display", "block");
        },

        renew: function() {
            $.post("/game/" + $("#guid")[0].value + "/action/drawHand", function(data) {
                for (var tile in tiles) {
                    removeCard(tiles[tile]);
                }

                for (var tile in data.newHand) {
                    addCard(new Tile(data.newHand[tile]));
                }
            });
        }
	};
}();