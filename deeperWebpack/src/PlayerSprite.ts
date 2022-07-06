import { GameOptions } from "./gameData/GameOptions";

export default class PlaterSprite extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene)
    {
        const {width, height} = GameOptions.gameSize;
        super(scene, width * 0.5, height * GameOptions.firstPlatformPosition - 100 , 'hero');

        scene.add.existing(this); //씬에 추가
        scene.physics.add.existing(this); //씬의 물리엔진에 추가
    }

    
}