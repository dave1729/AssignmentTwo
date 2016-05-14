
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
    this.entitiesCount = 0;
    this.im = null;
    this.click = null;
    this.ctx = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.im = new InputManager("CreatureInfo", ctx);
    this.im.addMouse();
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
    			alert(entity.toString());
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