const Player = require('../Player');

describe('Player', () => {
    const xBorder = 314;
    const yBorder = 150;

    let player;

    beforeEach(function() {
        player = new Player();
        player.initialize(1, 4, 32);
    });

    afterEach(function() {
        player = null;
    });

    describe('Movement', () => {
        it('should correctly calculate move position', () => {
            const moveX = 240;
            const moveY = 100;
            const movePosition = player.getMovePosition(moveX, moveY, xBorder, yBorder);

            expect(movePosition).toEqual({ x: moveX, y: moveY });
        });

        it('should not be able to move out of bounds', () => {
            let moveX = 300;
            let moveY = 160;
            let movePosition = player.getMovePosition(moveX, moveY, xBorder, yBorder);

            expect(movePosition).toEqual({ x: moveX, y: yBorder });

            moveX = 350;
            moveY = 140;
            movePosition = player.getMovePosition(moveX, moveY, xBorder, yBorder);

            expect(movePosition).toEqual({ x: xBorder, y: moveY });

            moveX = 350;
            moveY = 160;
            movePosition = player.getMovePosition(moveX, moveY, xBorder, yBorder);

            expect(movePosition).toEqual({ x: xBorder, y: yBorder });
        });
    });

    describe('Energy', () => {
        it('should be able to loose energy', () => {
            expect(player.energy).toBe(4);
            player.looseSpriteHealth();
            expect(player.energy).toBe(3);
        });

        it('should be able to set energy', () => {
            expect(player.energy).toBe(4);
            player.setSpriteHealth(10);
            expect(player.energy).toBe(10);
        });

        it('should not be able to set energy below 0', () => {
            expect(player.energy).toBe(4);
            player.setSpriteHealth(-10);
            expect(player.energy).toBe(0);
        })
    })
});
