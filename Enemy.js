Enemy = function() {
	
	/*
	//	Zove pre nego sto doda objekat
	//	Moze se promeniti velicina sprajta i tip sprajta
	// 	Mozemo dodati jos neke stvari ako je potrebno
	*/
	this.initialize = function(shipType, energy, spriteSize, scoreValue) {
		this.shipType = shipType;
		this.energy = energy;
		this.spriteSize = spriteSize;
		this.scoreValue = scoreValue;

		spriteSize = wade.app.enemySize;
	};
	
	/*
	//	Called on default by the wade engine on addSceneObject
	//	Setup the enemy sprite, its size and animation based on its type
	*/
	this.onAddToScene = function() {
		var eSprite = new Sprite();
		eSprite.setSize(this.spriteSize,this.spriteSize);
		
		switch (this.shipType) {
			case wade.app.battleShip:
				var eAnimation = new Animation('./images/neprijateljskiBoss.png',3,1,10,true);
			break;
			case wade.app.motherShip:
				var eAnimation = new Animation('./images/neprijateljskiBoss.png',3,1,10,true);
			break;
			default:
				var eAnimation = new Animation('./images/neprijateljskiBrod.png',3,1,10,true);
			break;
		};	// end switch
		
		eSprite.addAnimation('neprijateljski brod', eAnimation);
		eSprite.playAnimation('neprijateljski brod');
		this.owner.addSprite(eSprite);
	};
	
	// setter and getter functions for enemy attributes
	this.getSpriteType = function() {
		return this.shipType;
	};
	
	this.getSpriteHealth = function() {
		return this.energy;
	};
	
	this.setSpriteHealth = function(newHealth) {
		this.energy = newHealth;
	};
	
	this.getScoreValue = function() {
		return this.scoreValue;
	};
};