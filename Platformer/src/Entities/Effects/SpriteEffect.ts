import Phaser from "phaser";
import CollideableObject from "../CollideableObject";

//이펙트는 피직스일 필요 없다.
export default class SpriteEffect extends Phaser.GameObjects.Sprite
{
    effectName:string;

    target:CollideableObject;
    offset:Phaser.Math.Vector2; //생성지점과 타겟사이의 오프셋
    constructor(scene: Phaser.Scene, x:number, y:number, effectName:string)
    {
        super(scene, x, y, effectName);
        this.scene.add.existing(this);

        this.effectName = effectName;

        //애니메이션 종료시 발생하는 이벤트
        this.on("animationcomplete", (animation:Phaser.Animations.Animation) => {
            this.destroy();
        }, this);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        if(this.target != undefined){
            let targetCenter = this.target.getCenter();
            this.x = targetCenter.x + this.offset.x;
            this.y = targetCenter.y + this.offset.y;
        }
        
    }
    //특정 타겟 위에서 재생
    playOn(pos:Phaser.Math.Vector2, target: CollideableObject): void
    {
        this.target = target;

        let targetCenter = target.getCenter();
        this.offset = new Phaser.Math.Vector2( pos.x - targetCenter.x, pos.y - targetCenter.y);

        this.x = pos.x;
        this.y = pos.y;
        this.play(this.effectName, true);
    }
}