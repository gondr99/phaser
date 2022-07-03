import { GameOptions } from "./gameData/GameOptions";

//하나의 오브젝트에 여러개를 렌더링하기 위해서 사용하는게 RenderTexture, Sprite와는 다름.
export default class PlatformSprite extends Phaser.GameObjects.RenderTexture 
{
    isHeroOnIt: Boolean = false;
    body: Phaser.Physics.Arcade.Body;
    assignedVelocity: number = 0;

    canLandOnIt: Boolean = false;

    constructor(scene: Phaser.Scene, x: number, y:number, width: number, height: number)
    {
        super(scene, x, y, width, height);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    setPhysics() : void 
    {
        this.body.setImmovable(true);  //움직일 수 없도록 셋팅
        this.body.setAllowGravity(false); //중력 적용 안받도록
        this.body.setFrictionX(1);  //X축 마찰력 1로 셋팅
    }

    drawTexture(border: Phaser.GameObjects.Graphics, 
                pattern: Phaser.GameObjects.TileSprite, 
                eyes: Phaser.GameObjects.Sprite) : void {
        border.clear();
        border.lineStyle(8, 0x000, 1); //라인두께, 색상, 알파값
        border.strokeRect(0, 0, this.displayWidth, this.displayHeight); //렌더 텍스쳐의 크기만큼 사각형 그려주기
        this.draw(pattern, this.displayWidth * 0.5, Phaser.Math.Between(0, GameOptions.platformHeight));
        this.draw(eyes, this.displayWidth / 2, this.displayHeight / 2);
        this.draw(border);
    }

    transformTo(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.setSize(width, height);
        this.body.setSize(width, height);
    }

    explodeAndDestroy(emitter: Phaser.GameObjects.Particles.ParticleEmitter): void {
        let platformBounds: Phaser.Geom.Rectangle = this.getBounds();
        emitter.setPosition(platformBounds.left, platformBounds.top); //왼쪽 상단을 포지션으로 
        emitter.active = true;
        emitter.setEmitZone({
            source: new Phaser.Geom.Rectangle(0, 0, platformBounds.width, platformBounds.height),
            type: 'random',
            quantity: 50
        });
        emitter.explode(50, this.x - this.displayWidth * 0.5, this.y - this.displayHeight * 0.5);
        this.clearTint();
        this.isHeroOnIt = false;
        this.canLandOnIt = false;
    }
}