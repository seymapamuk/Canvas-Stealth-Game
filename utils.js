function createFullScreenCanvas(){
	var canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = "absolute";
	document.body.appendChild(canvas);
	return canvas;
}