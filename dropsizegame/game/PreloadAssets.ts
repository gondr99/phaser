export class PreloadAssets extends Phaser.Scene {
    constructor()
    {
        super( { key : "PreloadAssets"});
    }

    preload()
    {
        this.load.image('base', 'assets/base.png');
        this.load.image('square', 'assets/square.png');
        this.load.image('top', 'assets/top.png');
        this.load.bitmapFont('onefont', 'assets/fonts/onefont_0.png', 'assets/fonts/onefont.fnt');
    }

    create()
    {
        this.scene.start('PlayGame');
    }
}