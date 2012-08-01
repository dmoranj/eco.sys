$(document).ready(function (){
	
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
	
	Hand.add(new Tile(1, shape1, [], [1]));
	Hand.add(new Tile(2, shape2, [1], [2, 3]));
	Hand.add(new Tile(3, shape3, [1, 2], [3]));
	Hand.add(new Tile(4, shape1, [3], [1, 2, 3]));
	Hand.add(new Tile(5, shape2, [], [2]));
	Hand.add(new Tile(6, shape3, [1, 3], [2]));
	
	$(".tile").mouseenter(Hand.enterTile);
	$(".tile").mouseleave(Hand.leaveTile);
});