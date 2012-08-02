var Hand = function() {

	var tiles= {};

    var selectedTileId;

	return {
		enterTile: function () {
			$(this).animate({
				"width": "60px",
				"height": "120px",
				"margin-top": "-50px"
			}, 300);
		},
		
		leaveTile: function() {
			$(this).animate({
				"width": "30px",
				"height": "60px",
				"margin-top": "0px"
			}, 300);
		},
	
		drag: function (ev)
		{
            selectedTileId=ev.target.id;
		},
		
		add: function(tile) {
			tiles[tile.id]=(tile);
			
			var tileTag = document.createElement("div"); 
			tileTag.id = tile.id;
			tileTag.className = "tile";
			tileTag.setAttribute("draggable", "true");
			tileTag.setAttribute("ondragstart", "Hand.drag(event)");
			tileTag.innerHTML=tile.id;
			
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
        }
	};
}();