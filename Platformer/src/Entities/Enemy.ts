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
        this.initEvents();
    }

    abstract init():void ;

    initEvents(): void
    {
        //스프라이트는 업데이트가 없으니까 업데이트시에 이것도 실행해달라고 요청해야 함.
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    abstract update(time: number, delta: number): void;
}