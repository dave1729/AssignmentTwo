var AM = new AssetManager();

const MAX_SIZE = 100000;

function Creature(game, id) {
	//hexString = yourNumber.toString(16);
	//and reverse the process with:
	//yourNumber = parseInt(hexString, 16);
    this.game = game;
    this.badLuck = Math.floor(Math.random() * 10);
    this.area = 2500;
    this.radius = Math.sqrt(this.area / Math.PI);
    this.x = (768 - 4 * this.radius) * Math.random() + (2 * this.radius);
    this.y = (768 - 4 * this.radius) * Math.random() + (2 * this.radius);
    this.removeFromWorld = false;
	this.id = id;
	this.layer = 2;
    this.red = Math.floor(Math.random() * 155) + 100;
    this.green = Math.floor(Math.random() * 55) + 200;
    this.blue = Math.floor(Math.random() * 100) + 155;
    this.alpha = 0.3;
    this.speed = 50;
    this.direction = 2 * Math.PI * Math.random();
    this.deathArea = 100 * Math.PI;
    this.mitosisArea = 1500;
    this.dna = "10011100";
}

Creature.prototype.draw = function (tick, ctx) {
	
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + this.radius * 0.2, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

Creature.prototype.update = function () {
	//this.red = Math.floor(Math.random() * 255);
	//this.green = Math.floor(Math.random() * 255);
	//this.blue = Math.floor(Math.random() * 255);
	//this.alpha += .001 * Math.random();
	console.log("Radius: " + this.radius + "     Area: " + this.area);
	if(Math.floor(Math.random() * 10) <= this.badLuck ) {
		this.area -= (this.area * this.area / MAX_SIZE) * Math.random();
		this.radius = Math.sqrt(this.area / Math.PI);
	}
	
	if(this.x > 768 - this.radius) {
		this.direction = (Math.PI - this.direction) % (2 * Math.PI);
		this.x += this.game.clockTick * (this.speed * Math.cos(this.direction));
	}
	else if (this.x < this.radius) {
		this.direction = (Math.PI - this.direction) % (2 * Math.PI);
		this.x += this.game.clockTick * (this.speed * Math.cos(this.direction));
	}
	if(this.y > 768 - this.radius) {
		this.direction = ((2 * Math.PI) - this.direction) % (2 * Math.PI);
		this.y += this.game.clockTick * (this.speed * Math.sin(this.direction));
	}
	else if (this.y < this.radius) {
		this.direction = ((2 * Math.PI) - this.direction) % (2 * Math.PI);
		this.y += this.game.clockTick * (this.speed * Math.sin(this.direction));
	}
	//this.direction = (this.direction + .1) % (2 * Math.PI);
	this.x += this.game.clockTick * (this.speed * Math.cos(this.direction));
	this.y += this.game.clockTick * (this.speed * Math.sin(this.direction));
}

Creature.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Creature.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.layer = 1;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

AM.queueDownload("./img/Cell_Background.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addCreature(new Background(gameEngine, AM.getAsset("./img/Cell_Background.png")));
    for(var i = 0; i < 10; i++) {
    	gameEngine.addCreature(new Creature(gameEngine, i));
    }
    
    console.log("All Done!");
});