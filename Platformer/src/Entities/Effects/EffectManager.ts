
import Phaser from "phaser";
import CollideableObject from "../CollideableObject";
import SpriteEffect from "./SpriteEffect";

export default class EffectManager extends Phaser.GameObjects.Group
{
    static Instance: EffectManager;

    effects: SpriteEffect[]; //스프라이트 이펙트 풀링

    constructor(scene:Phaser.Scene)
    {
        super(scene);

        this.effects = this.createMultiple({
            frameQuantity:10,  //얼마나 많은 이펙트가
            active:false,
            visible:false,
            key:'hiteffect',
            classType: SpriteEffect
        }) as SpriteEffect[];
    }

    PlayEffectOn(effectName:string, pos:Phaser.Math.Vector2, target: CollideableObject)
    {
        const effect = this.getFirstDead(true) as SpriteEffect; //만약 없으면 생성까지
        effect.setActive(true);
        effect.setVisible(true);

        effect.playOn(pos, target);
    }
}