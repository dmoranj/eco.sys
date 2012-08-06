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
						 3: "#0000FF",
                         4: "#FF00FF",
                         5: "#00FFFF",
                         6: "#FA00FA"
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

    data.drawSVGElements  = function() {
        var svgCode= '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">';

        for (var i in data.produces) {
            svgCode+= '<circle cx="'+ ((parseInt(i) + 1)*12);
            svgCode+= '" cy="30" r="5" stroke="black" stroke-width="1" fill="' + resourceColor[data.produces[i]];
            svgCode+= '" />';
        }

        for (var i in data.consumes) {
            svgCode+= '<rect x="'+ ((parseInt(i) + 0.5)*12);
            svgCode+= '" y="10" width="10" height="10" stroke="black" stroke-width="1" fill="' + resourceColor[data.consumes[i]];
            svgCode+= '" />';
        }

        for (var i in data.tiles) {
            svgCode+= '<rect x="'+ ((data.tiles[i].dx + 1)*12);
            svgCode+= '" y="' + (50 + (data.tiles[i].dy)*11) + '" ';
            svgCode+= ' width="10" height="10" stroke="black" stroke-width="1" fill="black" />';
        }

        svgCode+= '</svg>';

        return svgCode;
    };

    data.drawCard = function() {
        var tileTag = document.createElement("div");
        tileTag.id = data.id;
        tileTag.className = "tile";
        tileTag.setAttribute("draggable", "true");
        tileTag.setAttribute("ondragstart", "Hand.drag(event)");

        var svgCode= data.drawSVGElements();

        tileTag.innerHTML = svgCode;
        return tileTag;
    };

	return data;
};