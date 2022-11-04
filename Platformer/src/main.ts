import 'phaser';
import PlayGameScene from './Scenes/PlayGameScene';
import PreloadAssetScene from './Scenes/PreloadAssetScene';
import {GameOption} from './GameOption';


let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:GameOption.width,
    height:GameOption.height,
}

let physicsConfig : Phaser.Types.Core.PhysicsConfig = {
    default: "arcade",
    arcade: {
        debug:true,
        gravity:{y:200}
    }
}

let config : Phaser.Types.Core.GameConfig = {
    physics: physicsConfig,
    type: Phaser.AUTO,
    scale: scaleObject,
    scene: [PreloadAssetScene, PlayGameScene],
    pixelArt:true
};

new Phaser.Game(config);