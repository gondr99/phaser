import { GameOptions } from "./GameOptions";

export class PreloadAssets extends Phaser.Scene
{
    constructor()
    {
        super({key:"PreloadAssets"});
    }

    preload(): void 
    {
        this.load.spritesheet("tiles", "assets/tiles.png", {
            frameWidth: GameOptions.tileSize,
            frameHeight: GameOptions.tileSize
        });
    }

    create(): void
    {
        this.scene.start("PlayGameScene");
    }
}