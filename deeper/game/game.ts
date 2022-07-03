import Phaser from 'phaser';
import { PlayGameScene } from './PlayGameScene';
import { PreloadAssets } from './PreloadAssets';
import { GameOptions } from './gameData/GameOptions';



const scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'theGame',
    width: 750,
    height: 1334
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