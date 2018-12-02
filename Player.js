Player = function () {

    /*
    //	Called before adding the object to the scene
    //	Gives you a chance to set the sprite type and size
    // 	Could add other stuff here in the future if necessary
    */
    this.initialize = function (shipType, energy, spriteSize) {
        this.shipType = shipType || 1;
        this.energy = energy || 4;
        this.spriteSize = spriteSize || 32;
    };

    /*
    //	Called on default by the wade engine on addSceneObject
    //	Setup the player sprite, its size and animation (propeller roates)
    */
    this.onAddToScene = function () {
        var shipSprite = new Sprite();
        shipSprite.setSize(this.spriteSize, this.spriteSize);
        var pAnimation = new Animation('./images/svemirskiBrod.png', 3, 1, 10, true);
        shipSprite.addAnimation('svemirski brod', pAnimation);
        shipSprite.playAnimation('svemirski brod');
        this.owner.addSprite(shipSprite);
    };

    /*
    //	Move the player sprite to the mouse location
    */
    this.move = function (xPosition, yPosition, xBorder, yBorder) {
        var movePosition = this.getMovePosition(xPosition, yPosition, xBorder, yBorder);
        this.owner.moveTo(movePosition.x, movePosition.y, 250);
    };

    /*
    //	Accessor function for getting this sprites attributes
    */
    this.getPosition = function () {
        return this.owner.getPosition();
    }

    this.getMovePosition = function (goX, goY, xBorder, yBorder) {
        var movePosition = {};

        if (goX > xBorder) {
            movePosition.x = xBorder;
        } else if (goX <= xBorder) {
            movePosition.x = goX;
        }

        if (goY > yBorder) {
            movePosition.y = yBorder;
        } else if (goY <= yBorder) {
            movePosition.y = goY;
        }

        return movePosition;
    }

    this.isDead = function () {
        return this.getSpriteHealth() === 0;
    }

    this.getSpriteSize = function () {
        return this.owner.getSprite().getSize();
    };

    this.getSpriteType = function () {
        return this.shipType;
    };

    this.looseSpriteHealth = function (val) {


        this.energy -= val || 1;

        if (this.energy <= 0) {
            this.energy = 0;
        }
    };

    this.setSpriteHealth = function (val) {
        if (wade.app.level == 4) {
            this.energy = 1;
        }
        else {
            this.energy = val || 4;

        }
        if (this.energy <= 0) {
            this.energy = 0;
        }
    };

    this.getSpriteHealth = function () {
        return this.energy;
    };
};

//Add a conditional export for testing purposes
if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = Player;
}