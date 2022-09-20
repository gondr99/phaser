export class PreloadAsset extends Phaser.Scene
{
    constructor()
    {
        super({key: 'PreloadAssets'});
    }

    preload(): void
    {
        this.load.spritesheet('items', 'assets/items.png', {
            frameWidth:100,
            frameHeight:100
        });
    }

    create(): void 
    {
        this.scene.start('PlayGameScene');
    }
}