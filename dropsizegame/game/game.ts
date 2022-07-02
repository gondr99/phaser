import Phaser from 'phaser';
import { ScaleObject } from './DataTS/ScaleObject';
import { PreloadAssets } from './PreloadAssets';
import { PlayGame } from './PlayGame';

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale:ScaleObject,
    scene:[PreloadAssets, PlayGame]
}

new Phaser.Game(config);