var GameBoard = function() {
	
	/**
	 * Indicates the point in the endless board that is currently being drawn.
	 */
	var viewport = {x: 0, y: 0};
	
	/**
	 * Indicates the deviation in pixels from a exact tile division line (used
	 * to give the impression of continous movement).
	 */
	var dViewport = {x: 0, y: 0};
	
	/**
	 * Maximum number of squares that fit in the viewport.
	 */
	var maxViewportDimensions = {x: 20, y: 10};
	
	/**
	 * Horizontal and vertical dimensions of the tiles;
	 */
	var tileDimensions;
	
	/**
	 * Coordinates in the board of the selected square (board position not pixels).
	 */
	var selectedSquare;
	
	/**
	 * Map of all the tiles currently deployed on the board.
	 */
	var tiles = {};
	
	/**
	 * Reference to the canvas where the board will be drawn.
	 */
	var canvas;
	
	function cleanBoard(ctx) {
		ctx.fillStyle = "#FAF7F8";
		ctx.beginPath();
		ctx.rect(0,0, canvas.width, canvas.height);
		ctx.closePath();
		ctx.fill();
		
		var i, j;
		for (i=-1; i < maxViewportDimensions.x+1; i++) {
			ctx.moveTo(i*tileDimensions.x + dViewport.x, 0);
			ctx.lineTo(i*tileDimensions.x + dViewport.x, canvas.height);
		}
		
		for (i=0; i < maxViewportDimensions.y+1; i++) {
			ctx.moveTo(0, i*tileDimensions.y +  dViewport.y);
			ctx.lineTo(canvas.width, i*tileDimensions.y + dViewport.y);
		}
		
		ctx.stroke();
	}
	
	function drawPlayedTiles(ctx) {
		for (tile in tiles) {
			var xIni = (tiles[tile].x - viewport.x)*tileDimensions.x + dViewport.x;
			var yIni = (tiles[tile].y - viewport.y)*tileDimensions.y + dViewport.y;
			tiles[tile].draw(ctx, xIni, yIni, tileDimensions.x, tileDimensions.y);
		}
	}
	
	function draw() {
		var ctx=canvas.getContext("2d");
		cleanBoard(ctx);
		drawPlayedTiles(ctx);
	}
	
	function drawSelectedSquare(tileId) {
		var ctx=canvas.getContext("2d");
		
		var xIni = selectedSquare.x*tileDimensions.x + dViewport.x;
		var yIni = selectedSquare.y*tileDimensions.y + dViewport.y;
		
		Hand.getTile(tileId).draw(ctx, xIni, yIni, tileDimensions.x, tileDimensions.y);
	}
	
	function selectSquare(squareX, squareY, tileId) {
		newSelectedSquare = { x: Math.floor(squareX/tileDimensions.x),
				   			  y: Math.floor(squareY/tileDimensions.y)};
		
		if (!selectedSquare||
			 selectedSquare.x!=newSelectedSquare.x||
			 selectedSquare.y!=newSelectedSquare.y) {
				 
			selectedSquare=newSelectedSquare;
			draw();
			drawSelectedSquare(tileId);
		}
	}

    function sendTile(tile) {
        var socket = io.connect('http://localhost');
        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });
    }

	function add(tile) {
        if (tiles[tile.id]==undefined) {
            tiles[tile.id]=tile;
        }
	}
	
	function calculateBorderSquares(tile) {
		var visited= [];
		var borderSquares = [];
		var directions = {top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0]};
		
		function findBorder(square) {
			visited.push(square.guid);
			
			for (direction in directions) {
				if (square[direction]==undefined) {
					borderSquares.push([selectedSquare.x + viewport.x + square.dx + directions[direction][0], 
					                    selectedSquare.y + viewport.y + square.dy + directions[direction][1]]);
				} else if (visited.indexOf(square[direction]) < 0) {
					findBorder(tile.tiles[square[direction]])
				}
			} 
		}
		
		findBorder(tile.tiles[0]);
		
		return borderSquares;
	}
	
	function tilesOnSquares(squareSet) {

		var addedTiles= [];
		var results = [];
		
		for (i in tiles) {
			for (placedSquare in tiles[i].tiles) {
				squareLoop: for (square in squareSet)
					if (squareSet[square][0] == tiles[i].tiles[placedSquare].dx + tiles[i].x &&
						squareSet[square][1] == tiles[i].tiles[placedSquare].dy + tiles[i].y &&
						addedTiles.indexOf(tiles[i].id) < 0) {
						
						addedTiles.push(tiles[i].id);
						results.push(tiles[i]);
						break squareLoop;
					}
			}
		}
		
		return results;
	}
	
	function resourcesProducedBy(tiles) {
		
		var resources = {};
		
		for (i in tiles)
			for (j in tiles[i].produces) {
				if (resources[tiles[i].produces[j]]==undefined)
					resources[tiles[i].produces[j]]=0;
				
				resources[tiles[i].produces[j]]++;
			}
			
		return resources;
	}
	
	/**
	 * Determines whether the tile can be dropped in the current 
	 * selected square or not. A tile can be dropped in the board
	 * if it is connected to a sequence of tiles that fulfill its
	 * resource needs.
	 */
	function rightChoice(tile) {
		
		var borderSquares= calculateBorderSquares(tile);
		var adjacentTiles = tilesOnSquares(borderSquares);
		var producedResources = resourcesProducedBy(adjacentTiles);
		
		var needs = {};
		
		for (i in tile.consumes) {
			if (tile.consumes[i]==undefined) 
				needs[tile.consumes[i]] = 1;
			else
				needs[tile.consumes[i]]++;
		}
		
		for (need in needs)
			if (producedResources[need]==undefined || 
				needs[need] > producedResources[need]) 
				return false;
		
		return true;
	}
	
	/**
	 * Checks other pieces in the board to confirm that the new piece fits.
	 */
	function spaceAvailableFor(tile) {
		
		for (i in tile.tiles) {
			var squareToCheck = tile.tiles[i];
			
			for (j in tiles)
				for (k in tiles[j].tiles) {
					var placedSquare = tiles[j].tiles[k];
					
					if (squareToCheck.dx + selectedSquare.x + viewport.x == tiles[j].x - viewport.x + placedSquare.dx &&
						squareToCheck.dy + selectedSquare.y + viewport.y == tiles[j].y - viewport.y + placedSquare.dy	) 
						return false;
				}
		}
		
		return true;
	}

    function setScroll(scrollId, dx, dy) {
        var scrollTimer=null;

        $(scrollId).mouseenter(function(){
            scrollTimer= setInterval(function(){
                GameBoard.moveViewport(dx, dy);
            },100);
        });

        $(scrollId).mouseleave(function() {
            clearInterval(scrollTimer);
        });
    }

	return {
		init: function() {
			canvas= document.getElementById("canvasBoard");
			board= document.getElementById("board");
			canvas.height=board.clientHeight;
			canvas.width=board.clientWidth;
			tileDimensions= {x: canvas.width/maxViewportDimensions.x,
							 y:canvas.height/maxViewportDimensions.y};

            var scrollTimer=null;

            setScroll("#scrollLeft", 7, 0);
            setScroll("#scrollRight", -7, 0);
            setScroll("#scrollTop", 0, 7);
            setScroll("#scrollBottom", 0, -7);

            Server.addListener('updateBoard', function (data) {
                add(new Tile(data.tile));
                draw();
            });

            Server.send('init', {
                guid: $("#guid")[0].value,
                player: $("#player")[0].value
            });

            Server.addListener('initialConfiguration', function(data) {
                for (var i in data.player.hand)
                    Hand.add(new Tile(data.player.hand[i]));

                for (var i in data.placedTiles)
                    add(new Tile(data.placedTiles[i]));

                if (data.currentPlayer == $("#player")[0].value) {
                    Hand.show();
                } else {
                    Hand.hide();
                }

                draw();
            });

			draw();
		}, 
		
		moveViewport: function(dx, dy) {
			var changes = {x: dx, y: dy};
			for (coord in changes) {
				dViewport[coord] += changes[coord];
				if (dViewport[coord] < 0 ) {
					dViewport[coord] += tileDimensions[coord];
					viewport[coord]++;
				}
				
				viewport[coord] -= Math.floor(dViewport[coord]/tileDimensions[coord]);
				dViewport[coord] %= tileDimensions[coord];
			}
			
			draw();
		},
		
		over: function (ev)
		{
			ev.preventDefault();
			selectSquare(ev.layerX, ev.layerY, Hand.getSelectedTileId());
		},

		drop: function (ev)
		{
			ev.preventDefault();
			var tile = Hand.getTile(Hand.getSelectedTileId());
			
			selectSquare(ev.layerX, ev.layerY, tile.id);
			
			if (spaceAvailableFor(tile)&&rightChoice(tile)) {
				tile.x= selectedSquare.x + viewport.x;
				tile.y= selectedSquare.y + viewport.y;
                tile.owner= $("#player")[0].value;
				add(tile);
                Server.send("place", {tile: tile, gameId: $("#guid")[0].value});
				Hand.remove(tile);
                Hand.hide();
			} else {
				draw();
			}
		}	
	};
	
}();