import EnemyGroup from "./EnemyGroup";
import PlatformSprite from "./PlatformSprite";
import { GameOptions } from "./gameData/GameOptions";
import GameUtil from "./GameUtil";
import Rectangle = Phaser.Geom.Rectangle;

export default class EnemySprite extends Phaser.Physics.Arcade.Sprite
{
    platform: PlatformSprite;
    body: Phaser.Physics.Arcade.Body;

    constructor(scene:Phaser.Scene, platform:PlatformSprite, group:EnemyGroup)
    {
        super(scene, platform.x, platform.y - 100, 'enemy');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale = GameOptions.pixelScale;
        
        this.body.setSize(
            this.displayWidth / GameOptions.pixelScale * 0.6, 
            this.displayHeight / GameOptions.pixelScale * 0.9, true);
        this.body.setOffset(7, 1);
        this.platform = platform;

        group.add(this);

        this.setVelocityX(GameUtil.Rand(GameOptions.enemyPatrolingSpeed) * Phaser.Math.RND.sign());
        this.anims.play('enemy_run', true);
    }

    patrol(): void 
    {
        this.setFlipX(this.body.velocity.x > 0);
        let platformBounds : Rectangle = this.platform.getBounds(); //외곽 경계 알아내기
        let enemyBounds : Rectangle = this.getBounds();

        let enemyVelocityX : number = this.body.velocity.x;

        //크기 보정 걸어주고
        if ((platformBounds.right + 25 < enemyBounds.right 
                && enemyVelocityX > 0) ||  //오른쪽으로 넘어갔거나
                (platformBounds.left -25 > enemyBounds.left && enemyVelocityX < 0)) { //왼쪽으로 넘어갔다면
 
            // 스피드를 방향전환 시킨다.
            this.setVelocityX(enemyVelocityX * -1);
        }
    }

    groupToPool(group: EnemyGroup, pool: EnemySprite[]): void
    {
        group.remove(this); //피직스 그룹에서 빼주고 
        pool.push(this); // 풀에다가 넣어준다.
    }

    //풀에서 그룹으로 다시 넣어주는 함수
    poolToGroup(platform: PlatformSprite, group: EnemyGroup): void 
    {
        this.platform = platform;
        this.x = platform.x;
        this.y = platform.y - 120;
        this.setVisible(true);
        group.add(this);

        this.body.setAllowGravity(true);
        this.setVelocityX(GameUtil.Rand(GameOptions.enemyPatrolingSpeed) * Phaser.Math.RND.sign());
        this.anims.play('enemy_run', true);
        this.setFlipY(false);
    }
}