import 'phaser';
import {PreloadAssets} from './PreloadAssets';
import {PlayGameScene} from './PlayGameScene';

let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:320,
    height:320, 
}
 
let config = { 
    type: Phaser.AUTO,
    scale: scaleObject,
    backgroundColor:0x262626,
    scene: [PreloadAssets, PlayGameScene],
    pixelArt: true
};

new Phaser.Game(config);