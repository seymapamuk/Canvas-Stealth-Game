var enemyCount = 0;
var wallCount = 0;

var keysPressed = {};

var controls = {
	LEFT : "a",
	RIGHT : "d",
	UP : "w",
	DOWN : "s",
	HIDE : "h",
	KILL : "k",
	BOX : "b"
}

var hide = false;

var lifePoints = 0;
var boxCount = 3;

finish = new Path2D();

function init(){
	game = {
		canvas : undefined,
		ctx : undefined,
		lastTick : Date.now(),
		go : {}
	}
	
	game.canvas = createFullScreenCanvas();
	game.ctx = game.canvas.getContext("2d");

	game.go.wall = [];

	wallInit();

	game.go.enemies = [];
	game.go.enemies[enemyCount++] = new RotatingEnemy(200,82,150,7,0.1,0.2);
	game.go.enemies[enemyCount++] = new FixedEnemy(window.innerWidth - window.innerWidth / 3 - 7,82,300,7,0.7,0.2);
	game.go.enemies[enemyCount++] = new MovingEnemy(600,150,150,7,0.2,0.2);
	game.go.enemies[enemyCount++] = new RotatingEnemy(window.innerWidth / 3 + 25, window.innerHeight / 2, 150, 7, 0.1, 0.2);
	game.go.enemies[enemyCount++] = new MovingEnemy(window.innerWidth / 4, window.innerHeight - window.innerHeight / 6, 150, 7, 0.1, 0.2);

	game.go.player = new Player(100,150,15,15,"rgb(0,128,128)");

	document.addEventListener("keyup", function (keyEvent){
		keysPressed[keyEvent.key]  = false;
	});

	document.addEventListener("keydown", function (keyEvent){
		keysPressed[keyEvent.key] = true;
	});

	window.addEventListener('resize', function (event){
		console.log(event);
		console.log(window.innerWidth);
	});

	window.requestAnimationFrame(loop);
}

function loop(timestamp) {
	var now = Date.now();
	var delta = now - game.lastTick;

	update(delta);
	handleInput(delta);
	render();

	game.lastTick = now;
	window.requestAnimationFrame(loop);
}

function handleInput(dt){
	var preX = game.go.player.x;
	var preY = game.go.player.y;

	if(keysPressed[controls.RIGHT]){
		game.go.player.x += dt * game.go.player.speed;
	}
	if(keysPressed[controls.LEFT]){
		game.go.player.x -= dt * game.go.player.speed;
	}
	if(keysPressed[controls.UP]){
		game.go.player.y -= dt * game.go.player.speed;
	}
	if(keysPressed[controls.DOWN]){
		game.go.player.y += dt * game.go.player.speed;
	}
	if(keysPressed[controls.HIDE]){
		hide = true;
		game.go.player.color = "rgb(0,128,128,0.5)";
	}
	else{
		hide = false;
		game.go.player.color = "rgb(0,128,128)";
	}

	for(var k = 0; k < wallCount; k++){
		if(game.go.wall[k].isPointInside(game.ctx, game.go.player.x, game.go.player.y) 
			|| game.go.wall[k].isPointInside(game.ctx, game.go.player.x + game.go.player.width, game.go.player.y)
			|| game.go.wall[k].isPointInside(game.ctx, game.go.player.x, game.go.player.y + game.go.player.height)
			){
			game.go.player.x = preX;
			game.go.player.y = preY;
		}
	}

	game.go.player.initPath();

	if(!hide){
		for(var i = 0; i < enemyCount; i++){
			if(game.go.enemies[i].alive){
				if(checkCollision(game.go.enemies[i], game.go.player)){
					game.go.enemies[i].color = "rgb(220,20,60,0.5)";
					game.go.enemies[i].initPath();
					lifePoints += 10;
					if(lifePoints >= window.innerWidth){
						alert("Game Over!");
						location.reload();
					}
				}
				else{
					game.go.enemies[i].color = game.go.enemies[i].returnColor();
					game.go.enemies[i].initPath();
				}
				if(game.ctx.isPointInPath(game.go.enemies[i].cirpath,game.go.player.x,game.go.player.y)){
					if(keysPressed[controls.KILL]){
						game.go.enemies[i].killed();
					}
				}
			}
		}

		if(keysPressed[controls.BOX] && boxCount > 0){
			createBox(game.go.player.x+game.go.player.width,game.go.player.y+game.go.player.height, 25,25);
			boxCount--;
		}
	}

	if(game.ctx.isPointInPath(finish,game.go.player.x,game.go.player.y)){
		alert("You Won!");
		location.reload();
	}
}

