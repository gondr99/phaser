import Phaser, { Scenes, Tilemaps } from "phaser";
import CollideableObject from "../CollideableObject";
import EffectManager from "../Effects/EffectManager";

export default class MeleeWeapon extends CollideableObject
{
    damage:number;
    weaponName:string;
    weaponAnim:string;

    wielder:Phaser.Physics.Arcade.Sprite;
    body: Phaser.Physics.Arcade.Body;
    offset: Phaser.Math.Vector2;

    constructor(scene:Phaser.Scene, x:number, y:number, weaponName:string, damage:number)
    {
        super(scene, x, y, weaponName);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.damage = damage;
        this.weaponName = weaponName;
        

        this.weaponAnim = `${weaponName}_swing`;

        this.body.setAllowGravity(false);
        this.activeWeapon(false);

        this.setDepth(10); //z-index를 땡겨
        //애니메이션 재생 끝나면 비활성화
        this.on("animationcomplete", (animation:Phaser.Animations.Animation) => {
            this.activeWeapon(false);
            this.body.reset(0, 0);
        }, this);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        if(this.active == false) return;

        let wCenter = this.wielder.getCenter();
        this.body.reset(wCenter.x + this.offset.x, wCenter.y);
    }

    swing(wielder: Phaser.Physics.Arcade.Sprite, direction:number):void 
    {
        this.wielder = wielder;
        this.activeWeapon(true);
        
        let wCenter = wielder.getCenter();
        this.setFlipX(direction < 0);
        this.offset = new Phaser.Math.Vector2(direction * wielder.displayWidth, 0);
        this.body.reset(wCenter.x + this.offset.x, wCenter.y);
        this.play(this.weaponAnim);
    }

    activeWeapon(value:boolean)
    {
        this.setActive(value);
        this.setVisible(value);
    }

    createExplosion(target: CollideableObject): void 
    {
        let dir : number = this.flipX ? -1 : 1;
        
        let center = this.getCenter(); 
        center.x += this.displayWidth * 0.3 * dir;

        EffectManager.Instance.PlayEffectOn("hiteffect", center, target);
    }
}