/**
 * Tiles represents the cards the user use to play. Each of this card
 * represents a board tile, that is composed of a group of squares.
 *
 * 		 id
 * 		 tiles
 * 		 consumes
 * 		 produces
 * 		 x
 * 		 y
 */
var Tile = function(data) {

	var marginConsumes = [2, 8];
	var marginProduces = [2, 2];
	var resourceDimensions = [15, 15];
	
	var resourceColor = {1: "#FF0000",
						 2: "#00FF00",
						 3: "#0000FF"
						 };

    data.draw = function(ctx, x, y, tileWidth, tileHeight) {
        var that = this;
        var drawn = [];

        var directions={top: {start: [0, 0], end: [tileWidth, 0]},
            bottom: {start: [0, tileHeight], end: [tileWidth, tileHeight]},
            right: {start: [tileWidth, 0], end: [tileWidth, tileHeight]},
            left: {start: [0, 0], end: [0, tileHeight]},};

        var drawShape= function (tile) {
            ctx.rect(x+ tile.dx*tileWidth,
                y+ tile.dy*tileHeight,
                tileWidth,
                tileHeight);

            drawn.push(tile.guid);

            for (direction in directions) {
                if (tile[direction] && drawn.indexOf(tile[direction]) < 0)
                    drawShape(that.tiles[tile[direction]]);
            }
        };

        var drawPerimeter = function(tile) {
            drawn.push(tile.guid);

            for (direction in directions) {
                if (tile[direction] && drawn.indexOf(tile[direction]) < 0)
                    drawPerimeter(that.tiles[tile[direction]]);

                if (tile[direction]==undefined) {
                    ctx.moveTo(x+ tile.dx*tileWidth + directions[direction].start[0], y+ tile.dy*tileHeight + directions[direction].start[1]);
                    ctx.lineTo(x+ tile.dx*tileWidth + directions[direction].end[0], y+ tile.dy*tileHeight + directions[direction].end[1]);
                }
            }
        };

        var drawNeeds = function() {
            var oldFillStyle = ctx.fillStyle;
            for (i in that.consumes) {
                ctx.beginPath();
                ctx.fillStyle = resourceColor[that.consumes[i]];
                ctx.rect(x + marginConsumes[0]*(i +2),
                    y + marginConsumes[1],
                    resourceDimensions[0],
                    resourceDimensions[1]);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = oldFillStyle;
        }

        var drawGrants = function(tile) {
            var oldFillStyle = ctx.fillStyle;
            for (i in that.produces) {
                ctx.beginPath();
                ctx.fillStyle = resourceColor[that.produces[i]];
                ctx.arc(x + marginProduces[0]*(i +7),
                    y + tileHeight - marginProduces[1] - resourceDimensions[1],
                    resourceDimensions[0]/2,
                    0*Math.PI,2*Math.PI);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = oldFillStyle;
        }

        ctx.fillStyle = "#AA33BB";
        ctx.beginPath();
        drawShape(this.tiles[0]);
        ctx.closePath();
        ctx.fill();

        drawNeeds();
        drawGrants();

        ctx.beginPath();
        ctx.strokeStyle="#FF0000";
        ctx.lineWidth=4;
        drawn = [];
        drawPerimeter(this.tiles[0]);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle="#000000";
        ctx.lineWidth=1;
    };

	return data;
};