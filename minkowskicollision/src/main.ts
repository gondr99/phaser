import 'phaser';
import { PlayGameScene } from './PlayGameScene';

//민코프스키 덧셈은 A다각형과 B다각형을 B다각형을 A다각형만큼 팽창시키는 것을 뜻함.
//A의 모든 벡터를 B의 모든 벡터에 더해서 만들어진다. 

const scaleObject : Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:800,
    height:420,
}

let config = {
    scale: scaleObject,
    scene: [PlayGameScene],
    physics: {
        default: 'arcade'
    }
};

new Phaser.Game(config);