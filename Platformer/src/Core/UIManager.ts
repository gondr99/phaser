import Phaser, { Scenes } from "phaser"
import { GameOption } from "../GameOption";
import HealthBar from "../HUD/HealthBar";


export default class UIManager
{
    static Instance:UIManager;
    healthBar: HealthBar;

    scene:Phaser.Scene;

    constructor(scene: Phaser.Scene)
    {
        this.scene = scene;
        this.healthBar = new HealthBar(scene, 20, 20, 2);
    }

    setHP(hp:number): void 
    {

    }
}