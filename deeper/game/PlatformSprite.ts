export default class PlatformSprite extends Phaser.Physics.Arcade.Sprite
{
    body: Phaser.Physics.Arcade.Body;
    //플랫폼 바디가 높이 있는가?
    isHigher: Boolean = false;
    //플랫폼의 타입
    platformType: number = 0;   
    //플랫폼이 페이드 아웃되어 사라졌는가?
    isFadingOut: Boolean = false;
    
    constructor(scene: Phaser.Scene, x: number, y: number, key: string)
    {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    addToGroup(group: Phaser.Physics.Arcade.Group)
    {
        group.add(this);
        this.body.setImmovable(true); //플랫폼의 바디가 물리엔진에 영향 받지 않게 설정
        this.body.setAllowGravity(false); //중력에 영향을 받지 않도록 설정
    }
}