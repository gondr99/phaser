import 'phaser';
import { PlayGameScene } from './PlayGameScene';
import { PreloadAsset } from './PreloadAsset';


let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:1000,
    height:800,
}

let config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: scaleObject,
    scene: [PreloadAsset,  PlayGameScene]
};

new Phaser.Game(config);