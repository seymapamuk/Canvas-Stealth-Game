class Enemy{
	constructor(x,y,dia,dia2){
		this.angle = 0.1;

		this.x = x;
		this.y = y;
		this.dia = dia;
		this.cirdia = dia2;

		this.path = this.initPath();
		this.cirpath; 

		this.direction = {
			x : 1,
			y : 1,
		};
		this.speed = 50 / 1000;

		this.angledir = true;

		this.color = "rgb(75,0,130,0.5)";
		this.circolor = "rgb(75,0,130)";
	}

	circlePath(){
		this.cirpath = new Path2D();
		this.cirpath.arc(this.x, this.y, this.cirdia, 0, Math.PI*2);
		this.cirpath.closePath();
	}

	initPath(){
		this.circlePath();

		this.path = new Path2D();

		this.path.lineTo(this.x, this.y);

		if(this.angledir)
			this.path.arc(this.x, this.y, this.dia, Math.PI*this.angle, Math.PI*(this.angle+0.2));

		else
			this.path.arc(this.x, this.y, this.dia, Math.PI*this.angle, Math.PI*(this.angle-0.2), true);

		this.path.closePath();
	}

	draw(ctx){
		ctx.fillStyle = this.circolor;
		ctx.fill(this.cirpath);
		ctx.fillStyle = this.color;
		ctx.fill(this.path);
	}

	update(delta){
		if(this.angle >= 0.5)
			this.angledir = false;
		if(this.angle <= 0.1)
			this.angledir = true;

		if(this.angledir)
			this.angle += 0.01;
		else
			this.angle -= 0.01;

		this.initPath();
	}

}