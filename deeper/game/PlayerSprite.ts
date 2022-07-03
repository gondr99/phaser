export default class PlaterSprite extends Phaser.Physics.Arcade.Sprite
{
    //플레이어가 처음으로 움직이고 있는가? (맨 처음 움직임.)
    firstMove: Boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string)
    {
        super(scene, x, y, key);

        scene.add.existing(this); //씬에 추가
        scene.physics.add.existing(this); //씬의 물리엔진에 추가
    }

    
}