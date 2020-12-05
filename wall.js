class Wall {
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.width = 25;
		this.height = 25;
		this.fill = "yellow";

		this.initPath();
	}

	initPath(){
		this.path = new Path2D();
		this.path.rect(this.x,this.y,this.width,this.height);
		this.path.closePath();
	}

	draw(ctx){
		ctx.fillStyle = this.fill;
		//ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fill(this.path);
	}

	isPointInside(ctx, x, y){
		return ctx.isPointInPath(this.path, x, y);
	}
}