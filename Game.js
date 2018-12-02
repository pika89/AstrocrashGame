App = function () {
    this.laserSpeed = 600;				// brzina kojom se laseri kreću
    this.autoFire = false;					// za kontrolu automatskog pucanja
    this.maximumIncreaseEnemySpeed = 120;			// maximalno povećanje ubrzanja neprijateljskog broda
    this.enemySize = 32;					// veličina sprajta za brodove, bossevi su duplo veci
    this.playerEnergy = 4;			// koliko udarca može igrač primiti pre nego što izgubi život
    this.enemyShip = 2;			// vrsta broda neprijateljskog broda
    this.battleShip = 3;			// vrsta broda boss-a
    this.motherShip = 4;			// vrsta broda boss-a
    this.yBorder = 150;					// granice gornja i donja
    this.xBorder = 314;					// granice leva i desna
    this.lives = 4;							//broj zivota po levelu
    this.backgroundLayer = 3;				// tabela rezultata i pozadina
    this.level = 0;
    // zvučni efekti
    this.sound = true;					// ovo koristimo za debug
    this.soundShip = './sounds/BrodZvuk.ogg';
    this.soundLaser = './sounds/Laser.aac';
    this.soundExplosion = './sounds/Eksplozija.ogg';
    this.soundHit = './sounds/Pogodak.ogg';

    this.scoreboard;						// objekat tabele rezultata

    var player,								// igrač
        gameTime,							// vreme u igri za povećanje teškoće
        scoreBoard,						// za jednostavni pristup tabeli
        background,							// objekat pozadine
        loadedStuff = 15,						// koje su skripte učitane i slike
        currentLevel = 1,						// početni level
        changeText,						// objekat za menjanje levela
        nextText,						// objekat za menjanje levela
        enemySpeed = 120,					// koliko brzo se kreću neprijateljski brodovi
        speedIncrease = 0,					// povećanje brzine
        pastEnemies = 0,					// koliko je brodova prošlo ovaj level
        destroyedEnemies = 0,					// koliko je brodova uništeno ovaj level
        pastBosses = 0,						// koliko je bosseva prošlo level
        enemyHit = 0,
        laserShot = 0,
        playerAccuracy = 0,
        battleshipsDestroyed = 0,						// koliko je bosseva uništeno ovaj level
        maxEnemies,							// maximalan broj neprijateljskih brodova po levelu
        enemyStartShoot,					// trenutak pucanja brodova
        battleshipStartShoot,				// trenutak pucanja bosseva
        mothershipStartShoot,				// trenutak pucanja mothershipa
        backgroundSound = [],			// zvukovi pozadine
        currentEnemies = [];					// niz aktvinih brodova

    var gameState = {
        currentState: 0,
        intro: 0,
        loading: 1,
        game: 2,
        paused: 3
    };

    // definisanje levela igre
    var level = [
        {},
        {
            number: 1, bImage: './images/PrvaPozadina.png', numberOfEnemies: 3,
            maxEnemies: 7, startShoot: 0.97, battleshipStartShoot: 1.0,
            pointsNeeded: 140, textLevel: 'Level 1 - First Wave',
            rampTime: 6, speedIncrease: 0
        },
        {
            number: 2, bImage: './images/DrugaPozadina.png', numberOfEnemies: 4,
            maxEnemies: 8, startShoot: 0.97, battleshipStartShoot: 0.8,
            pointsNeeded: 180, textLevel: 'Level 2 - Defending Earth',
            rampTime: 4, speedIncrease: 0
        },
        {
            number: 3, bImage: './images/TrecaPozadina.png', numberOfEnemies: 6,
            maxEnemies: 12, startShoot: 0.97, battleshipStartShoot: 0.6,
            pointsNeeded: 220, textLevel: 'Level 3 - Battleship Showdown',
            rampTime: 4, speedIncrease: 0
        },
        {
            number: 4, bImage: './images/CetvrtaPozadina.jpg', numberOfEnemies: 1,
            maxEnemies: 1, startShoot: 0.97, mothershipStartShoot: 0.4,
            pointsNeeded: 400, textLevel: 'Level 4 - The Final Battle',
            rampTime: 4, speedIncrease: 0
        }
    ];


    /*
    //	Loading game resources
    */
    this.load = function () {
        // učitavanje skripta
        var scripts = ['Player.js', 'Enemy.js', 'Scoreboard.js'];
        var images = ['pozadina.png', 'svemirskiBrod.png', 'neprijateljskiBrod.png', 'neprijateljskiBoss.png', 'laser.png', 'eksplozija.png', 'zivot.png', 'zvezda.png', 'PrvaPozadina.png', 'DrugaPozadina.png', 'TrecaPozadina.png', 'CetvrtaPozadina.jpg', 'pozadinaRezultat.png'];

        scripts.forEach(function (script) {
            wade.loadScript('./' + script, wade.app.loadCallback(0, 1))
        });
        images.forEach(function (image) {
            wade.loadImage('./images/' + image, wade.app.loadCallback)
        });


        // učitavanje zvučnih efekta
        if (wade.app.sound) {
            wade.preloadAudio(wade.app.soundShip);
            wade.preloadAudio(wade.app.soundLaser);
            wade.preloadAudio(wade.app.soundExplosion);
            wade.preloadAudio(wade.app.soundHit);
        }
    };


    this.loadCallback = function () {
        --loadedStuff;
        if (loadedStuff == 0) {
            setTimeout(function () {
                $("#wade_main_div").show();
                $("#loading_div").hide();
            }, 1000);

        }
    };

    /*
    //	init funkcija
    //	nameštanje veličine panela
    //	tekstualna poruka preko splash ekrana
    //	namešteno da igra počne klikom
    */
    this.init = function () {

        numberLevel = 1;
        wade.setMinScreenSize(708, 398);
        wade.setMaxScreenSize(708, 398);

        var splashSprite = new Sprite('./images/pozadina.png');
        splashSprite.setSize(wade.getScreenWidth(), wade.getScreenHeight());
        this.splashObject = new SceneObject(splashSprite)
        wade.addSceneObject(this.splashObject);

        var startTextSprite = new TextSprite('Click on the screen to start the game!', '32px Verdana', '#000000', 'center');
        var startTextObject = new SceneObject(startTextSprite, 0, 0, wade.getScreenHeight() / 2 - 40);
        wade.addSceneObject(startTextObject);

        this.splashObject.onMouseDown = function () {
            wade.removeSceneObject(this);
            wade.removeSceneObject(startTextObject);
            wade.app.startGame();
        };

        wade.addEventListener(this.splashObject, 'onMouseDown');
        wade.enableMultitouch();
    };	// kraj init funkcije

    /*
    //	učitavanje prvog levela
    //	pravljenje objekta tabele rezultata
    //	pravljenje objekta igrača
    */
    this.startGame = function () {
        enemyHit = 0;
        laserShot = 0;
        playerAccuracy = 0;
        wade.app.scoreboard = new SceneObject(0, Scoreboard, 0, wade.getScreenHeight() / 2 - 16);
        wade.addSceneObject(wade.app.scoreboard);
        scoreBoard = wade.app.scoreboard.getBehavior();
        scoreBoard.initialize();
        scoreBoard.setMessage(level[numberLevel].textLevel);

        wade.addEventListener(wade.app.scoreboard, 'onMouseDown');
        wade.addEventListener(wade.app.scoreboard, 'onMouseUp');

        background = new SceneObject();
        wade.addSceneObject(background);
        wade.app.loadLevel(numberLevel);

        // igrač objekat
        player = new SceneObject(0, Player, 0, 100);
        player.getBehavior().initialize();
        wade.addSceneObject(player);

        gameTime = wade.getAppTime();
        wade.app.gameGo();
    };	// kraj

    /*
    //	učitavanje pozadine
    //	postavljanje varijabli levela
    //	pušta se zvuk aviona u pozadini
    */
    this.loadLevel = function (numberLevel) {
        background.removeAllSprites();					// sklanja se pozadina ako je i dalje tu
        pastEnemies = 0;
        destroyedEnemies = 0;
        pastBosses = 0;
        battleshipsDestroyed = 0;


        // pravi se pozadina levela
        var bSprite = new Sprite(level[numberLevel].bImage, wade.app.backgroundLayer);
        bSprite.setSize(wade.getScreenWidth(), wade.getScreenHeight());
        background.addSprite(bSprite);
        bSprite.pushToBack();

        speedIncrease = 0;
        maxEnemies = level[numberLevel].numberOfEnemies;
        enemyStartShoot = level[numberLevel].startShoot;
        battleshipStartShoot = level[numberLevel].battleshipStartShoot;
        mothershipStartShoot = level[numberLevel].mothershipStartShoot;
        this.level = level[numberLevel].number;


        wade.app.soundManager('playBackground', wade.app.soundShip, true);
    };	// kraj


    this.onMouseDown = function () {
        if (gameState.currentState == gameState.game) {
            this.firePlayerLaser();
        }
    };

    this.onMouseMove = function (eventData) {
        if (gameState.currentState == gameState.game) {
            this.checkEnemyCollision();
            var position = eventData.screenPosition;
            var playerShip = player.getBehavior();
            playerShip.move(position.x, position.y, this.xBorder, this.yBorder);
        }
    };

    this.firePlayerLaser = function () {
        var playerShip = player.getBehavior();
        var position = playerShip.getPosition();
        var size = playerShip.getSpriteSize();
        var x = position.x;
        var yStart = position.y - (size.y / 2);
        var yEnd = -(wade.getMaxScreenHeight() / 2);
        ++laserShot;

        this.addLaser(x, yStart, x, yEnd, playerShip.shipType);
    }

    this.fireEnemyLaser = function (enemySprite) {
        var position = enemySprite.getPosition();
        var fireOffset = 10;
        var yStart = position.y + 20;
        var yEnd = wade.getMaxScreenHeight() / 2 + 100;
        var shipType = enemySprite.getBehavior().shipType;

        // bombers fire at a higher spread
        if (shipType == wade.app.battleShip || shipType == wade.app.motherShip) {
            var leftLaserXPosition = position.x - fireOffset;
            var rightLaserXPosition = position.x + fireOffset;

            this.addLaser(leftLaserXPosition, yStart, leftLaserXPosition, yEnd, shipType);
            this.addLaser(rightLaserXPosition, yStart, rightLaserXPosition, yEnd, shipType);
        }

        this.addLaser(position.x, yStart, position.x, yEnd, shipType);
    }

    this.autoFire = function () {
        if (gameState.currentState == gameState.game) {
            player.getBehavior().fire();

            if (wade.app.autoFire == true) {
                setTimeout(function () {
                    wade.app.autoFire();
                }, 350);
            }
        }
    };



    /*
    //	posmatranje igre
    //	proveravamo da li je igrač uništen
    //	proveravamo da li je igrač izgubio sve živote
    //	proveravamo da li je igrač sakupio dovoljno poena za nastavak
    //	proveravamo da li level treba da se poveća
    */
    this.gameManager = function () {
        // proveravamo da li je igrač uništen
        if (player.getBehavior().isDead()) {
            this.handleGameOver();
        }

        // proveravamo poene za sledeći level
        var currentStateScore = scoreBoard.getScore();
        if (currentStateScore >= level[numberLevel].pointsNeeded) {
            wade.app.gameStop();
            ++numberLevel;
            if (numberLevel > 4) {
                wade.app.gameStop();
                playerAccuracy = (enemyHit / laserShot) * 100;
                var levelBackSprite = new Sprite('./images/pozadinaRezultat.png');
                levelBackSprite.setSize(600, 140);
                var levelBackObj = new SceneObject(levelBackSprite, 0, 0, 0);
                var laserMsg = 'Lasers Hit - ' + enemyHit + ' Lasers Shot  - ' + laserShot;
                var playerMsg = 'Player Accuracy - ' + playerAccuracy.toFixed() + '%';
                var loadingMsg = 'Game will restart in 5 seconds...';
                var playerText = new TextSprite(playerMsg, '24px Verdana', '#FF0000', 'center');
                levelBackObj.addSprite(playerText, {x: 0, y: 0});
                var loadingText = new TextSprite(loadingMsg, '24px Verdana', '#FF0000', 'center');
                levelBackObj.addSprite(loadingText, {x: 0, y: 40});
                var laserText = new TextSprite(laserMsg, '24px Verdana', '#FF0000', 'center');
                levelBackObj.addSprite(laserText, {x: 0, y: -40});
                wade.addSceneObject(levelBackObj);
                scoreBoard.setMessage('Earth is saved!');
                setTimeout(function () {
                    wade.clearScene();
                    wade.app.init()
                }, 5000);
            }	// kraj ako numberLevel > 4
            else {
                scoreBoard.setMessage('You completed your mission!');
                player.setPosition(0, 100);
                wade.app.levelComplete();
            }	// kraj
        }	// kraj ako je rezultat postignut za sledeći level
    };	// kraj gameManager za proveravanje

    this.handleGameOver = function () {
        scoreBoard.setMessage('No more lives, game over!');
        wade.app.gameStop();

        setTimeout(function () {
            wade.clearScene();
            wade.app.init();
        }, 1000);
    }

    this.levelComplete = function () {
        var levelBackSprite = new Sprite('./images/pozadinaRezultat.png');
        levelBackSprite.setSize(600, 140);
        var levelBackObj = new SceneObject(levelBackSprite, 0, 0, 0);
        var fighterMsg = 'Ships Destroyed  - ' + destroyedEnemies + '  Ships Missed  - ' + pastEnemies;
        var bomberMsg = 'Battleships Destroyed - ' + battleshipsDestroyed + '  Battleships Missed  - ' + pastBosses;
        var fText = new TextSprite(fighterMsg, '24px Verdana', '#FF0000', 'center');
        var bText = new TextSprite(bomberMsg, '24px Verdana', '#FF0000', 'center');
        levelBackObj.addSprite(fText, {x: 0, y: -40});
        levelBackObj.addSprite(bText, {x: 0, y: 0});
        wade.addSceneObject(levelBackObj);
        var nextTextSprite = new TextSprite('Next Level', '32px Verdana', '#FF0000', 'center');
        nextText = new SceneObject(nextTextSprite, 0, -200, 40);
        wade.addSceneObject(nextText);

        var redoTextSprite = new TextSprite('Reset Level', '32px Verdana', '#FF0000', 'center');
        changeText = new SceneObject(redoTextSprite, 0, 200, 40);
        wade.addSceneObject(changeText);

        nextText.onMouseDown = function () {
            wade.removeSceneObject(levelBackObj);
            wade.removeSceneObject(changeText);
            wade.removeSceneObject(this);
            scoreBoard.initialize();
            wade.app.loadLevel(numberLevel);
            scoreBoard.setMessage(level[numberLevel].textLevel);
            player.getBehavior().setSpriteHealth(4);
            wade.app.gameGo();
        };

        changeText.onMouseDown = function () {
            wade.removeSceneObject(levelBackObj);
            wade.removeSceneObject(nextText);
            wade.removeSceneObject(this);
            --numberLevel;
            scoreBoard.initialize();
            wade.app.loadLevel(numberLevel);
            scoreBoard.setMessage(level[numberLevel].textLevel);
            player.getBehavior().setSpriteHealth(4);
            wade.app.gameGo();
        };

        wade.addEventListener(nextText, 'onMouseDown');
        wade.addEventListener(changeText, 'onMouseDown');
    };

    /*
    //	funkcija za pokretanje igre
    */
    this.gameGo = function () {
        wade.setMainLoopCallback(this.gameManager.bind(this), 'gameManager');
        wade.setMainLoopCallback(this.enemyLoop.bind(this), 'enemies');
        wade.setMainLoopCallback(this.checkPlayerCollision.bind(this), 'playerCollisions');
        wade.setMainLoopCallback(this.checkEnemyCollision.bind(this), 'enemyCollisions');
        gameState.currentState = gameState.game;

    };	// kraj

    /*
    //	funkcija za zaustavljanje igre
    */
    this.gameStop = function () {
        gameState.currentState = gameState.paused;
        wade.app.autoFire = false;
        wade.app.soundManager('stop', wade.app.soundShip);
        wade.setMainLoopCallback(null, 'gameManager');
        wade.setMainLoopCallback(null, 'enemies');
        wade.setMainLoopCallback(null, 'playerCollisions');
        wade.setMainLoopCallback(null, 'enemyCollisions')
        while (currentEnemies.length > 0) {
            var e = currentEnemies.pop();
            wade.removeSceneObject(e);
        }
    };	// kraj

    /*
    //	kolizije call back
    //	- proveravamo kolizije
    //	- prvo se proveravaju laseri igrača sa neprijateljskim brodovima
    //	- zatim neprijateljski brodovi i laseri sa igračem
    */
    this.checkPlayerCollision = function () {
        var overlapping = player.getOverlappingObjects();
        for (var k = 0; k < overlapping.length; k++) {
            // proveravanje da li preklapanje ima ponašanja jer laseri nemaju
            var isPlane = overlapping[k].getBehaviors();
            if (isPlane.length != 0) {
                this.handlePlayerCollisionWithEnemyPlane(overlapping[k]);
            } else if (overlapping[k].isEnemyLaser) {
                this.handlePlayerHitByLaser(overlapping[k]);
                wade.removeSceneObject(overlapping[k]);

            }
        }	// kraj petlje za preklapanje
    }

    this.handlePlayerHitByLaser = function (overlapping) {
        wade.removeSceneObject(overlapping);
        player.getBehavior().looseSpriteHealth(1);
        scoreBoard.loseLife();
        scoreBoard.setMessage("You were hit!");
        wade.app.soundManager('play', wade.app.soundHit, false);
    }

    this.handlePlayerCollisionWithEnemyPlane = function (overlapping) {
        if (overlapping.getBehavior().getSpriteType()) {
            wade.app.addExplosion(player.getPosition());
            wade.removeSceneObject(overlapping);
            wade.removeObjectFromArray(overlapping, currentEnemies);
            player.getBehavior().looseSpriteHealth(1);
            scoreBoard.loseLife();
        }

    }

    this.checkEnemyCollision = function () {
        var that = this;

        for (var i = currentEnemies.length - 1; i >= 0; i--) {
            var overlappingObjects = currentEnemies[i].getOverlappingObjects();

            overlappingObjects.forEach(function (overlapObject) {
                if (overlapObject.isPlayerLaser) {
                    that.handleEnemyHitByLaser(currentEnemies[i], overlapObject, i);
                    ++enemyHit;
                }
            });
        }	// kraj for petlje za trenutne neprijatelje
    }

    this.handleEnemyHitByLaser = function (enemySprite, laserSprite, enemyIndex) {
        var enemy = enemySprite.getBehavior();
        var health = enemy.getSpriteHealth();
        if (health <= 1) {
            this.handleEnemyKilled(enemySprite, enemyIndex);
            wade.app.addExplosion(laserSprite.getPosition());
        } else {
            var enemy = enemySprite.getBehavior();
            var health = enemy.getSpriteHealth() - 1;
            wade.app.soundManager('play', wade.app.soundHit, false);
            scoreBoard.setMessage('You hit a ship!');
            enemy.setSpriteHealth(health);
        }
        wade.removeSceneObject(laserSprite);
    };

    this.handleEnemyKilled = function (enemySprite, enemyIndex) {
        var enemy = enemySprite.getBehavior();
        var points = enemy.getScoreValue();
        var killType = enemy.getSpriteType();

        if (killType == wade.app.battleShip || killType == wade.app.motherShip) {
            ++battleshipsDestroyed;
        } else {
            ++destroyedEnemies;
        }

        // ++allDestroyedEnemies;

        scoreBoard.addScore(points);
        wade.removeSceneObject(enemySprite);
        wade.removeObjectFromArrayByIndex(enemyIndex, currentEnemies);
        scoreBoard.setMessage('You destroyed a ship!');
    }

    this.handleEnemyMoveCompleted = function (enemySprite) {
        var enemyType = this.getBehavior().getSpriteType();

        if (enemySprite.shipType == wade.app.battleShip || shipType == wade.app.motherShip) {
            ++pastBosses;
        } else {
            ++pastEnemies;
        }

        wade.removeSceneObject(this);
        wade.removeObjectFromArray(this, currentEnemies);
    }

    /*
    //	funkcija petlje za neprijatelje
    //	- stvaramo novog neprijatelja ako je potrebno
    //	- nameštamo neprijatelje da pucaju
    //	- koristimo ovo tdj za stvaranje zvezda
    */
    this.enemyLoop = function () {
        if (gameState.currentState == gameState.game) {
            if (currentEnemies.length < maxEnemies) {
                wade.app.spawnEnemy();
            }

            for (var i = 0; i < currentEnemies.length; i++) {
                if (Math.random() > enemyStartShoot) {
                    this.fireEnemyLaser(currentEnemies[i]);
                }
            }	// kraj for petlje za pucanje

            // stvaramo zvezdu
            if (Math.random() > 0.97) {
                wade.app.spawnStar();
            }

            var currentStateTime = wade.getAppTime();
            if ((currentStateTime - gameTime) > level[numberLevel].rampTime) {
                gameTime = currentStateTime;
                if (maxEnemies < level[numberLevel].maxEnemies) {
                    ++maxEnemies;
                }
                if (speedIncrease < wade.app.maximumIncreaseEnemySpeed) {
                    speedIncrease += level[numberLevel].speedIncrease;
                }
            }
        }	// kraj stanje igre traje igra
    };	// kraj enemyLoop

    /*
    // stvaramo neprijatelje
    */
    this.spawnEnemy = function () {
        // proracunavanje krajnje i pocetne koordinate
        var startX = (Math.random() - 0.5) * wade.getScreenWidth();
        var startY = -wade.getScreenHeight() / 2 - wade.app.enemySize / 2;
        var enemy = new SceneObject(0, Enemy, startX, startY);
        var mySpeed = enemySpeed;

        if (Math.random() > battleshipStartShoot) {
            enemy.getBehavior().initialize(wade.app.battleShip, 3, 64, 20);
        } else {
            enemy.getBehavior().initialize(wade.app.enemyShip, 1, 32, 10);
            mySpeed += speedIncrease;
        }

        if (level[numberLevel].number === 4) {
            enemy.getBehavior().initialize(wade.app.motherShip, 4, 96, 100);
            this.checkPlayerCollision();
        }

        wade.addSceneObject(enemy);
        var endX = (Math.random() - 0.5) * wade.getScreenWidth();
        var endY = -startY - wade.app.enemySize / 2;
        enemy.moveTo(endX, endY, mySpeed);
        currentEnemies.push(enemy);


        enemy.onMoveComplete = function () {
            var enemyType = this.getBehavior().getSpriteType();
            if (enemyType == wade.app.battleShip || enemyType == wade.app.motherShip) {
                ++pastBosses;
            }
            else {
                ++pastEnemies;
            }
            // ++allPastEnemies;
            wade.removeSceneObject(this);
            wade.removeObjectFromArray(this, currentEnemies);
        };	// kraj onMoveComplete
    };	// kraj spawnEnemy

    /*
    // stvaramo zvezdu random na osnovu sprajta slike
    // random pozicija početka i kraja,random veličina,random neprovidnost i random brzina
    */
    this.spawnStar = function () {
        var startX = (Math.random() - 0.5) * wade.getScreenWidth();
        var startY = wade.getScreenHeight() / 2;
        var endX = (Math.random() - 0.5) * wade.getScreenWidth();
        var endY = -startY;
        var sp = new Sprite('./images/zvezda.png');
        sp.setSize(Math.random() * 16 + 10, Math.random() * 16 + 10);
        sp.setDrawFunction(wade.drawFunctions.alpha_(100, sp.draw));
        var zvezda = new SceneObject(sp, 0, startX, startY);
        wade.addSceneObject(zvezda);
        zvezda.moveTo(endX, endY, Math.random() * 40 + 40);

        zvezda.onMoveComplete = function () {
            wade.removeSceneObject(this);
        };
    };	// kraj spawnStar

    /*
    // genericka funkcija dodatak lasera
    // ovo se koristi za igrače i neprijatelje da pucaju
    // proveravanje kolizije u callbacku
    // na move complete se jednostavno briše
    */
    this.addLaser = function (startX, startY, endX, endY, type) {
        if(gameState.currentState == gameState.game && currentEnemies.length != 0){
        var laser = new SceneObject(new Sprite('./images/laser.png'), 0, startX, startY);
        wade.addSceneObject(laser);
        wade.app.soundManager('play', wade.app.soundLaser, false);
        laser.moveTo(endX, endY, wade.app.laserSpeed);

        if (type == wade.app.enemyShip || type == wade.app.battleShip || type == wade.app.motherShip) {
            laser.isEnemyLaser = true;
        } else if (type == player.getBehavior().shipType) {
            laser.isPlayerLaser = true;
        }

        laser.onMoveComplete = function () {
            wade.removeSceneObject(this);
        };	// kraj laser on move complete
        }

    };	// kraj addLaser

    /*
    //	genericki dodatak explozije
    */
    this.addExplosion = function (pos) {
        var exSprite = new Sprite();
        var exAnimation = new Animation('./images/eksplozija.png', 6, 1, 10, false);
        exSprite.setSize(32, 32);
        exSprite.addAnimation('boom', exAnimation);
        var explosion = new SceneObject(exSprite, 0, pos.x, pos.y);
        wade.addSceneObject(explosion);
        explosion.playAnimation('boom');
        explosion.onAnimationEnd = function () {
            wade.removeSceneObject(this);
        };
        wade.app.soundManager('play', wade.app.soundExplosion, false);
    };	// kraj addExplosion

    /*
    //	konsolodijemo se sa menadžmentom zvuka u jedno mesto
    //	varijabla sound se stavlja na true ili false za debugg
    */
    this.soundManager = function (action, sound, loop) {
        if (wade.app.sound) {
            switch (action) {
                case 'play':
                    wade.playAudio(sound, false);
                    break;

                case 'playBackground':
                    var backObj = {name: sound, oid: 0};
                    backObj.oid = wade.playAudio(sound, loop);
                    backgroundSound.push(backObj);
                    break;

                case 'stop':
                    for (var i = backgroundSound.length - 1; i >= 0; i--) {
                        if (sound == backgroundSound[i].name) {
                            wade.stopAudio(backgroundSound[i].oid);
                            wade.removeObjectFromArrayByIndex(i, backgroundSound);
                            break;
                        }
                    }

                    break;

                case 'unload':
                    wade.unloadAudio(sound);
                    break;

                case 'stopAll':
                    wade.unloadAllAudio();
                    break;
                default:
                    break;
            }
            ;
        }
        ;
    };	// kraj soundManager

}	// kraj App