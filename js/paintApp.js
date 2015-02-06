var context;
var myCanvasHolder;
var myCanvas;
var mouseX = new Array();
var mouseY = new Array();
var mouseDrag = new Array();
var mouseColor = new Array();
var mouseSize = new Array();
var paint = false;
var color = 'black';
var radius = 1;
var imageLoader = null;


function renderCanvas() {
	console.log("inside render canvas");

	myCanvasHolder = document.getElementById("canvasHolder")
	myCanvas = $(myCanvasHolder).find("#myCanvas")
	imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
	//now create a convas element
	// the below approach if for IE-8 and below
	/*var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");*/

	//the below code works for all those browsers which accepts canvas tags
	context = document.getElementById("myCanvas").getContext("2d");

	/*
	context.moveTo(0,0);
	context.lineTo(100,100);
	context.lineTo(100,100);
	context.lineTo(200,100);
	context.lineTo(300,150);
	context.stroke();
	*/

	//our main input devce here is the mouse so register mouse events
	addMouseEvents();
}

function addMouseEvents() {
	//this method registers all mouse events

	//register mouse down
	$(myCanvasHolder).mousedown( function(e) {
		console.log("mouse down");
		paint = true;
		addClick(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
		redraw();
	});
	//register mouse moved
	$(myCanvasHolder).mousemove( function(e) {
		if(paint) {
			console.log("mouse dragged");
			addClick(e.clientX - this.offsetLeft, e.clientY - this.offsetTop, true);
			redraw();
		}
	});
	//register mouse released
	$(myCanvasHolder).mouseup( function() {
		paint = false
		console.log("mouse released");
	});
	//register mouse leaves the context
	$(myCanvasHolder).mouseleave( function() {
		paint = false;
		console.log("mouse left");
	});
}

//this method stores the mouse co ordinates. this will help us while re painting the entire canvas
function addClick(xPos, yPos, isDragging) {
	mouseX.push(xPos);
	mouseY.push(yPos);
	mouseDrag.push(isDragging);
	mouseColor.push(color);
	mouseSize.push(radius);
	$("#mouseX").html(xPos);
	$("#mouseY").html(yPos);
}

function redraw() {
	context.clearRect(0, 0, myCanvas.width(), myCanvas.height()); // Clears the canvas

	//context.strokeStyle = "black";
	context.lineJoin = "miter";
	context.lineWidth = 1;

	for(var i=0; i < mouseX.length; i++) {
		context.beginPath();
		if(mouseDrag[i] && i) {
			context.moveTo(mouseX[i-1], mouseY[i-1]);
		} else {
			context.moveTo(mouseX[i]-1, mouseY[i]);
		}
		context.lineTo(mouseX[i], mouseY[i]);
		context.closePath();
		context.strokeStyle = mouseColor[i];
		context.lineWidth = mouseSize[i];
		context.stroke();
	}
}

function clearCanvas() {
	context.clearRect(0, 0, myCanvas.width(), myCanvas.height()); // Clears the canvas
	mouseX = new Array();
	mouseY = new Array();
	mouseDrag = new Array();
	mouseColor = new Array();
	mouseSize = new Array();
}

function upColor(colorCode) {
	color = colorCode;
}

function upSize(size) {
	radius = size;
}

function saveCanvas(link, id) {
	link.href = document.getElementById("myCanvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
	var filename = prompt("Please enter file name","test");
	link.download = filename+".png";
}

function handleImage(e) {
	var reader = new FileReader();
	reader.onload = function(event) {
		var img = new Image();
		img.onload = function() {
			myCanvas.width = img.width;
			myCanvas.height = img.height;
			context.drawImage(img,0,0);
		}
		img.src = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
}

