
Scoreboard = function() {
	var score = 0;
	var scoreSprite;
	var messageSprite;
	var lives;
	var lifeArray = [];
	var level;

	/*
	//	Called before adding the object to the scene
	//	Gives you a chance to set the initial setTekstboard state
	// 	Could add other stuff here in the future if necessary
	*/
	this.initialize = function() {
		lives = wade.app.lives;
		level = wade.app.level;
		this.resetLives();
		this.setScore(0);
	};	// end initialize

	/*
	//	Called on default by the wade engine on addSceneObject
	//	Add the supporting sprites to the setTekstboard
	//	Note all setTekstboard stuff is added to layer 5 - same as background
	*/
	this.onAddToScene = function() {
		var scoreBackground = new Sprite('./images/pozadinaRezultat.png',wade.app.backgroundLayer);
		scoreBackground.setSize(wade.getScreenWidth(),32);
		this.owner.addSprite(scoreBackground);

		scoreSprite = new TextSprite(score.toString(), '24px Verdans', '#FF0000', 'right',wade.app.backgroundLayer);
		var scoreOffset = { x: wade.getScreenWidth()/2 - 16, y: 10};
		this.owner.addSprite(scoreSprite,scoreOffset);

		messageSprite = new TextSprite('Informacije', '24px Verdana', 'FF0000', 'center', wade.app.backgroundLayer);
		var messageOffset = { x: 0, y: 10 };
		this.owner.addSprite(messageSprite,messageOffset);
	};	// end onAddToScene

	/*
	//	mouse down on setTekstboard sets up autofire
	//	for touch screen
	*/
	this.onMouseDown = function() {
		wade.app.AUTOFIRE = true;
		wade.app.autoFire();
	};

	/*
	//	mouse up on setTekstboard turns off autofire
	*/
	this.onMouseUp = function() {
		wade.app.AUTOFIRE = false;
	};

	// Life management setter and getter functions
	this.resetLives = function() {
		this.clearLifeArray();
		lives = wade.app.lives;
        if(level == 3){
        	lives = 1;
        }

		var lifeOffset = { x: -wade.getScreenWidth()/2 + 16, y: 0};
		for (var i=0; i<lives; i++) {
			var lifeSprite = new Sprite('./images/zivot.png',wade.app.backgroundLayer);
			lifeSprite.setSize(16,16);
			this.owner.addSprite(lifeSprite,lifeOffset);
			lifeOffset.x += 32;
			lifeArray.push(lifeSprite);
		}
	};	// end resetLives

	this.clearLifeArray = function() {
		while (lifeArray.length > 0) {
			var sp = lifeArray.pop();
			this.owner.removeSprite(sp);
        }
	};	// end clearLifeArray

	this.loseLife = function(value) {
        if (lives <= 0) {
        	lives = 0;
        }
		else {
			lives -= value;
        }
		if (lifeArray.length > 0) {
			var sp = lifeArray.pop();
			this.owner.removeSprite(sp);
		}
    };	// end loseLife

	this.addLives = function(value) {
		lives += value;
	};

	this.getLives = function() {
		return lives;
	};

	// text message management function
	this.setMessage = function(msg) {
		messageSprite.setText(msg);
	};

	// setTekst management setter and getter functions
	this.setScore = function(value) {
		score = value;
		scoreSprite.setText(score);
	};

	this.getScore = function() {
		return score;
	};

	this.addScore = function(value) {
		score += value;
		scoreSprite.setText(score);
	};

};