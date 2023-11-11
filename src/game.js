class Platformer extends Phaser.Scene {
    preload() {
        this.load.setBaseURL('https://labs.phaser.io');

        this.load.image('sky', 'src/games/firstgame/assets/sky.png');
        this.load.image('ground', 'src/games/firstgame/assets/platform.png');
        this.load.image('star', 'src/games/firstgame/assets/star.png');
        this.load.spritesheet('dude', 'src/games/firstgame/assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
    }

    create() {
        const platforms = this.physics.add.staticGroup();

        platforms.create(config.width*0.5, config.height*0.95, 'ground').setScale(5).refreshBody(); // this is the floor

        this.player = this.physics.add.sprite(config.width*0.5, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        const stars = this.physics.add.group({ allowGravity: false });

        //  x, y = center of the path
        //  width, height = size of the elliptical path

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, platforms);

        this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
    }

    update() {
        const { left, right, up } = this.cursors;

        if (left.isDown) {
            this.player.setVelocityX(-200);

            this.player.anims.play('left', true);
        }
        else if (right.isDown) {
            this.player.setVelocityX(200);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
    }
}


const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Set initial width to full window width
    height: window.innerHeight, // Set initial height to full window height
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 9.8 * 60 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE, // Scale the game to fill the entire screen
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Platformer
};

const game = new Phaser.Game(config);