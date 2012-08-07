var Hand = function() {

	var tiles= {};

    var selectedTileId;



	return {
		enterTile: function () {
			$(this).animate({
				"width": "70px",
				"height": "150px",
				"margin-top": "-50px"
			}, 300);
		},
		
		leaveTile: function() {
			$(this).animate({
				"width": "50px",
				"height": "100px",
				"margin-top": "0px"
			}, 300);
		},
	
		drag: function (ev)
		{
            selectedTileId=ev.target.id;
            ev.dataTransfer.setData("Id", ev.target.id);
		},
		
		add: function(tile) {
			tiles[tile.id]=(tile);

            var tileTag = tile.drawCard();

            $("#tiles").append(tileTag);
		},
		
		remove: function(tile) {
			delete tiles[tile.id];
			
			$("#"+ tile.id).remove();
		},
		
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
        }
	};
}();