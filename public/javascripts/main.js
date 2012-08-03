$(document).ready(function (){

    Server.init();
	GameBoard.init();
	
	var shape1 = [{guid: 0, dx: 0, dy:0, right: 1, bottom: 2},
	              {guid: 1, dx: 1, dy:0, left: 0},
	              {guid: 2, dx: 0, dy:1, top: 0}
	              ];
	
	var shape2 = [{guid: 0, dx: 0, dy:0, right: 1},
	              {guid: 1, dx: 1, dy:0, left: 0, right: 2},
	              {guid: 2, dx: 2, dy:0, left: 1}
	              ];
	
	var shape3 = [{guid: 0, dx: 0, dy:0, right: 1, top: 2},
	              {guid: 1, dx: 1, dy:0, left: 0},
	              {guid: 2, dx: 0, dy:-1, bottom: 0}
	              ];

    var player = document.getElementById("player").value;

	Hand.add(new Tile({
        id:         1,
        tiles:      shape1,
        consumes:   [],
        produces:   [1],
        owner: player
    }));

    Hand.add(new Tile({
        id:         2,
        tiles:      shape2,
        consumes:   [1],
        produces:   [2, 3],
        owner: player
    }));

    Hand.add(new Tile({
        id:         3,
        tiles:      shape3,
        consumes:   [1, 2],
        produces:   [3],
        owner: player
    }));

    Hand.add(new Tile({
        id:         4,
        tiles:      shape1,
        consumes:   [3],
        produces:   [1, 2, 3],
        owner: player
    }));

    Hand.add(new Tile({
        id:         5,
        tiles:      shape2,
        consumes:   [],
        produces:   [2],
        owner: player
    }));

    Hand.add(new Tile({
        id:         6,
        tiles:      shape1,
        consumes:   [1, 3],
        produces:   [2],
        owner: player
    }));

	$(".tile").mouseenter(Hand.enterTile);
	$(".tile").mouseleave(Hand.leaveTile);
});