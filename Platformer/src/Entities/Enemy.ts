import CollideableObject from "./CollideableObject";

export default abstract class Enemy extends CollideableObject
{
    speed:number;

    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number)
    {
        super(scene, x, y, "birdman");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;

        this.init();
    }

    abstract init():void ;
}