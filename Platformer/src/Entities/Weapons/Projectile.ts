import Phaser from "phaser";

export default class Projectile extends Phaser.Physics.Arcade.Sprite 
{
    speed:number;
    body:Phaser.Physics.Arcade.Body;
    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.speed = speed;
    }

    fire() : void 
    {
        console.log("Fire projectile");
        this.setVelocityX(this.speed);
    }
}