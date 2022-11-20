
import Phaser from "phaser";

export default class Collectable extends Phaser.Physics.Arcade.Sprite 
{
    score:number;

    constructor(scene:Phaser.Scene, x:number, y:number, key:string, score:number = 1)
    {
        super(scene, x, y, key);

        scene.add.existing(this);

        this.score = score;
        

        this.scene.tweens.add({
            targets:this,
            y: this.y - Phaser.Math.Between(3, 6),
            duration: Phaser.Math.Between(1500, 2500),
            repeat:-1,
            ease:"linear",
            yoyo:true
        });
    }
}