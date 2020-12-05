class MovingEnemy{
	constructor(x,y,dia,dia2,angle,magnitude){
		this.angle = angle;
		this.constangle = angle;

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

		this.speed = 100 / 1000;

		this.angledir = true;

		this.color = "rgb(0,100,0,0.5)";
		this.circolor = "rgb(0,100,0)";

		this.magnitude = magnitude;

		this.moving = true;

		this.alive = true;
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
			this.path.arc(this.x, this.y, this.dia, Math.PI*this.angle, Math.PI*(this.angle+this.magnitude));

		else
			this.path.arc(this.x, this.y, this.dia, Math.PI*this.angle, Math.PI*(this.angle-this.magnitude), true);

		this.path.closePath();
	}

	draw(ctx){
		if(this.alive){
			ctx.fillStyle = this.circolor;
			ctx.fill(this.cirpath);
			ctx.fillStyle = this.color;
			ctx.fill(this.path);
		}
	}

	update(delta){
		if(this.angle >= this.constangle + 0.4)
			this.angledir = false;
		if(this.angle <= this.constangle)
			this.angledir = true;

		if(this.angledir)
			this.angle += 0.01;
		else
			this.angle -= 0.01;

		this.x += delta * this.speed * this.direction.x;
		this.y += delta * this.speed * this.direction.y;

		this.initPath();
	}

	returnColor(){
		return "rgb(0,100,0,0.5)";
	}

	killed(){
		this.alive = false;
	}
}