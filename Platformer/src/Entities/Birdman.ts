import Phaser, { Scenes } from 'phaser';

export default class Birdman extends Phaser.Physics.Arcade.Sprite
{
    speed:number;

    constructor(scene:Phaser.Scene, x:number, y:number)
    {
        super(scene, x, y, "birdman");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
    }

    init():void 
    {
        this.setOrigin(0.5, 1); //아래쪽 중앙에 잡아준다.

        this.setCollideWorldBounds(true); //월드 경계선과 충돌하도록 처리
        //InitAnimation(this.scene.anims); //애니메이션 초기화

    }

    addCollider(other : Phaser.GameObjects.GameObject | Phaser.GameObjects.Group) : Birdman
    {
        this.scene.physics.add.collider(this, other);
        return this;
    }
}