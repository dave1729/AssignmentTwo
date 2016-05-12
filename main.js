var AM = new AssetManager();

const MAX_SIZE = 5000000;

function Creature(game, id, species) {
	//hexString = yourNumber.toString(16);
	//and reverse the process with:
	//yourNumber = parseInt(hexString, 16);
    this.game = game;
	this.id = id;
    this.species = species;
    this.setColor();
    
//    this.area = 400
//    if(this.species !== 1) this.area += 1000 + (500 * species);
//    this.deathArea = 100 * Math.PI;
//    if(this.species !== 1) this.deathArea += (500 * (species - 1));
//    this.mitosisArea = this.area + 100;
    
    this.radius = Math.sqrt(this.area / Math.PI);
    this.x = (768 - 4 * this.radius) * Math.random() + (2 * this.radius);
    this.y = (768 - 4 * this.radius) * Math.random() + (2 * this.radius);
    this.speed = 0;
    if(this.species !== 1) this.speed = 60;
    this.direction = 2 * Math.PI * Math.random();
	this.markedForDeath = false;
    this.badLuck = Math.floor(Math.random() * 10);
    //this.dna = "10011100";
}

Creature.prototype.setColor = function () {
	if(this.species > 4) { // Dark Green
		this.red = (this.species * 997) % 255;
    	this.green = (this.species * 1009) % 255;
    	this.blue = (this.species * 1777) % 255;
        this.alpha = 0.6;
        
	    this.area = 500 * this.species + 500;
	    this.deathArea = 500 * this.species - 500;
	    this.mitosisArea = 500 * this.species + 600;
	}
		else if(this.species > 3) { // Dark Green
		this.red = 10;
    	this.green = 75;
    	this.blue = 55;
        this.alpha = 0.6;
        
	    this.area = 2000;
	    this.deathArea = 1400;
	    this.mitosisArea = 2600;
	}
	else if(this.species > 2) { // Green/Blue
		this.red = 5;
    	this.green = 15;
    	this.blue = 100;
        this.alpha = 0.6;
        
	    this.area = 1500;
	    this.deathArea = 900;
	    this.mitosisArea = 1600;
	}
	else if(this.species > 1) { // Red Brown
		this.red = 160;
    	this.green = 10;
    	this.blue = 30;
        this.alpha = 0.6;
        
        this.area = 1000;
	    this.deathArea = 500;
	    this.mitosisArea = 1100;
	}
	else { // Yellow
		this.red = 250;
		this.green = 230;
		this.blue = 50;
	    this.alpha = 0.6;
	    
	    this.area = 400;
	    this.deathArea = 380;
	    this.mitosisArea = 420;
	}
}

Creature.prototype.draw = function (tick, ctx) {
	
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
    var tempAlpha = this.alpha;
    var deltaArea = this.area - this.deathArea;
    //if(deltaArea < (this.alpha * 100)) tempAlpha -= (Math.abs((this.alpha * 100) - deltaArea) / 100);
    if(deltaArea < (this.alpha * 100)) tempAlpha -= this.alpha - (deltaArea + this.alpha*100) / 200;
    ctx.fillStyle = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + tempAlpha + ")";
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
	//console.log("Radius: " + this.radius + "     Area: " + this.area);
	if(this.species !== 1) {
		var onEdge = false;
		
		if(Math.floor(Math.random() * 10) <= this.badLuck ) {
			this.area -= (this.area * this.area / MAX_SIZE) * Math.random();
			this.radius = Math.sqrt(this.area / Math.PI);
		}
		
		if(this.area < this.deathArea) {
			this.markedForDeath = true;
		}
		else if (this.area > this.mitosisArea) {
			this.area = this.area / 2;
			this.radius = Math.sqrt(this.area / Math.PI);
			var geneticCopy = new Creature(this.game, this.i, this.species);
			geneticCopy.x = this.x;
			geneticCopy.y = this.y;
			geneticCopy.area = this.area;
			geneticCopy.radius = this.radius;
			this.game.addCreature(geneticCopy);
		}
		
		if(this.x > 768 - this.radius) {
			this.direction = (Math.PI - this.direction) % (2 * Math.PI);
			this.x += this.game.clockTick * (this.speed * Math.cos(this.direction));
			onEdge = true;
		}
		else if (this.x < this.radius) {
			this.direction = (Math.PI - this.direction) % (2 * Math.PI);
			this.x += this.game.clockTick * (this.speed * Math.cos(this.direction));
			onEdge = true;
		}
		
		if(this.y > 768 - this.radius) {
			this.direction = ((2 * Math.PI) - this.direction) % (2 * Math.PI);
			this.y += this.game.clockTick * (this.speed * Math.sin(this.direction));
			onEdge = true;
		}
		else if (this.y < this.radius) {
			this.direction = ((2 * Math.PI) - this.direction) % (2 * Math.PI);
			this.y += this.game.clockTick * (this.speed * Math.sin(this.direction));
			onEdge = true;
		}
		
		if(!onEdge) {
			this.direction = (this.direction + 0.25 * (Math.random() - 0.5)) % (2 * Math.PI);
		}
		
		this.x += this.game.clockTick * (this.speed * Math.cos(this.direction));
		this.y += this.game.clockTick * (this.speed * Math.sin(this.direction));
	}
}

Creature.prototype.collide = function (theOtherEntity) {
	if((theOtherEntity.species - this.species) === 1 &&  !(this.markedForDeath) && theOtherEntity.area > this.area) {
		theOtherEntity.area += this.area * 3 / 4;
		this.markedForDeath = true;
	}
	else if(this.species - theOtherEntity.species === 1 && !(theOtherEntity.markedForDeath) && this.area < theOtherEntity.area) {
		this.area += theOtherEntity.area * 3 / 4;
		theOtherEntity.markedForDeath = true;
	}
}

Creature.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Creature.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Creature.prototype.toString = function () {
    var creatureString = "CREATURE #" + this.id + "\n----------------------\n" + "\nArea: " + Math.floor(this.area) +
    					 "\nRed: " + Math.floor(this.red) + "\nGreen: " + Math.floor(this.green) +
    					 "\nBlue: " + Math.floor(this.blue) + "\n\n";
    return creatureString;
}

// no inheritance
function Background(game, spritesheet) {
    this.game = game;
    this.spritesheet = spritesheet;
    this.x = 0;
    this.y = 0;
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
    

    var numberOfTypes = 5; // 4 is standard
    var initialCreatures = 80;
    var multiplyer = 1;
    var smallestGroupSize = Math.max(Math.floor(initialCreatures / ((Math.pow(2, numberOfTypes) - 1))), 1);
    
    for(var type = numberOfTypes; type > 0; type--) {
	    for(var i = 0; i < (smallestGroupSize * multiplyer); i++) {
	    	gameEngine.addCreature(new Creature(gameEngine, i, type));
	    }
	    multiplyer = multiplyer * 2;
    }
    console.log("All Done!");
});


