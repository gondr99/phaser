import Phaser, { Scenes } from "phaser"
import HealthBar from "../HUD/HealthBar";
import Hud from "../HUD/Hud";

export default class UIManager
{
    static Instance:UIManager;
    healthBar: HealthBar;
    hud: Hud;

    scene:Phaser.Scene;

    constructor(scene: Phaser.Scene)
    {
        this.scene = scene;
        this.healthBar = new HealthBar(scene, 20, 20, 2);
        this.hud = new Hud(scene, 0, 0);
    }

    setHP(hp:number): void 
    {

    }
}