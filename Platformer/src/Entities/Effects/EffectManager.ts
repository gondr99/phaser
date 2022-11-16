
import Phaser from "phaser";
import CollideableObject from "../CollideableObject";
import SpriteEffect from "./SpriteEffect";

export default class EffectManager
{
    static Instance: EffectManager;

    scene: Phaser.Scene;

    constructor(scene:Phaser.Scene)
    {
        this.scene = scene;
    }

    PlayEffectOn(effectName:string, pos:Phaser.Math.Vector2, target: CollideableObject)
    {
        let effect = new SpriteEffect(this.scene, pos.x, pos.y, effectName);
        effect.playOn(pos, target);
    }
}