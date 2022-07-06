
export class PreloadAssets extends Phaser.Scene 
{
    constructor() {
        super({key: 'PreloadAssets'});
    }

    preload() : void {
        this.load.image('hero', 'assets/hero.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.bitmapFont('onefont', 'assets/fonts/onefont_0.png', 'assets/fonts/onefont.fnt');
    }

    create() : void {
        this.scene.start('PlayGame');
    }
}