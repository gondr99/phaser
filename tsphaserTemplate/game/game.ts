import Phaser from 'phaser';
import {GameScene} from "./gameScene";

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width:800,
    height:600,
    scene:GameScene
}

new Phaser.Game(config);