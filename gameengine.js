window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.socket = null;
    this.background = null;
    this.entitiesCount = 0;
    this.im = null;
    this.db = null;
    this.click = null;
    this.ctx = null;
}

GameEngine.prototype.init = function (ctx) {
	var that = this;
    this.ctx = ctx;
    this.socket = io.connect("http://76.28.150.193:8888");
    this.socket.on("load", function (data) {
    	for (var i = 0; i < data.creatureList.length; i++) {
    	    var newCreature = new Creature(that, data.creatureList[i].id, data.creatureList[i].species);
    	    newCreature.id = data.creatureList[i].id;
    	    newCreature.species = data.creatureList[i].species;
    	    newCreature.radius = data.creatureList[i].radius;
    	    newCreature.x = data.creatureList[i].x;
    	    newCreature.y = data.creatureList[i].y;
    	    newCreature.direction = data.creatureList[i].direction;
    	    newCreature.markedForDeath = data.creatureList[i].markedForDeath;
    	    newCreature.badLuck = data.creatureList[i].badLuck;
    	    newCreature.red = data.creatureList[i].red;
    	    newCreature.green = data.creatureList[i].green;
    	    newCreature.blue = data.creatureList[i].blue;
    	    newCreature.alpha = data.creatureList[i].alpha;
    	    newCreature.speed = data.creatureList[i].speed;
    	    newCreature.area = data.creatureList[i].area;
    	    newCreature.deathArea = data.creatureList[i].deathArea;
    	    newCreature.mitosisArea = data.creatureList[i].mitosisArea;
    	    that.entities.push(newCreature);
    	    that.entitiesCount++;
    	}
    });
    this.background = new Background(this, AM.getAsset("./img/Cell_Background.png"));
    this.im = new InputManager("CreatureInfo", ctx);
    this.im.addMouse();
    this.im.addInput(new Input("saveState", 's'));
    this.im.addInput(new Input("loadState", 'l'));
    this.im.start();
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addCreature = function (creature) {
    console.log('added creature');
    this.entities.push(creature);
    this.entitiesCount++;
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.update();
    }
}

GameEngine.prototype.deleteTheDead = function () {
    //kill creatures that are too small to live or eaten
    for (var i = 0; i < this.entities.length; i++) {
    	if(this.entities[i].markedForDeath) {
    		this.entities.splice(i, 1);
    	}
    }
}

GameEngine.prototype.collision = function () {
    //var entitiesCount = this.entities.length;
    
    //for each creature
    for (var i = 0; i < this.entities.length; i++) {
    	//check it against all other creatures
    	for(var j = 0; j < this.entities.length; j++) {
    		//check only if your not checking itself
    		if(i !== j) {
    			//var you = this.entities[i];
    			//var them = this.entities[j];
    			if(hitEachother(this.entities[i], this.entities[j])) {
    				this.entities[i].collide(this.entities[j]);
    			}
    		}
    	}
    }
}

GameEngine.prototype.addPlants = function () {
	if(Math.random() > 0.95) this.addCreature(new Creature(this, 1111, 1));
}

GameEngine.prototype.draw = function () {
	this.background.draw();
    //Sort entities by layer
    this.entities.sort(
        function(x, y)
        {
        	return x.species - y.species;
        }
    );
    
	if(this.im.checkMouse()) {
		click = this.im.getClick();
	}
    
    //draw creatures and check user click
    for (var i = 0; i < this.entities.length; i++) {
    	this.entities[i].draw(this.tick, this.ctx);
    	if(this.im.checkMouse()) {
    		var entity = this.entities[i];
    		click = this.im.getClick();
    		if(click !== null && hitEachother(entity, click)) {
				this.im.resetClick();
			}
    	}
    }
}

var hitEachother = function (entity1, entity2) {
	//alert("in hitEachother");
	if((entity1 !== null) && (entity2 !== null)) {
		var deltaX = entity2.x-entity1.x;
		var deltaY = entity2.y-entity1.y;
		var sigmaRadii = entity2.radius+entity1.radius;
//		if(!(Math.pow(sigmaRadii, 2) > 0)) {
//			alert(entity1.id + " " + entity2.id);
//		}
		return (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) <= Math.pow(sigmaRadii, 2);
	}
	else {
		return false;
	}
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.deleteTheDead();
    this.collision();
    this.addPlants();
    this.draw();
    if(this.im.checkInput("saveState")) {
    	this.saveEntities();
    	alert("Current State Saved!");
    }
    else if (this.im.checkInput("loadState")) {
    	this.loadEntities();
    	alert("Previous State Loaded!");
    }
}


GameEngine.prototype.saveEntities = function () {
	var that = this;
	var creatureList = [];
	for (var i = 0; i < this.entities.length; i++) {
		creatureList.push({
			id: that.entities[i].id,
			species: that.entities[i].species,
			radius: that.entities[i].radius,
			x: that.entities[i].x,
			y: that.entities[i].y,
			direction: that.entities[i].direction,
			markedForDeath: that.entities[i].markedForDeath,
			badLuck: that.entities[i].badLuck,
		    red: that.entities[i].red,
	    	green: that.entities[i].green,
	    	blue: that.entities[i].blue,
	        alpha: that.entities[i].alpha,
	        speed: that.entities[i].speed,
		    area: that.entities[i].area,
		    deathArea: that.entities[i].deathArea,
		    mitosisArea: that.entities[i].mitosisArea
		    });
	}
	this.socket.emit("save", { studentname: "David Humphreys", statename: "SimulationState", creatureList: creatureList});
}


GameEngine.prototype.loadEntities = function () {
	this.entities = [];
	this.entitiesCount = this.entities.length;
	this.socket.emit("load", { studentname: "David Humphreys", statename: "SimulationState"});
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}