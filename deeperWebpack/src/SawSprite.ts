import PlatformSprite from "./PlatformSprite";
import GameUtil from "./GameUtil";
import { GameOptions } from "./gameData/GameOptions";
import SawGroup from "./SawGroup";
import Rectangle = Phaser.Geom.Rectangle;

export default class SawSprite extends Phaser.Physics.Arcade.Sprite
{
    platformToPatrol:PlatformSprite;
    body:Phaser.Physics.Arcade.Body;

    constructor(scene:Phaser.Scene, platform:PlatformSprite, group: SawGroup)
    {
        super(scene, platform.x, platform.y, 'saw');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale = GameOptions.pixelScale;
        this.anims.play('saw', true);

        group.add(this);

        // 바디를 원형으로 만들어준다. 이 값들은 직접 찾아내야 한다.(노가다 On)
        let bodySize: number = this.displayWidth * 0.5 / this.scale * 0.8;
        this.setCircle(bodySize, 4, 4);
        
        this.platformToPatrol = platform;
        this.setVelocityX(GameUtil.Rand(GameOptions.sawSpeedRange) * Phaser.Math.RND.sign()); //부호 랜덤
        this.setVelocityY(platform.body.velocity.y);
        this.body.setAllowGravity(false);
    }

    groupToPool(group: SawGroup, pool: SawSprite[]): void 
    {
        this.setVelocity(0, 0);
        group.remove(this);
        pool.push(this);
    }

    poolToGroup(platform: PlatformSprite, group: SawGroup): void 
    {
        this.platformToPatrol = platform;
        this.x = platform.x;
        this.y = platform.y;

        group.add(this);

        this.setVelocityX(GameUtil.Rand(GameOptions.sawSpeedRange) * Phaser.Math.RND.sign()); //부호 랜덤
        this.setVelocityY(platform.body.velocity.y);
    }

    patrol(): void 
    {
        let platformBounds : Rectangle = this.platformToPatrol.getBounds();
        let sawBounds : Rectangle = this.getBounds();

        let sawVelocityX : number = this.body.velocity.x;

        //방향에 따라 플랫폼에 끝에 도달했다면 전환하기
        if ((platformBounds.right + 25 < sawBounds.right && sawVelocityX > 0) 
            || (platformBounds.left - 25 > sawBounds.left && sawVelocityX < 0)) {
 
            // invert saw horizontal speed
            this.setVelocityX(sawVelocityX * -1);
        }
    }
}