class Player {
	constructor(x,y,width,height,color){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height

		this.speed = 100 / 1000;

		this.direction = {
			x : 1,
			y : 1
		};

		this.initPath();
		this.color = color;
	}

	initPath(){
		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.height);
		this.path.closePath();
	}

	draw(ctx){
		ctx.fillStyle = this.color;
		ctx.fill(this.path);
	}
}