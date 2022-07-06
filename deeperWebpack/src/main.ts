import Phaser from 'phaser';
import { PlayGameScene } from './PlayGameScene';
import { PreloadAssets } from './PreloadAssets';
import { GameOptions } from './gameData/GameOptions';


const {width, height} = GameOptions.gameSize;

const scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'theGame',
    width,
    height
}

const physicsObject: Phaser.Types.Core.PhysicsConfig = {
    default: 'arcade',
    arcade: {
        gravity: {
            y: GameOptions.gameGravity
        },
        debug:true
    }
    
}

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x444444,
    scale: scaleObject,
    scene: [PreloadAssets, PlayGameScene],
    physics: physicsObject
}

new Phaser.Game(config);