/*	A variable to keep track of where we are on the line
	0 = start, 1 = end */
var counter = 0;

/*	A boolean variable to keep track of the direction we want to travel in 
	true = move to the left, false move to the right */
var direction = true;

/*	First get a reference to the enclosing div and then to
	the 2 svg paths */
var svgContainer = document.getElementById("outerWrapper");
var ns = "http://www.w3.org/2000/svg";
var svg = svgContainer.getElementsByTagNameNS(ns, "path");
/*	the var 'svg' contains a reference to two paths so svg.length = 2
	svg[0] is the straight line and svg[1] is the curved lines */

/*	Now get the length of those two paths */
var straightLength = svg[0].getTotalLength();
var curveLength = svg[1].getTotalLength();

/*	Also get a reference to the two star polygons */
var stars = svgContainer.getElementsByTagName("polygon");

function moveStar() {
	/*	Check to see where the stars are journeys to determine 
		what direction they should be travelling in */
	if (parseInt(counter,10) === 1) {
		/* we've hit the end! */
		direction = false;
	} else if (parseInt(counter,10) < 0) {
		/* we're back at the start! */
		direction = true;
	}

	/*	Based on the direction variable either increase or decrease the counter */
	if (direction) {
		counter += 0.003;
	} else {
		counter -= 0.003;
	}

	/*	Now the magic part. We are able to call .getPointAtLength on the tow paths to return 
		the coordinates at any point along their lengths. We then simply set the stars to be positioned 
		at these coordinates, incrementing along the lengths of the paths */
	stars[0].setAttribute("transform","translate("+ (svg[0].getPointAtLength(counter * straightLength).x -15)  + "," + (svg[0].getPointAtLength(counter * straightLength).y -15) + ")");
	stars[1].setAttribute("transform","translate("+ (svg[1].getPointAtLength(counter * curveLength).x -15)  + "," + (svg[1].getPointAtLength(counter * curveLength).y -15) + ")");

	/*	Use requestAnimationFrame to recursively call moveStar() 60 times a second
		to create the illusion of movement */
	requestAnimationFrame(moveStar);
}
requestAnimationFrame(moveStar);