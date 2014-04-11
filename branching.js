var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//Lets resize the canvas to occupy the full page
var W = window.innerWidth;
var H = window.innerHeight;
canvas.width = W;
canvas.height = H;
var stopDrawing = false;
var makeBranch = function(mouseCoords){

	//Some variables
	var length, divergence, reduction, line_width, start_points = [];

	init();

	function init() {
		//let's draw the trunk of the tree
		//let's randomise the variables
		//length of the trunk - 100-150
		length = 100 + Math.round(Math.random()*50);
		//angle at which branches will diverge - 10-60
		divergence = 10 + Math.round(Math.random()*50);
		//Every branch will be 0.75times of the previous one - 0.5-0.75
		//with 2 decimal points
		reduction = Math.round(50 + Math.random()*20)/100;
		//width of the branch/trunk
		line_width = Math.round(Math.random() * 10);

		//This is the end point of the trunk, from where branches will diverge
    var first_start_points = make_trunk();
		var trunk = {x: mouseCoords.x, y: mouseCoords.y, angle: 90};
		branches(first_start_points);
	}

  function make_trunk() {
		var trunk = {x: mouseCoords.x, y: mouseCoords.y, angle: 90};
		//It becomes the start point for branches
		var start_points = []; //empty the start points on every init();
		start_points.push(trunk);

		//ctx.beginPath();

		//ctx.moveTo(trunk.x, H);
		//ctx.lineTo(trunk.x, trunk.y);
    //// randomize color
    //var rgb = hsv_to_rgb(Math.random(), Math.random(), 0.95);
    //ctx.strokeStyle = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
		//ctx.lineWidth = line_width;
		//ctx.stroke();
    return start_points;
  }

	//Lets draw the branches now
	function branches(start_points) {
		//reducing line_width and length
		length = length * reduction;
		line_width = line_width - Math.round(Math.random() * 10);
		ctx.lineWidth = line_width;

		var new_start_points = [];
		ctx.beginPath();
		for(var i = 0; i < start_points.length; i++)
		{
			var sp = start_points[i];
			//2 branches will come out of every start point. Hence there will be
			//2 end points. There is a difference in the divergence.
			var ep1 = get_endpoint(sp.x, sp.y, sp.angle+divergence, length);
			var ep2 = get_endpoint(sp.x, sp.y, sp.angle-divergence, length);


      //drawing the branches now
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(ep1.x, ep1.y);
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(ep2.x, ep2.y);
			//Time to make this function recursive to draw more branches
			ep1.angle = sp.angle+divergence;
			ep2.angle = sp.angle-divergence;

			new_start_points.push(ep1);
			new_start_points.push(ep2);
		}

    // randomize color
    var rgb = hsv_to_rgb(Math.random(), Math.random(), 0.95);
    ctx.strokeStyle = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";

		ctx.stroke();
		//recursive call - only if length is more than 2.
		//Else it will fall in an long loop
		if (!stopDrawing || length > 2) {
      window.setTimeout(function() {branches(new_start_points)}, 50);
    }
	}

	function get_endpoint(x, y, a, length) {
		//This function will calculate the end points based on simple vectors
		//http://physics.about.com/od/mathematics/a/VectorMath.htm
		//You can read about basic vectors from this link
		var epx = x + length * Math.cos(a*Math.PI/180);
		var epy = y + length * Math.sin(a*Math.PI/180);
		return {x: epx, y: epy};
  }
};

canvas.addEventListener("mouseup", function(clickEvent) {
  stopDrawing = true;
});
canvas.addEventListener("mousedown", function(clickEvent) {
  stopDrawing = false;
  var mouseCoords = relMouseCoords(clickEvent, canvas);
  makeBranch(mouseCoords);
});

var clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, W, H);
});

var relMouseCoords = function(clickEvent, el){
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;

  do{
      totalOffsetX += el.offsetLeft;
      totalOffsetY += el.offsetTop;
  }
  while(el = el.offsetParent)

  canvasX = clickEvent.pageX - totalOffsetX;
  canvasY = clickEvent.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}

var hsv_to_rgb = function(h, s, v) {
  var h_i = parseInt(h*6);
  var f = h*6 - h_i;
  var p = v * (1 - s);
  var q = v * (1 - f*s);
  var t = v * (1 - (1 - f) * s);
  var r;
  var g;
  var b;
  if (h_i==0) {
    r = v;
    g = t;
    b = p;
  }
  if (h_i==1) {
    r = q;
    g = v;
    b = p;
  }
  if (h_i == 2) {
    r = p;
    g = v;
    b = t;
  }
  if (h_i == 3) {
    r = p;
    g = q;
    b = v;
  }
  if (h_i == 4) {
    r = t;
    g = p;
    b = v;
  }
  if (h_i == 5) {
    r = v;
    g = p;
    b = q;
  }
  return {r: parseInt(r * 256), g: parseInt(g * 256), b: parseInt(b * 256)};
};