function update(delta){
	for(var i = 0; i < enemyCount; i++){
		preX = game.go.enemies[i].x;
		preY = game.go.enemies[i].y;
		game.go.enemies[i].update(delta);
		for(var k = 0; k < wallCount; k++){
			if(game.go.wall[k].isPointInside(game.ctx,game.go.enemies[i].x, game.go.enemies[i].y) && game.go.enemies[i].moving){
				game.go.enemies[i].x = preX;
				game.go.enemies[i].y = preY;

				if(Math.floor(Math.random() * 10) % 2 == 0){
					game.go.enemies[i].direction.x *= -1;
				}else{
					game.go.enemies[i].direction.y *= -1;
				}
			//	game.go.enemies[i].update(delta);
			}
		}
	}
}

function render(){
	game.ctx.fillStyle = "black";
	game.ctx.fillRect(0,0, game.canvas.width, game.canvas.height);

	for(var k = 0; k < wallCount; k++){
		game.go.wall[k].draw(game.ctx);
	}

	game.go.player.draw(game.ctx);

	for(var i = 0; i < enemyCount; i++){
		game.go.enemies[i].draw(game.ctx);
	}

	game.ctx.fillStyle = "crimson";
	path = new Path2D();
	path.rect(0,0, window.innerWidth - lifePoints, 50);
	game.ctx.fill(path);

	game.ctx.fillStyle = "green";
	finish.rect(window.innerWidth - 70, window.innerHeight - 70, 35, 35);
	game.ctx.fill(finish);
}

function checkCollision(go1,go2){
	if(game.ctx.isPointInPath(go1.path, go2.x, go2.y) &&
	game.ctx.isPointInPath(go1.path, go2.x + go2.width, go2.y) &&
	game.ctx.isPointInPath(go1.path, go2.x, go2.y + go2.height) &&
	game.ctx.isPointInPath(go1.path, go2.x, go2.y - go2.height) &&
	game.ctx.isPointInPath(go1.path, go2.x - go2.width, go2.y)){
		return true;
	}
	else{
		return false;
	}
}

function wallInit(){
	game.go.wall[wallCount++] = new Wall(0, 50, window.innerWidth, 25, "#4845B6");
	game.go.wall[wallCount++] = new Wall(0, 50, 25, window.innerHeight, "#4845B6");
	game.go.wall[wallCount++] = new Wall(window.innerWidth - 25, 50, 25, window.innerHeight, "#4845B6");
	game.go.wall[wallCount++] = new Wall(0, window.innerHeight - 25, window.innerWidth, 25, "#4845B6");
	game.go.wall[wallCount++] = new Wall(window.innerWidth - window.innerWidth / 3, 50, 25, window.innerHeight / 2, "#4845B6");
	game.go.wall[wallCount++] = new Wall(0, window.innerHeight / 3, window.innerWidth / 3, 25, "#4845B6");
	game.go.wall[wallCount++] = new Wall(window.innerWidth / 3, window.innerHeight / 3, 25, window.innerHeight / 4, "#4845B6");
	game.go.wall[wallCount++] = new Wall(window.innerWidth / 6, window.innerHeight / 2, 25, window.innerHeight / 2, "#4845B6");
	game.go.wall[wallCount++] = new Wall(window.innerWidth - window.innerWidth / 6, window.innerHeight / 3, window.innerWidth / 6, 25, "#4845B6");
	game.go.wall[wallCount++] = new Wall(window.innerWidth / 3, window.innerHeight - window.innerHeight / 3, window.innerWidth - window.innerWidth / 3, 25, "#4845B6");
}

function createBox(x,y,width,height){
	game.go.wall[wallCount++] = new Wall(x, y, width, height, "yellow");
}