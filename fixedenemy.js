class FixedEnemy{
	constructor(x,y,dia,dia2,angle,magnitude){
		this.angle = angle;

		this.x = x;
		this.y = y;
		this.dia = dia;
		this.cirdia = dia2;

		this.path = this.initPath();
		this.cirpath; 

		this.color = "rgb(65,105,225,0.5)";
		this.circolor = "rgb(65,105,225)";

		this.magnitude = magnitude;

		this.moving = false;

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

		this.path.arc(this.x, this.y, this.dia, Math.PI*this.angle, Math.PI*(this.angle+this.magnitude));

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
		this.initPath();
	}

	returnColor(){
		return "rgb(65,105,225,0.5)";
	}

	killed(){
		this.alive = false;
	}
}