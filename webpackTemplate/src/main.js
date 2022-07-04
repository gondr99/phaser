import 'phaser';

class PlayGameScene extends Phaser.Scene {
    constructor()
    {
        super("PlayGame");
    }

    preload() {
        this.load.image('logo', 'assets/logo.png');
    }
    create() {
        this.image = this.add.image(400, 300, 'logo');
        //this.image.setScale(0.1);
    }
    update() {
        this.image.rotation += 0.01;
    }
}

let config = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent:'theGame',
        width:800,
        height:600,
        
    },
    scene: PlayGameScene
};

new Phaser.Game(config);