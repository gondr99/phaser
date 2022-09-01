import { GameOptions } from "./gameData/GameOptions";

export default class PlaterSprite extends Phaser.Physics.Arcade.Sprite
{
    LEFT: number = -1;
    RIGHT: number = 1;
    STOP: number = 0;
    currentMovement: number = this.STOP;

    constructor(scene: Phaser.Scene)
    {
        const {width, height} = GameOptions.gameSize;
        super(scene, width * 0.5, height * GameOptions.firstPlatformPosition - 100 , 'hero');

        scene.add.existing(this); //씬에 추가
        scene.physics.add.existing(this); //씬의 물리엔진에 추가

        this.scale = GameOptions.pixelScale;
        //물리충돌체 사이즈를 실제 보이는 것과 유사하게 변경한다.
        // 스케일을 업시키면서 물리 사이즈도 같이 증가하기 때문이다.
        this.body.setSize(this.displayWidth/ GameOptions.pixelScale * 0.6, 
                        this.displayHeight/ GameOptions.pixelScale * 0.7, false);
 
        //오프셋을 변경시켜서 좌측 상단에서 조금 떨어진 곳에서 시작
        //이건 그냥 감으로 조정하면서 찾아야해.
        this.body.setOffset(7, 9); 
    }

    setMovement(n: number): void {
        this.currentMovement = n;
    }

    move(): void 
    {
        this.setVelocityX(GameOptions.heroSpeed * this.currentMovement);

        switch(this.currentMovement)
        {
            case this.LEFT:
                this.setFlipX(true);
                this.anims.play('run', true);
                break;
            case this.RIGHT:
                this.setFlipX(false);
                this.anims.play('run', true);
                break;
            case this.STOP:
                this.anims.play('idle', true);
                break;

        }
    }
    
}