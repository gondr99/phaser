import 'phaser';
import { PlayGameScene } from './PlayGameScene';


const scaleObject : Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:500,
    height:500,
}

let config = {
    type:Phaser.AUTO,
    scale: scaleObject,
    scene: [PlayGameScene]
};

new Phaser.Game(config);